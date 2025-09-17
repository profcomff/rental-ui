import apiClient from '@/api';
import { ItemType, RentalSession } from '@/models/index';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useItemStore = defineStore('items', () => {
	const itemTypes = ref<ItemType[]>([]);
	const itemTypeLatestSession = ref<{ [n: number]: RentalSession | undefined }>({});

	async function requestItemTypes() {
		const { data, error } = await apiClient.GET('/rental/itemtype');

		if (error) {
			console.log('trying to get item types', error);
			return;
		}

		if (data) {
			itemTypes.value = data;
		}

		return itemTypes.value;
	}

	async function getItemType(typeId: number) {
		const { data, error } = await apiClient.GET('/rental/itemtype/{id}', {
			params: { path: { id: typeId } },
		});

		if (error) {
			console.log('trying to get item type', typeId, error);
		}

		if (data) {
			return data;
		}
	}

	function constructPictureUrl(url: string | null | undefined) {
		return url && url.includes('.jpg')
			? url
			: 'https://pulsephotography.com.au/wp-content/uploads/2017/10/16x9-placeholder.jpg';
	}

	function populateItemSessionMap(sessions: RentalSession[]) {
		const allItemTypeIds = [...new Set(itemTypes.value.map(item => item.id))];
		for (const typeId of allItemTypeIds) {
			itemTypeLatestSession.value[typeId as number] = sessions.find(s => s.item_type_id === typeId);
		}
	}

	return {
		itemTypes,
		itemTypeLatestSession,
		requestItemTypes,
		getItemType,
		constructPictureUrl,
		populateItemSessionMap,
	};
});
