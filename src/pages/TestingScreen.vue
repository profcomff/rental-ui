<script setup lang="ts">
import ToastQueue from '@/components/ToastQueue.vue';
import { useToastStore } from '@/store';

const toastStore = useToastStore();
</script>

<template>
	<v-btn @click="toastStore.success({ title: `hello ${Math.random()}`, description: 'hi' })">Hey</v-btn>
	<v-btn @click="toastStore.warning({ title: `hello ${Math.random()}`, description: 'hi' })">Hey</v-btn>
	<v-btn @click="toastStore.error({ title: `hello ${Math.random()}`, description: 'hi' })">Hey</v-btn>
	<ToastQueue></ToastQueue>
</template>
