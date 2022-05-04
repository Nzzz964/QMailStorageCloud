import { scheduleJob } from "node-schedule";
import { fetch } from "../service/mail.service";
import { consume } from "../service/queue.service";
import { Queue } from "../models";
import { logger } from "../logger";
import { sequelize } from "../bootstrap";

const log = logger("Schedule-Monitor");

/**
 * 邮件监控 - 入库
 */
export const runMonitorTask = () =>
    scheduleJob("*/10 * * * *", async () => {
        log.info("正在运行 Monitor 任务");

        let flag = false;

        //只拉取第一页
        const { mids, total } = await fetch();
        const transaction = await sequelize.transaction();
        try {
            for (const mid of mids) {
                const [queue, created] = await Queue.findOrCreate({
                    where: { mid },
                    defaults: { mid },
                    transaction
                });
                if (!created) break;
                flag = true;
            }
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            log.error(err);
            log.error(err.stack);
        }

        if (flag) {
            await consume();
        }
    });
