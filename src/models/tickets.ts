import { InferAttributes, InferCreationAttributes, Model } from "sequelize";

export default class Tickets extends Model<InferAttributes<Tickets>, InferCreationAttributes<Tickets>> {
  declare user_id: string;
  declare channel_id: string;
  declare guild_id: string;
}
