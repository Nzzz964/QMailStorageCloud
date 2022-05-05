import { context } from "../bootstrap";
import { Mail as MailApi } from "../api";
import { logger } from "../logger";
import { KeepAliveError } from "../error";
import { AxiosError } from "axios";

const log = logger("Keep-Alive-Service");

export const keepAlive = async () => {
    log.info("keepAlive 被调用");
    try {
        context.current = {};
        //请求 timeout
        let response = await MailApi.timeout();
        //请求 psaread
        response = await MailApi.psaread();
        const status = response.status;
        if (status !== 302) {
            throw new KeepAliveError(`keepAlive psaread 请求返回状态不正确: ${status}`);
        }

        const location = response.headers.location;
        const check = /https:\/\/mail.qq.com\/cgi-bin\/frame_html\?sid=/;
        if (!check.test(location)) {
            throw new KeepAliveError(`keepAlive psaread 请求重定向不正确: ${location}`);
        }
    } catch (err) {
        if (err instanceof AxiosError) {
            log.error(err.response.data.toString());
        }
        throw err;
    }
}