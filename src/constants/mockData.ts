import { RentalSession } from '@/models';
import { ItemType } from '@/models/index';

export const mockRentalRequests: RentalSession[] = [
	{
		id: 1,
		user_id: 177,
		item_id: 1,
		admin_open_id: null,
		admin_close_id: null,
		reservation_ts: '2025-03-13T10:01:01.761477',
		start_ts: null,
		end_ts: null,
		actual_return_ts: null,
		status: 'reserved',
		strike_id: null,
	},
	{
		id: 2,
		user_id: 228,
		item_id: 2,
		admin_open_id: null,
		admin_close_id: null,
		reservation_ts: '2025-03-13T12:01:01.761477',
		start_ts: null,
		end_ts: null,
		actual_return_ts: null,
		status: 'reserved',
		strike_id: null,
	},
	{
		id: 3, // Новая активная сессия
		user_id: 177,
		item_id: 3, // Повербанк на колесах
		admin_open_id: 10, // Пример ID администратора
		admin_close_id: null,
		reservation_ts: '2025-03-13T12:01:01.761477', //null, // Активные сессии обычно не имеют reservation_ts
		start_ts: new Date(Date.now() - 3600000).toISOString(), // Началась час назад
		end_ts: new Date(Date.now() + (24 * 60 * 60 * 1000 - 3600000)).toISOString(), // Заканчивается через 23 часа
		actual_return_ts: null,
		status: 'active',
		strike_id: null,
	},
	{
		id: 4, // Еще одна новая активная сессия
		user_id: 177,
		item_id: 5, // ракетки теннисные (первый экземпляр с id: 5)
		admin_open_id: 10,
		admin_close_id: null,
		reservation_ts: null,
		start_ts: new Date(Date.now() - (2 * 60 * 60 * 1000)).toISOString(), // Началась 2 часа назад
		end_ts: new Date(Date.now() + (24 * 60 * 60 * 1000 - (2 * 60 * 60 * 1000))).toISOString(), // Заканчивается через 22 часа
		actual_return_ts: null,
		status: 'active',
		strike_id: null,
	},
];

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
		id: 6,
		name: 'проверка заглушки',
	},
];
