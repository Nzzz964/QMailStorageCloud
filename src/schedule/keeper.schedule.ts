import { logger } from "../logger";
import { scheduleJob } from "node-schedule";
import { keepAlive } from "../service/keep-alive.service";

const log = logger("Schedule-Keeper");

/**
 * 邮箱 `Cookie` `Sid` 保活
 */
export const runKeeperTask = () =>
    scheduleJob("*/30 * * * *", async () => {
        log.info("正在运行 Keeper 任务");
        try {
            keepAlive();
        } catch (err) {
            log.error(err);
            log.error(err.stack);
        }
    });
