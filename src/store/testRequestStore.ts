import { RENT_DURATION } from '@/constants';
import { mockRentalRequests } from '@/constants/mockData';
import { RentalSession, Strike } from '@/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTestStore = defineStore('test', () => {
	const sessions = ref<RentalSession[]>([]);
	const strikes = ref<Strike[]>([]);
	const strikeId = ref(0);

	function init() {
		sessions.value = mockRentalRequests.slice();
	}

	function getSessionById(id: number) {
		return sessions.value.find(item => item.id == id);
	}

	function getSessions() {
		return sessions.value;
	}

	function getRequestSessions() {
		return sessions.value.filter(item => item.status == 'reserved');
	}

	function getActiveSessions() {
		return sessions.value.filter(item => item.status == 'active');
	}

	function getClosedSessions() {
		return sessions.value.filter(item => ['canceled', 'dismissed', 'returned', 'overdue'].includes(item.status));
	}

	function getStrikedSessions() {
		return sessions.value.filter(item => item.strike_id !== null);
	}

	function dismissSession(id: number) {
		const idx = sessions.value.findIndex(item => item.id == id);

		if (idx == -1) return 'session not found';
		sessions.value[idx].status = 'dismissed';

		return `session ${id} dismissed`;
	}

	function startSession(id: number, admin_id: number) {
		const idx = sessions.value.findIndex(item => item.id == id);

		if (idx == -1) return 'session not found';
		sessions.value[idx].status = 'active';
		sessions.value[idx].admin_open_id = admin_id;
		sessions.value[idx].start_ts = Date().toString();
		sessions.value[idx].end_ts = new Date(Date.now() + RENT_DURATION).toString();

		return `session ${id} started; end time is ${sessions.value[idx].end_ts}`;
	}

	function closeSession(id: number, admin_id: number) {
		const idx = sessions.value.findIndex(item => item.id == id);
		if (idx == -1) return 'session not found';

		sessions.value[idx].admin_close_id = admin_id;
		sessions.value[idx].actual_return_ts = Date().toString();
		sessions.value[idx].status =
			Date.now() - Date.parse(sessions.value[idx].start_ts ?? Date()) > RENT_DURATION ? 'overdue' : 'returned';
		return `session ${id} closed with status ${sessions.value[idx].status} `;
	}

	function getStrikeById(id: number) {
		return strikes.value.find(item => item.id == id);
	}

	function getStrikes() {
		return strikes.value;
	}

	function createStrike(userId: number, adminId: number, reason: string, sessionId: number) {
		const idx = sessions.value.findIndex(item => item.id == sessionId);
		if (idx == -1) return 'session not found';

		strikes.value.push({
			id: strikeId.value,
			user_id: userId,
			admin_id: adminId,
			reason: reason,
			session_id: sessionId,
			created_ts: Date.now().toString(),
		});
		sessions.value[idx].strike_id = strikeId.value;

		strikeId.value += 1;
		return `created strike id ${strikeId.value - 1} on session ${sessionId} because ${reason}`;
	}

	function deleteStrike(id: number) {
		const idx = sessions.value.findIndex(item => item.strike_id == id);
		if (idx == -1) return 'session not found';

		strikes.value.splice(id);
		sessions.value[idx].strike_id = null;
		return `deleted strike id ${id} on session ${sessions.value[idx].id}`;
	}

	return {
		init,

		getSessionById,
		getSessions,
		getRequestSessions,
		getActiveSessions,
		getClosedSessions,
		getStrikedSessions,

		dismissSession,
		startSession,
		closeSession,

		getStrikeById,
		getStrikes,

		createStrike,
		deleteStrike,
	};
});
