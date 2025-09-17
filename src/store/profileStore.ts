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
		'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzciLCJpc3MiOiJodHRwczovL2FwcC50ZXN0LnByb2Zjb21mZi5jb20iLCJpYXQiOjE3NTgxMTM2ODcsImV4cCI6MTc2MDcwNTY4N30.l-q7PQ83J9IUQE8hElcNIqja-_B5uSiygoUg9RUfa28RVqmHpCeXTdvGymP8PjniVZ55x3XXu0Z869Bx22bChDFCkDYWkZV0itDeMWt4axqpZ6K6KdVjMHYOIXbEQEApVvMFp-aBaTdpPtxZlmrIZF_OIqic6fffqMbIf_2QNt6gQYqHjpZbK9NtbTA1R-o6oGxVEcIZcffEOGmjvziM7XmWkCOxyqXHUBHdWKZjkrS0nX4LQcpCGaTK6YLNsMS3Ef5SdCOu5KqO7tE0cLcXRYN7SDmlKgETp_CBXIa-ko4b_yIE79iK9D5GtCMpdBPYNpGgw6a2NRGD7RAsVAiLYQ'; // if debugging, paste it here to avoid relogging

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
