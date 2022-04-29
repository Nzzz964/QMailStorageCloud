import { scheduleJob } from "node-schedule";

export const keeper = () =>
    scheduleJob("*/30 * * * *", () => {
        console.log("Hello World");
    });
