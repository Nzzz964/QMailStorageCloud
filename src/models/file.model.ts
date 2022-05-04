import {
    Association,
    CreationOptional,
    DataTypes,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "Sequelize";

import { sequelize } from "../bootstrap";
import { Mail } from "./mail.model";

class File extends Model<InferAttributes<File>, InferCreationAttributes<File>> {
    declare id: CreationOptional<number>;
    declare guid: string;
    declare name: string;
    declare desc: string | null;
    declare size: number;
    declare total: number;
    declare sha1: string;

    declare getMails: HasManyGetAssociationsMixin<Mail>;
    declare countMail: HasManyCountAssociationsMixin;
    declare createMail: HasManyCreateAssociationMixin<Mail, "file_guid">;

    declare mails?: NonAttribute<Mail[]>;

    declare static associations: {
        mails: Association<File, Mail>;
    };
}

File.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        guid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        desc: {
            type: DataTypes.TEXT,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        total: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sha1: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    { sequelize, tableName: "file", timestamps: false }
);

export { File };
