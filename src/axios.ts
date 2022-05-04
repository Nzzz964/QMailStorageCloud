import axios from "axios";
import iconv from "iconv-lite";

import { context } from "./bootstrap";
import { cookie } from "./utils";
import { logger } from "./logger";

const log = logger("Axios");

const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36";

const instance = axios.create({
    responseType: "arraybuffer",
    headers: {
        Referer: "https://mail.qq.com/",
        "User-Agent": ua,
    },
    validateStatus: (status) => (status >= 200 && status < 300) || status === 302,
});

instance.interceptors.request.use((config) => {
    const particular = ["https://mail.qq.com/cgi-bin/loginpage", "https://mail.qq.com/cgi-bin/login"];

    const url = config.url;
    log.info(`正在请求URL: ${url}`);

    if (config.headers) {
        config.headers["Cookie"] = cookie.toString(context.current);
    }

    if (particular.includes(url) && config.headers) {
        //使用原始 Cookie
        config.headers["Cookie"] = cookie.toString(context.original);
    }

    if (config.params) {
        config.params["sid"] = context.sid;
    }
    return config;
});

instance.interceptors.response.use((response) => {
    const location = response.headers?.location;
    if (location) {
        const check = /^https:\/\/mail\.qq\.com\/cgi-bin\/loginpage/;
        const unHealth = check.test(location);
        if (unHealth) {
            log.warn("服务当前不健康");
        }
    }
    const re = /(.*?)=(.*?);/;
    const cookie = response.headers["set-cookie"];
    const current = context.current;
    cookie?.forEach((item) => {
        const matches = item.match(re);
        if (matches) {
            current[matches[1]] = matches[2];
        }
    });
    context.current = current;
    response.data = iconv.decode(response.data, "gb18030");
    return response;
});

export { instance as axios };
