// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RentalStatusList = ['reserved', 'active', 'canceled', 'overdue', 'returned', 'dismissed'] as const;

export type RentalStatus = (typeof RentalStatusList)[number];

export interface RentalSession {
  id: number;
  user_id: number;
  item_id: number;
  admin_open_id: number | null;
  admin_close_id: number | null;
  reservation_ts: string;
  start_ts: string | null;
  end_ts: string | null;
  actual_return_ts: string | null;
  status: RentalStatus;
  strike_id: number | null;
}

export interface ItemType {
  id: number;
  name: string;
  image_url?: string;
  description?: string ;
}

export interface Strike {
  id: number;
  user_id: number;
  admin_id: number;
  reason: string;
  session_id: number;
  created_ts: string;
}