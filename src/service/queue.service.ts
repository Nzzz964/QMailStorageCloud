import * as cheerio from "cheerio";
import { logger } from "../logger";
import { Mail, MailBody } from "../types";
import { Mail as Api } from "../api";
import { Queue, File, Mail as ModelMail } from "../models";
import { sequelize } from "../bootstrap";

const log = logger("Queue-Service");

enum Selector {
    /** 邮件标题 */
    TITLE = '#subject',
    /** 邮件正文 */
    DETAIL = '#mailContentContainer',
}

/**
 * 将邮件正文转换为 JSON
 */
export const detail = async (mid: string): Promise<Mail> => {
    const response = await Api.detail(mid);
    const $ = cheerio.load(response.data);

    const title = $(Selector.TITLE).text();
    const body = $(Selector.DETAIL)
        .text()
        .replace(/\n/g, '')
        .replace(/[\xa0]/g, '');

    log.info(`${mid}: ${body}`);
    const bodyJson = JSON.parse(body) as MailBody;
    return { ...bodyJson, title, mailID: mid };
}

export const consume = async () => {
    const tasks = await Queue.tasks();
    if (!tasks) return;

    for (const task of tasks) {
        const transaction = await sequelize.transaction();
        try {
            const body = await detail(task.mid);
            const [file, _] = await File.findOrCreate({
                where: {
                    guid: body.guid,
                },
                defaults: {
                    guid: body.guid,
                    name: body.filename,
                    desc: body.desc,
                    size: body.size,
                    total: body.total,
                    sha1: body.sha1
                },
                transaction
            });
            const has = await ModelMail.findOne({
                where: {
                    file_guid: file.guid,
                    mid: body.mailID
                },
                transaction
            });
            if (!has) {
                await file.createMail({
                    title: body.title,
                    mid: body.mailID,
                    attach_filename: body.chunk_filename,
                    attach_sha1: body.chunk_sha1,
                    seq: body.seq,
                }, { transaction });
            }

            task.done = 1;
            await task.save({ transaction });
            await transaction.commit();
        } catch (err) {
            if (err.name === "SequelizeValidationError") {
                log.warn(`${task.mid} 数据错误，忽略`);
                try {
                    task.done = 2;
                    await task.save({ transaction });
                    await transaction.commit();
                } catch (err) {
                    await transaction.rollback();
                    log.error(err);
                    log.error(err.stack);
                }
                continue;
            }
            await transaction.rollback();
            log.error(err);
            log.error(err.stack);
        }
    }
}
