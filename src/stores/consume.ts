import { defineStore } from "pinia";
import type { Item } from "../data/items";
import type { PresetItem } from "./preset";
import { hpItems, mpItems, buffItems, etcItems } from "../data/items";

interface SelectedItem extends Item {
  count: number;
  price: number;
}
export const useConsumeStore = defineStore("consume", {
  state: () => ({
    selectedItems: [] as SelectedItem[],
  }),
  actions: {
    addItem(item: Item) {
      if (!this.selectedItems.find((i) => i.id === item.id)) {
        this.selectedItems.push({ ...item, count: 1, price: item.price });
      }
    },
    deleteSelectedItem(id: number) {
      this.selectedItems = this.selectedItems.filter((item) => item.id !== id);
    },
    clear() {
      this.selectedItems = [];
    },
    updateItem(id: number, data: Partial<SelectedItem>) {
      const item = this.selectedItems.find((i) => i.id === id);
      if (item) Object.assign(item, data);
    },

    loadPresetItem(presetItemList: PresetItem[]) {
      this.clear();
      const allItems = [...hpItems, ...mpItems, ...buffItems, ...etcItems];
      this.selectedItems = presetItemList.reduce((acc, presetItem) => {
        const item = allItems.find((i) => i.id === presetItem.itemId);
        if (item) {
          acc.push({
            ...item,
            count: 0,
            price: presetItem.price,
          });
        }
        return acc;
      }, [] as SelectedItem[]);
    },
  },
});
