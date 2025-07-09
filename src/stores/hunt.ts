import { defineStore } from "pinia";

export interface HuntInfo {
  level: number;
  exp: number;
  meso: number;
}

export const useHuntStore = defineStore("hunt", {
  state: () => ({
    startQuantities: {} as Record<number, number>,
    endQuantities: {} as Record<number, number>,
    huntStart: { level: 0, exp: 0, meso: 0 } as HuntInfo,
    huntEnd: { level: 0, exp: 0, meso: 0 } as HuntInfo,

    // hunt time
    timerMode: "timer",
    timer: 0,
    usedTime: 0,
  }),
  actions: {
    // 소비 관련 함수
    setStartQuantity(itemId: number, quantity: number) {
      this.startQuantities[itemId] = quantity;
    },
    setEndQuantity(itemId: number, quantity: number) {
      this.endQuantities[itemId] = quantity;
    },
    setHuntStart(data: HuntInfo) {
      this.huntStart = data;
    },
    setHuntEnd(data: HuntInfo) {
      this.huntEnd = data;
    },
    // 사냥 시간 관련 함수
    setTimerMode(mode: "timer" | "stopwatch") {
      this.timerMode = mode;
    },
    setTimer(time: number) {
      this.timer = time;
    },
    setUsedTime(time: number) {
      this.usedTime = time;
    },
  },
});
