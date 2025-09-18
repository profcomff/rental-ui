// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RentalStatusList = ['reserved', 'active', 'canceled', 'overdue', 'returned', 'dismissed', 'expired'] as const;

export type RentalStatus = (typeof RentalStatusList)[number];

export interface RentalSession {
	id: number;
	user_id: number;
	item_id: number;
	item_type_id: number;
	admin_open_id: number | null;
	admin_close_id: number | null;
	reservation_ts: string;
	start_ts: string | null;
	end_ts: string | null;
	actual_return_ts: string | null;
	status: RentalStatus;
	strike_id?: number | null;
}

export interface ItemType {
	id: number;
	name: string;
	image_url?: string | null;
	description?: string | null;
	free_items_count?: number | null;
}

export interface Strike {
	id: number;
	user_id: number;
	admin_id: number;
	reason: string;
	session_id?: number | null;
	create_ts: string;
}

export interface Event {
	id: number;
	user_id?: number | null;
	admin_id?: number | null;
	session_id?: number | null;
	action_type: string;
	details: object;
	create_ts: string;
}

export type ItemTypeStatus = 'available' | 'cooldown' | 'reserved' | 'active' | 'unavailable' | 'overdue';
