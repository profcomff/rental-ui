import { components } from '@profcomff/api-uilib/src/openapi/rental';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RentalStatusList = ['reserved', 'active', 'canceled', 'overdue', 'returned', 'dismissed', 'expired'] as const;

export type RentalStatus = (typeof RentalStatusList)[number];

export type RentalSession = components['schemas']['RentalSessionGet'];
export type ItemType = components['schemas']['ItemTypeGet'];
export type Strike = components['schemas']['StrikeGet'];
export type Event = components['schemas']['EventGet'];
