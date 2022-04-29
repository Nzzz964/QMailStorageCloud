import { Cookie } from "./types";

export class Context {
    private _current: Cookie;
    private _sid: string;

    constructor(private _original: Cookie) {
        this._current = _original;
    }

    /**
     * 获取原始 Cookie
     */
    get original() {
        return this._original;
    }

    /**
     * 获取当前 sid
     */
    get sid() {
        return this._sid;
    }

    /**
     * 设置 sid
     */
    set sid(sid: string) {
        this._sid = sid;
    }

    /**
     * 获取当前 Cookie
     */
    get current() {
        return this._current;
    }

    /**
     * 设置 Cookie
     */
    set current(cookie: Cookie) {
        this._current = cookie;
    }
}
