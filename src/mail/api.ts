import { logger } from "../logger";
import { axios } from "../axios";
import { PsareadRequestError } from "../error/psaread";

const log = logger("api.ts");

export enum URL {
    LOGIN_PAGE = "https://mail.qq.com/cgi-bin/loginpage",
    LOGIN = "https://mail.qq.com/cgi-bin/login",
}

export const timeout = async () => {
    const response = await axios.get(URL.LOGIN_PAGE, {
        maxRedirects: 0,
        params: {
            s: "session_timeout",
            from: "",
        },
    });
    const status = response.status;
    log.info(`请求 session_timeout 的状态为: ${status}`);
    return response;
};

export const psaread = async () => {
    const response = await axios.get(URL.LOGIN, {
        maxRedirects: 0,
        params: {
            fun: "psaread",
            rand: "",
            delegate_url: "",
            target: "",
        },
    });
    const status = response.status;
    if (status !== 302) {
        throw new PsareadRequestError();
    }
    const headers = response.headers;
    const re = /^https:\/\/mail\.qq\.com\/cgi-bin\/frame_html\?sid=(.*)&.*$/;
    const location = headers.location;
    const matches = location.match(re);
    if (matches) {
    }
    return response;
};
