import { createClient, setupAuth } from '@profcomff/api-uilib';

const apiClient = createClient(import.meta.env.VITE_AUTH_API_BASE_URL);

export async function setupAdminSession() {
	const TVOI_FF_TEST_TOKEN =
		'YOUR.TOKEN.HERE';
	setupAuth(TVOI_FF_TEST_TOKEN);

	const allScopes = [
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
	allScopes.forEach(item => 'rental.' + item);

	const { response, data, error } = await apiClient.POST('/auth/session', {
		body: {
			scopes: allScopes,
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
		},
	});

	if (!response.ok && error) {
		console.log(error);
		return;
	}

	if (data) {
		setupAuth(data.token || '');
	}
}

export default apiClient;
