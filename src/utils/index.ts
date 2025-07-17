import { RentalSession } from '@/models';
import { useUserRentalStore } from '@/store';
import { useItemStore } from '@/store';

export function convertTsToHHMM(timestamp: string | null) {
	if (!timestamp) return '--:--';

	const dateTime = Intl.DateTimeFormat('ru', { hour: '2-digit', minute: '2-digit' }).format(Date.parse(timestamp));
	return dateTime;
}

export function sessionEnded(session: RentalSession) {
	return ['canceled', 'dismissed', 'returned', 'overdue'].includes(session.status);
}

export async function refreshData() {
	const { requestUserSessions } = useUserRentalStore();
	const { requestItemTypes } = useItemStore();

	await requestItemTypes();
	await requestUserSessions();
}

export function getCurrentTs() {
	const date = new Date();
	return date.toISOString();
}
