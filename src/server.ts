import { logger } from "./logger";
const log = logger("Server");


import fastify from "fastify";
import helmet from "@fastify/helmet";
import pov from "point-of-view";
import ejs from "ejs";
import { router } from "./router";
import { config } from "./bootstrap";

const server = fastify({ logger: true });
server.register(helmet, {
    contentSecurityPolicy: false
});
server.register(pov, {
    engine: { ejs }
});
router(server);
server.listen(config.server.port, config.server.address, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    log.info(`Fastify 正在监听: ${address}`);
});
export { server };