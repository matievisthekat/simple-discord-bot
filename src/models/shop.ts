import { InferAttributes, InferCreationAttributes, Model } from "sequelize";

export default class Shop extends Model<InferAttributes<Shop>, InferCreationAttributes<Shop>> {
  declare id: number;
  declare guild_id: string;
  declare role_id: string;
  declare price: number;
}
