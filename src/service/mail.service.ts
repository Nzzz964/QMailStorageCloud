import * as cheerio from "cheerio";
import { logger } from "../logger";
import { Mail as MailApi } from "../api";
import { Queue } from "../models";
import { sequelize } from "../bootstrap";
import { consume } from "./queue.service";

const log = logger("Mail-Service");

enum Selector {
    MAIL_LIST = 'td[hitmailid]',
    NOBR = 'nobr[mailid]',
    /** 总邮件数量 */
    TOTAL = '.txt_title .graytext .green:nth-child(2)',
}

interface MailList {
    mids: string[],
    total: number,
}

export const fetch = async (page: number = 0): Promise<MailList> => {
    const response = await MailApi.search("[QMailStorage服务]", page);
    const $ = cheerio.load(response.data);
    const mailList = $(Selector.MAIL_LIST);

    const mids: string[] = [];
    for (const item of mailList) {
        const mid = $(item).find(Selector.NOBR).attr('mailid');
        mids.push(mid);
    }
    const total = Number.parseInt($(Selector.TOTAL).text(), 0);
    return { mids: mids, total };
}

export const init = async () => {
    /** 查询到的总条数 */
    let total: number;
    /** 当前页数 */
    let page: number = 0;
    /** 总页数 */
    let pageTotal: number;

    const mails: string[] = [];

    do {
        const result = await fetch(page);
        mails.push(...result.mids);
        if (page === 0) {
            total = result.total;
            pageTotal = Math.ceil(total / 25);
        }
        page++;
    } while (page < pageTotal);

    const transaction = await sequelize.transaction();
    try {
        for (const mid of mails) {
            await Queue.findOrCreate({
                where: { mid },
                defaults: { mid },
                transaction
            });
        }
        await transaction.commit();
        await consume();
    } catch (err) {
        await transaction.rollback();
        log.error(err);
        log.error(err.stack);
    }
}