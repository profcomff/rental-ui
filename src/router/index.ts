import { refreshData } from '@/utils';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/admin/requests',
		component: () => import('@/pages/admin/AdminRequests.vue'),
		alias: ['/admin', '/admin/'],
	},
	{
		path: '/admin/active',
		component: () => import('@/pages/admin/AdminActive.vue'),
	},
	{
		path: '/admin/archive',
		component: () => import('@/pages/admin/AdminArchive.vue'),
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
		path: '/test',
		component: () => import('../pages/TestingScreen.vue'),
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
	await refreshData();
});
