import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import AvailableItems from '@/pages/user/AvailableItems.vue';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('../pages/MainPage.vue'),
	},
	{
		path: '/user/items',
		name: 'AvailableItems',
		component: AvailableItems // Используем прямой импорт
	},
];

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(to => {
	console.log(to);
});
