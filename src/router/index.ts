import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/admin/requests',
		component: () => import('@/pages/admin/AdminRequestsV2.vue'),
		alias: ['/admin', '/admin/'],
	},
	{
		path: '/admin/active',
		component: () => import('@/pages/admin/AdminActiveV2.vue'),
	},
	{
		path: '/admin/journal',
		component: () => import('@/pages/admin/AdminJournalV2.vue'),
	},
	{
		path: '/admin/items',
		component: () => import('@/pages/admin/AdminItems.vue'),
	},
	{
		path: '/admin/log',
		component: () => import('@/pages/admin/AdminLog.vue'),
	},
	{
		path: '/admin/session/:sessionId',
		component: () => import('@/pages/admin/AdminSessionView.vue'),
	},
	{
		path: '/',
		component: () => import('../pages/user/AvailableItemsV2.vue'),
	},
	{
		path: '/active',
		component: () => import('../pages/user/ActiveRentsV2.vue'),
	},
	{
		path: '/log',
		component: () => import('../pages/user/RentJournal.vue'),
	},
	{
		path: '/debug',
		component: () => import('../components/DebugPanel.vue'),
	},
	{
		path: '/session/:sessionId',
		component: () => import('../pages/user/UserSessionView.vue'),
	},
];

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async to => {
	console.log(to);
});
