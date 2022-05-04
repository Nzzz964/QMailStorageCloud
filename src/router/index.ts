import { download } from "../api/mail.api";
import { FastifyInstance } from "fastify";
import { File, Mail } from "../models";
import { init } from "../service/mail.service";

interface IndexQuery {
    page?: number;
}

interface MailsQuery {
    guid: string;
}

interface RedirectQuery {
    guid: string;
}

export const router = (server: FastifyInstance) => {
    server.get<{
        Querystring: IndexQuery
    }>("/", async (req, reply) => {
        let page = req.query?.page;
        page = page ? page > 0 ? page : 1 : 1;

        const { rows, count } = await File.findAndCountAll({
            offset: (page - 1) * 9,
            limit: 9,
            order: [["id", "desc"]],
        });

        const total = Math.ceil(count / 9);

        return reply.view("/templates/index.ejs", { rows, page, total });
    });

    server.get<{
        Querystring: MailsQuery
    }>("/mails", async (req, reply) => {
        const guid = req.query?.guid;
        if (!guid) {
            return reply.code(200).send({
                code: 400,
                msg: "请求参数错误",
            });
        }
        const file = await File.findOne({
            where: { guid }
        });
        const mails = await file.getMails();
        if (file.total !== mails.length) {
            return reply.code(200).send({
                code: 500,
                msg: "文件已损坏",
            });
        }
        const data = {
            filename: file.name,
            mails: mails.map((v) => {
                return {
                    guid: v.guid,
                    seq: v.seq
                };
            })
        }
        return reply.code(200).send({
            code: 200,
            msg: "成功",
            data
        });
    });

    server.get<{
        Querystring: RedirectQuery
    }>("/redirect", async (req, reply) => {
        const guid = req.query?.guid;
        if (!guid) {
            return reply.code(200).send({
                code: 400,
                msg: "请求参数错误",
            });
        }
        const mail = await Mail.findOne({ where: { guid } });
        if (!mail) {
            return reply.code(200).send({
                code: 404,
                msg: "文件不存在",
            });
        }
        const response = await download(mail.mid, mail.attach_filename);
        const redirect = response.headers.location;
        return reply.redirect(redirect);
    });

    server.get("/init", async (req, reply) => {
        init();
        return reply.send({
            code: 200,
            msg: "任务已添加, 请等待"
        });
    });
}