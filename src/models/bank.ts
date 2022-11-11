import {InferAttributes, InferCreationAttributes, Model} from 'sequelize';

export default class Bank extends Model<InferAttributes<Bank>, InferCreationAttributes<Bank>> {
	declare user_id: string;
  declare balance: number;
}
