import {InferAttributes, InferCreationAttributes, Model} from 'sequelize';

export default class Settings extends Model<InferAttributes<Settings>, InferCreationAttributes<Settings>> {
	declare name: string;
	declare value: string;
	declare guild_id: string;
}
