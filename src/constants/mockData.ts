import { RentalSession } from '@/models';

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
];

export const mockItemTypes = [
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
];