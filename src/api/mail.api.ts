import iconv from "iconv-lite";
import { context } from "../bootstrap";
import { logger } from "../logger";
import { axios } from "../axios";
import { encodeURIFromBuffer } from "../utils";

const log = logger("Api");

export enum Api {
    LOGIN = "https://mail.qq.com/cgi-bin/login",
    LOGIN_PAGE = "https://mail.qq.com/cgi-bin/loginpage",
    SEARCH = "https://mail.qq.com/cgi-bin/mail_list",
    DETAIL = "https://mail.qq.com/cgi-bin/readmail",
    DOWNLOAD = "https://mail.qq.com/cgi-bin/download",
}

export const timeout = async () => {
    const response = await axios.get(Api.LOGIN_PAGE, {
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
    const response = await axios.get(Api.LOGIN, {
        maxRedirects: 0,
        params: {
            fun: "psaread",
            rand: "",
            delegate_Api: "",
            target: "",
        },
    });
    const headers = response.headers;
    const location = headers?.location;
    if (location) {
        const re = /^https:\/\/mail\.qq\.com\/cgi-bin\/frame_html\?sid=(.*)&.*$/;
        const matches = location.match(re);
        if (matches) {
            context.sid = matches[1];
        }
    }
    return response;
};

/**
 * 搜索
 */
export const search = async (keyword: string, page: number = 0) => {
    keyword = encodeURIFromBuffer(iconv.encode(keyword, "gb18030"));
    return axios.get(`${Api.SEARCH}?subject=${keyword}&sender=${keyword}&receiver=${keyword}`, {
        params: {
            s: "search",
            folderid: "all",
            page: page,
            topmails: 0,
            advancesearch: 0,
            searchmode: "",
        },
    });
};

/**
 * 通过 `MailID` 获取邮件详情
 */
export const detail = async (mid: string) => {
    return axios.get(Api.DETAIL, {
        params: {
            mailid: mid,
            t: "readmail",
        },
    });
};

/**
 * 通过 `MailID` 下载附件
 */
export const download = async (mid: string, filename: string) => {
    filename = encodeURIFromBuffer(iconv.encode(filename, "gb18030"));
    return axios.get(Api.DOWNLOAD, {
        params: {
            mailid: mid,
            filename: filename,
        },
        maxRedirects: 0,
    });
};
