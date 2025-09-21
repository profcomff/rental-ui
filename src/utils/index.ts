import { RentalSession } from '@/models';
// import { useUserSessions } from '@/store';
// import { useItemStore } from '@/store';

export function convertTsToHHMM(timestamp: string | null) {
	if (!timestamp) return '--:--';

	const dateTime = Intl.DateTimeFormat('ru', { hour: '2-digit', minute: '2-digit' }).format(Date.parse(timestamp));
	return dateTime;
}

export function convertTsToDateTime(timestamp: string | null | undefined) {
	if (!timestamp) return 'отсутствует';

	const dateTime = Intl.DateTimeFormat('ru', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	}).format(Date.parse(timestamp));
	return dateTime;
}

export function sessionEnded(session: RentalSession) {
	return ['canceled', 'dismissed', 'returned', 'overdue'].includes(session.status);
}

export function getCurrentTs() {
	const date = new Date();
	return date.toISOString();
}
