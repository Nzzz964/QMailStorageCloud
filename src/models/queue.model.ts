import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "Sequelize";

import { sequelize } from "../bootstrap";

class Queue extends Model<InferAttributes<Queue>, InferCreationAttributes<Queue>>{
    declare id: CreationOptional<number>;
    declare mid: string;
    //          未完成 已完成 错误
    declare done: -1 | 1 | 2;

    static tasks() {
        return Queue.findAll({
            where: {
                done: -1
            },
            order: [
                ["id", "asc"]
            ],
        });
    }
}

Queue.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mid: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        done: {
            type: DataTypes.INTEGER,
        }
    },
    { sequelize, tableName: "queue", timestamps: false }
);

export { Queue };