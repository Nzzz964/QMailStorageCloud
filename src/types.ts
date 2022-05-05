export interface Cookie {
    [key: string]: string;
}

export interface ServerConfig {
    port: number;
    address: string;
}

export interface MailConfig {
    cookie: string;
}

export interface Config {
    server: ServerConfig,
    mail: MailConfig
}

export interface MailBody {
    filename: string,
    size: number,
    sha1: string,
    chunk_sha1: string,
    chunk_filename: string,
    seq: number,
    total: number,
    desc: string,
    guid: string
}

export interface Mail extends MailBody {
    /** 邮件标题 */
    title: string,
    mailID: string
}