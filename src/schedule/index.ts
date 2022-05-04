import { logger } from "../logger";
import { runKeeperTask } from "./keeper.schedule";
import { runMonitorTask } from "./monitor.schedule";

const log = logger("Schedule");
export namespace Schedule {
    export const start = () => {
        log.info("正在初始化定时任务");
        try {
            runKeeperTask();
            runMonitorTask();
        } catch (err) {
            log.error(err);
        }
    };
}
