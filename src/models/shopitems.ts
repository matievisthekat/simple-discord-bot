import {InferAttributes, InferCreationAttributes, Model} from 'sequelize';

export default class ShopItems extends Model<InferAttributes<ShopItems>, InferCreationAttributes<ShopItemsCreation>> {
	declare id: number;
	declare guild_id: string;
	declare role_id: string;
	declare price: number;
}

class ShopItemsCreation extends Model<InferAttributes<ShopItems>, InferCreationAttributes<ShopItemsCreation>> {
	declare guild_id: string;
	declare role_id: string;
	declare price: number;
}
