import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('../pages/MainPage.vue'),
	},
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
		path: '/admin/log',
		component: () => import('@/pages/admin/AdminLog.vue'),
	},
	{
		path: '/admin/session/:id(\\d+)',
		component: () => import('@/pages/admin/SessionView.vue'),
	},
	{
		path: '/user/items',
		component: () => import('../pages/user/AvailableItems.vue'),
	},
	{
		path: '/user/sessions',
		component: () => import('../pages/user/CurrentSessions.vue'),
	},
];

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(to => {
	console.log(to);
});
