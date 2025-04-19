import { mockItemTypes } from '@/constants/mockData';
import { ItemType } from '@/models/index';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useItemStore = defineStore('items', () => {
  const itemTypes = ref<ItemType[]>([]);

  function requestItemTypes() {
    itemTypes.value = mockItemTypes;
  }

  function getItemTypes() {
    return itemTypes.value;
  }

  function getItemType(typeId: number) {
    return itemTypes.value.find(item => item.id == typeId) ?? undefined;
  }

  return {
    requestItemTypes,
    getItemTypes,
    getItemType,
  };
});