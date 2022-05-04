import { File } from "./file.model";
import { Mail } from "./mail.model";
import { Queue } from "./queue.model";

Mail.belongsTo(File, {
    targetKey: "guid",
    foreignKey: "file_guid",
    as: "file",
});
File.hasMany(Mail, {
    sourceKey: "guid",
    foreignKey: "file_guid",
    as: "mails",
});

export { File, Mail, Queue };
