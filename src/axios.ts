import axios from "axios";
import { logger } from "./logger";

const log = logger("axios.ts");

const instance = axios.create({
    responseType: "arraybuffer",
    headers: {
        Referer: "https://mail.qq.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    },
    validateStatus: (status) => (status >= 200 && status < 300) || status === 302,
});

instance.interceptors.request.use((config) => {
    const url = config.url;
    log.info(`正在请求URL: ${url}`);
});

instance.interceptors.response.use((response) => {
    const location = response.headers?.location;
    if (location) {
    }
});

export { instance as axios };
