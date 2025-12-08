import { defineStore } from "pinia";
import type { Item } from "../data/items";
import type { PresetItem } from "./preset";
import { hpItems, mpItems, buffItems, etcItems } from "../data/items";

interface SelectedItem extends Item {
  count: number;
  price: number;
  isCustom: boolean; // Flag for user-created custom items
}
export const useConsumeStore = defineStore("consume", {
  state: () => ({
    selectedItems: [] as SelectedItem[],
  }),
  actions: {
    addItem(item: Item) {
      if (!this.selectedItems.find((i) => i.id === item.id)) {
        this.selectedItems.push({
          ...item,
          count: 1,
          price: item.price,
          isCustom: false,
        });
      }
    },
    addCustomItem(itemName: string, price: number) {
      // Use negative timestamp as unique ID for custom items
      const customId = -Date.now();
      this.selectedItems.push({
        id: customId,
        name: itemName,
        type: "custom",
        price: price,
        count: 1,
        isCustom: true,
      });
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
        if (presetItem.isCustom && presetItem.customItemName) {
          // Handle custom item
          acc.push({
            id: presetItem.itemId,
            name: presetItem.customItemName,
            type: "custom",
            price: presetItem.price,
            count: 0,
            isCustom: true,
          });
        } else {
          // Handle predefined item
          const item = allItems.find((i) => i.id === presetItem.itemId);
          if (item) {
            acc.push({
              ...item, // id, name, type, price(override)
              count: 0,
              price: presetItem.price,
              isCustom: false,
            });
          }
        }
        return acc;
      }, [] as SelectedItem[]);
    },
  },
});
