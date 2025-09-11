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

	const TVOI_FF_TEST_TOKEN =
		'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzciLCJpc3MiOiJodHRwczovL2FwcC50ZXN0LnByb2Zjb21mZi5jb20iLCJpYXQiOjE3NTU3ODk2MjQsImV4cCI6MTc1ODM4MTYyNH0.UHYIq29w_PoYzLvkURrtJqDEIxjrj46PM9bcCOt95Hh028N86AtTMGWrtY5hHbI2V6e-4Jzt_hVTjHyzAUmmwozF4Ukk5y998WESX1CzE61y_9Rp7AGdjUBmkV9YhJ0yXePL3NDJF0iujeATBY56E0D6-Ww1Lat4KswFZNuySQ8bNB0uLaGI-tPmM0PPnS1XGy_57pXa6ugZkk456iT5PmH6m8u93EeeBaerUQt9n_5E6vfhjwZtzo3r-bn3UPmpD_54sADA7pk3J_Ay-x4HTs0qOl8DE4D3khYrCtwpNMoRD_TZs5doT4jTxOQipxTXjbpQCV4C679JNWUj8U4mHg'; // if debugging, paste it here to avoid relogging

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
