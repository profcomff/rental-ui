import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { setupAuth } from '@profcomff/api-uilib';
import apiClient from '@/api';
import { useToastStore } from './toastStore';

export const useProfileStore = defineStore('profile', () => {
	const toastStore = useToastStore();

	const user_id = ref<number | null>(null);
	const email = ref<string | null>(null);
	const token = ref<string | null>(null);
	const groups = ref<number[] | null>(null);
	const indirectGroups = ref<number[] | null>(null);
	const userScopes = ref<string[] | null>(null);
	const sessionScopes = ref<string[] | null>(null);

	const full_name = ref<string | null>(null);

	const fromUrl = () => {
		const url = new URL(document.location.toString());
		const currToken = url.searchParams.get('token');
		const currId = url.searchParams.get('user_id');
		const currScopes = url.searchParams.get('scopes');
		if (currToken) {
			token.value = currToken;
		}
		if (currId) {
			user_id.value = +currId;
		}
		if (currScopes) {
			sessionScopes.value = currScopes.split(',');
		}

		setupAuth(token.value ?? undefined);
	};

	const TVOI_FF_TEST_TOKEN = import.meta.env.VITE_TVOI_FF_TOKEN;

	async function setupDevAdminSession(tvff_token: string | null) {
		setupAuth(tvff_token ?? TVOI_FF_TEST_TOKEN);

		const serviceScopes = [
			'event.view',
			'item.create',
			'item.delete',
			'item.patch',
			'item_type.create',
			'item_type.delete',
			'item_type.update',
			'session.create',
			'session.admin',
			'strike.create',
			'strike.delete',
			'strike.read',
		];
		const serviceName = 'rental';
		const scopes = serviceScopes.map(value => `${serviceName}.${value}`);
		scopes.push('userdata.info.admin', 'userdata.category.personal.write', 'userdata.category.study.write');

		const { data, error } = await apiClient.POST('/auth/session', {
			body: {
				scopes,
				expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
			},
		});

		if (error) {
			toastStore.error({ title: 'Ошибка при попытке авторизоваться', description: error.detail });
			return;
		}
		user_id.value = data.id;
		token.value = data.token || '';
		sessionScopes.value = data.session_scopes ?? [];

		setupAuth(data.token || '');
	}

	async function setupDevUserSession(tvff_token: string | null) {
		setupAuth(tvff_token ?? TVOI_FF_TEST_TOKEN);
		toastStore.success({ title: 'Юзерская сессия начата успешно' });
	}

	const isLogged = computed(() => token.value && token.value !== '');
	const isAdmin = computed(() => sessionScopes.value?.includes('rental.session.admin'));

	return {
		user_id,
		email,
		token,
		groups,
		indirectGroups,
		userScopes,
		sessionScopes,

		full_name,

		isLogged,
		isAdmin,

		fromUrl,
		setupDevAdminSession,
		setupDevUserSession,
	};
});
