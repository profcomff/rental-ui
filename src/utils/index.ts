import { RentalSession } from '@/models';

export function convertTsToHHMM(timestamp: string | null) {
	if (!timestamp) return '--:--';

	const dateTime = Intl.DateTimeFormat('ru', { hour: '2-digit', minute: '2-digit' }).format(Date.parse(timestamp));
	return dateTime;
}

export function sessionEnded(session: RentalSession) {
	return ['canceled', 'dismissed', 'returned', 'overdue'].includes(session.status);
}
