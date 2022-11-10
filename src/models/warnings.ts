import {InferAttributes, InferCreationAttributes, Model} from 'sequelize';

export default class Warnings extends Model<InferAttributes<Warnings>, InferCreationAttributes<WarningsCreation>> {
	declare id: number;
	declare user_id: string;
	declare reason: string;
	declare moderator_id: string;
}

class WarningsCreation extends Model<InferAttributes<Warnings>, InferCreationAttributes<WarningsCreation>> {
	declare user_id: string;
	declare reason: string;
	declare moderator_id: string;
}
