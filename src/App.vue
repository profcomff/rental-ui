<script setup lang="ts">
import { setupAuth } from '@profcomff/api-uilib';
import { useProfileStore } from './store';
import { onMounted } from 'vue';
import { useItemStore } from './store/itemStore';
import { useTestStore } from './store/testRequestStore';

const profileStore = useProfileStore();
const itemStore = useItemStore();
const testStore = useTestStore();

onMounted(() => {
  profileStore.fromUrl();
  itemStore.requestItemTypes();
  testStore.init();
  setupAuth('');
});
</script>