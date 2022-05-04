import { Cookie } from "./types";

export const cookie = {
    toString: function (cookie: Cookie) {
        let str = "";
        for (const key in cookie) {
            str += `${key}=${cookie[key]};`;
        }
        return str;
    },
    toObject: function (text: string): Cookie {
        let cookie: Cookie = {};
        const cookieArray = text.split(";");
        for (const value of cookieArray) {
            const [k, v] = value.split("=");
            cookie[k.trim()] = v.trim();
        }
        return cookie;
    },
};

/**
 * 是否为ASCII字符
 */
export const isASCII = (c: number) => {
    return c > 0x00 && c < 0x80;
};

/**
 * 将Buffer进行URL编码
 */
export const encodeURIFromBuffer = (buffer: Buffer) => {
    return buffer
        .reduce((acc, v) => {
            if (isASCII(v)) {
                return (acc += String.fromCharCode(v));
            }
            return (acc += "%" + v.toString(16).toUpperCase());
        }, "")
        .replace(/[\x20]/g, "+");
};
