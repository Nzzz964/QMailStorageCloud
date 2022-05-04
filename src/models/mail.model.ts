import {
    Association,
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "Sequelize";

import { sequelize } from "../bootstrap";
import { File } from "./file.model";

class Mail extends Model<InferAttributes<Mail>, InferCreationAttributes<Mail>> {
    declare id: CreationOptional<number>;

    declare title: string;
    declare mid: string;
    declare seq: number;
    declare guid: string;

    declare attach_filename: string;
    declare attach_sha1: string;

    declare file_guid: string;

    public declare file: NonAttribute<File>;

    declare static associations: {
        file: Association<Mail, File>;
    };
}

Mail.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        mid: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        seq: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        guid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        attach_filename: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        attach_sha1: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        file_guid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    { sequelize, tableName: "mail", timestamps: false }
);

export { Mail };
