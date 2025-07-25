import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { setupAuth } from '@profcomff/api-uilib';
import apiClient from '@/api';

export const useProfileStore = defineStore('profile', () => {
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
	};

	const TVOI_FF_TEST_TOKEN = ''; // if debugging, paste it here to avoid relogging

	async function setupAdminSession(tvff_token: string | null) {
		setupAuth(tvff_token ?? TVOI_FF_TEST_TOKEN);

		const serviceScopes = [
			'event.view',
			'item.create',
			'item.delete',
			'item.patch',
			'item_type.create',
			'item_type.delete',
			'session.admin',
			'strike.create',
			'strike.delete',
			'strike.read',
		];
		const serviceName = 'rental';
		const scopes = serviceScopes.map(value => `${serviceName}.${value}`);

		const { response, data, error } = await apiClient.POST('/auth/session', {
			body: {
				scopes,
				expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
			},
		});

		if (!response.ok && error) {
			console.log(error);
			return;
		}

		if (data) {
			user_id.value = data.id;
			token.value = data.token || '';
			sessionScopes.value = data.session_scopes ?? [];

			setupAuth(data.token || '');
			console.log(data.token);
		}
	}

	async function setupUserSession(tvff_token: string | null) {
		setupAuth(tvff_token ?? TVOI_FF_TEST_TOKEN);
		console.log('user logged');
	}

	const isLogged = computed(() => token.value && token.value !== '');

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

		fromUrl,
		setupAdminSession,
		setupUserSession,
	};
});
