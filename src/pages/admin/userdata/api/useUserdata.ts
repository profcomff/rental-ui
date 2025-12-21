import apiClient from '@/api';
import { useToastStore } from '@/store/toastStore';
import { components } from '@profcomff/api-uilib/src/openapi/userdata';

export type UserData = components['schemas']['UserCardGet'];

export const useUserdata = () => {
	const toastStore = useToastStore();

	async function getUserById(user_id: number) {
		try {
			const { response, data, error } = await apiClient.GET('/userdata/admin/user/{user_id}', {
				params: { path: { user_id } },
			});

			if (error) {
				switch (response.status) {
					case 404: {
						toastStore.error({ title: `Пользователь с id ${user_id} не найден` });
						break;
					}
					default: {
						toastStore.error({
							title: `Непредвиденная ошибка при поиске ${user_id}`,
							description: error.detail,
						});
					}
				}
				return;
			}
			return data;
		} catch {
			toastStore.error({ title: `Что-то пошло не так на сервере` });
			return;
		}
	}

	async function patchUserById(user_id: number, full_name: string, student_card_number: string) {
		const { response, data, error } = await apiClient.PATCH('/userdata/admin/user/{user_id}', {
			params: { path: { user_id } },
			body: {
				full_name,
				student_card_number,
			},
		});
		if (error) {
			switch (response.status) {
				case 404: {
					toastStore.error({ title: `Пользователь с id ${user_id} не найден` });
					break;
				}
				default:
					toastStore.error({
						title: `Непредвиденная ошибка при поиске ${user_id}`,
						description: error.detail,
					});
			}
			return;
		}
		toastStore.success({ title: `Информация о пользователе ${user_id} обновлена` });
		return data;
	}

	return {
		getUserById,
		patchUserById,
	};
};
