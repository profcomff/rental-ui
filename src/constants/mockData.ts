import { ItemType } from '@/models/index';

export const mockItemTypes: ItemType[] = [
	{
		id: 1,
		name: 'Проджект-менеджер',
		image_url:
			'https://sun9-23.userapi.com/impg/xYL6XNfrmXqD_JOHI7sFnmS3VjM7ReXZjnj0IQ/4tIs17-qxs0.jpg?size=1440x2160&quality=95&sign=2b7383be98dda19d9420933edcd274f2&type=album',
		description: 'Проджект-менеджер на час, рабочий день, ночь. Созвоны, хакатоны, майлстоуны в хули. ',
	},
	{
		id: 2,
		name: 'Хули',
		image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2tQ1_UMNOz_X_g7WoMMyyp8rwtyRHGzh2dg&s',
		description: 'Лучший трекер для команды',
	},
	{
		id: 3,
		name: 'Повербанк на колесах',
		image_url: 'https://rucars.ru/image/catalog/avtomobili/xiaomi/su7/color/body/pro/xiaomi-su7-pro-2025-blue.jpg',
		description: 'СЯОМИ ТОП ЗА СВОИ ДЕНЬГИ!',
	},
	{
		id: 4,
		name: 'Словарь',
		image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKE0Lsagy1YSZ42BEZabS2mBn8HVUePBTimA&s',
		description: 'мат в СМИ запрещен',
	},
	{
		id: 19,
		name: 'маленький разраб',
		image_url: 'https://hb.bizmrg.com/prod.football.msu.ru/player/3684/photo/61687e4339e21_300x300.jpg',
		description: 'просто маленький разраб Дима',
	},
	{
		id: 5,
		name: 'ракетки теннисные',
		image_url: 'https://pingpong73.ru/media/images/articles/professionalnaya-raketka-butterfly.jpg',
		description: 'для игры в пинг-понг',
	},
	{
		id: 16,
		name: 'Очень длинный-длинный-длинный-просто длиннющий текст',
		description: 'Очень длинное-длинное-длинное-просто длиннющее описание',
	},
	{
		id: 5,
		name: 'проверка заглушки',
	},
];

export const testItemType: ItemType = {
	id: 0,
	name: 'Тестовый айтем',
	description: 'Для тестирования',
	image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Test.svg/2560px-Test.svg.png',
	free_items_count: 10,
};
