import fastify from "fastify";
import helmet from "@fastify/helmet";

const server = fastify();

server.register(helmet);

server.get("/", (req, reply) => {
    reply.status(200).send("Hello World");
});

server.listen(3000, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server Listening At: ${address}`);
});
