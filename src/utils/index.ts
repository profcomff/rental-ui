export function convertTsToDateTime(timestamp: string | null | undefined) {
	if (!timestamp) return 'отсутствует';

	const dateTime = Intl.DateTimeFormat('ru', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(timestamp + 'Z'));
	return dateTime;
}

export function getCurrentTs() {
	const date = new Date();
	return date.toISOString();
}
