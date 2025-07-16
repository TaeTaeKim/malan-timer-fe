import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

interface Preset {
  name: string;
  presetId: number;
}

// Define PresetItem type for items in a preset (server only returns id, price, type)
export interface PresetItem {
  itemId: number;
  price: number;
}

export const usePresetStore = defineStore("preset", () => {
  const presetList = ref<Preset[]>([]);
  const loading = ref(false);

  async function fetchPresetList() {
    loading.value = true;
    try {
      const res = await axios.get<Preset[]>("/api/preset");
      presetList.value = res.data;
    } catch (e: any) {
      //  do not anything
    } finally {
      loading.value = false;
    }
  }

  async function deletePreset(presetId: number) {
    try {
      await axios.delete(`/api/preset/${presetId}`);
      presetList.value = presetList.value.filter(
        (p) => p.presetId !== presetId
      );
    } catch (e: any) {
      // Optionally handle error
    }
  }

  // Fetch items for a specific preset
  async function fetchPresetItems(presetId: number): Promise<PresetItem[]> {
    const res = await axios.get<PresetItem[]>(`/api/preset/${presetId}`);
    return res.data;
  }

  return {
    presetList,
    loading,
    fetchPresetList,
    deletePreset,
    fetchPresetItems,
  };
});
