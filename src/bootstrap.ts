import path from "path";
import { readFileSync } from "fs";
import { Config } from "./types";
import { cookie } from "./utils";
import { logger } from "./logger";
import { Context } from "./context";

const log = logger("Bootstrap");

import { Sequelize } from "Sequelize";
export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(process.cwd(), "/db/qmailstorage.sqlite"),
    logging: (msg) => logger("SQL").info(msg),
});

export const config = JSON.parse(readFileSync("./config.json").toString()) as Config;

export const context = new Context(cookie.toObject(config.mail.cookie));

log.info("正在初始化核心服务");
sequelize.authenticate().then(async () => {
    const { keepAlive } = await import("./service/keep-alive.service");
    await keepAlive();

    //加载 Schedule
    const { Schedule } = await import("./schedule");
    Schedule.start();

    await import("./server");
}).catch((err) => {
    log.error(err);
    log.error(err.stack);
    process.exit(1);
});
