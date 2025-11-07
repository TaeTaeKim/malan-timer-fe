<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { useHuntStore } from '../stores/hunt'

// 스토어 사용
const huntStore = useHuntStore()

// Active tab: 'timer' or 'stopwatch'
const activeTab: Ref<'timer' | 'stopwatch'> = ref('timer')
const displayWidth = computed(() => activeTab.value === 'timer' ? '60%' : '100%')
const alarmAudio = new Audio('alarm-sound.mp3')

// Pin state
const isPinned: Ref<boolean> = ref(false)

// Time state in seconds
const time: Ref<number> = ref(0)
let intervalId: number | null = null

// Computed formatted display string
const displayTime = computed<string>(() => {
  const total = activeTab.value === 'timer' ? time.value : -time.value
  const absVal = Math.abs(total)
  const mm = String(Math.floor(absVal / 60)).padStart(2, '0')
  const ss = String(absVal % 60).padStart(2, '0')
  return `${mm}:${ss}`
})

function activeStopwatch() {
  activeTab.value = 'stopwatch'
  huntStore.setTimerMode('stopwatch')
  time.value = 0
  huntStore.setTimer(0)
}
function activeTimer() {
  activeTab.value = 'timer'
  huntStore.setTimerMode('timer')
  time.value = 0
  huntStore.setTimer(0)
}
// Adjust timer by offset seconds
function adjustTime(offset: number): void {
  time.value = Math.max(0, time.value + offset)
}

// Format button label
function formatOffset(sec: number): string {
  return sec >= 60 ? `${sec / 60}분` : `${sec}초`
}

// Start timer/stopwatch
function start(): void {
  if (intervalId !== null) return
  if (activeTab.value === 'timer' && huntStore.timer === 0) {
    huntStore.setTimer(time.value) // Save the initial set time
  }
  intervalId = window.setInterval(() => {
    if (activeTab.value === 'timer') {
      if (time.value > 0) time.value--
      if (time.value === 0) {
        stop()
        alarmAudio.play()
        huntStore.setUsedTime(huntStore.timer)
      }
    } else { // 스톱워치는 그냥 계속 카운트
      time.value++
    }
  }, 1000)
}

// Stop interval
function stop(): void {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
    // Save used time to store
    if (activeTab.value === 'timer') {
      // Used time is setTime - remaining time
      huntStore.setUsedTime(huntStore.timer - time.value)
    } else {
      // Used time is just the elapsed time
      huntStore.setUsedTime(time.value)
    }
  }
}

// Reset state
function reset(): void {
  stop()
  time.value = 0
  huntStore.setUsedTime(0)
  if (activeTab.value === 'timer') {
    huntStore.setTimer(0)
  }
}

// Toggle pin state
function togglePin(): void {
  isPinned.value = !isPinned.value
}
</script>

<template>
  <!-- Pinned overlay view -->
  <div v-if="isPinned" class="pinned-overlay">
    <div class="pinned-container">
      <div class="pinned-header">
        <span class="pinned-title">{{ activeTab === 'timer' ? '타이머' : '스톱워치' }}</span>
        <button class="btn-unpin" @click="togglePin" title="고정 해제">📌</button>
      </div>
      <div class="pinned-display">
        {{ displayTime }}
      </div>
      <div class="pinned-actions">
        <button class="btn-pinned-action btn-start" @click="start">시작</button>
        <button class="btn-pinned-action btn-stop" @click="stop">정지</button>
        <button class="btn-pinned-action btn-reset" @click="reset">리셋</button>
      </div>
    </div>
  </div>

  <!-- Normal view -->
  <div class="timer-container default-background">
    <!-- Tabs with Pin Button -->
    <div class="tabs">
      <div class="tabs-buttons">
        <button :class="['tab-button', { active: activeTab === 'timer' }]" @click="activeTimer">
          타이머
        </button>
        <button :class="['tab-button', { active: activeTab === 'stopwatch' }]" @click="activeStopwatch">
          스톱워치
        </button>
      </div>
      <button class="btn-pin" @click="togglePin" title="상단 고정">
        📌
      </button>
    </div>

    <div class="display-contianer">
      <!-- Display -->
      <div class="display" :style="{ width: displayWidth }">
        {{ displayTime }}
      </div>

      <!-- Controls for Timer adjustments -->
      <div v-if="activeTab === 'timer'" class="adjust-grid">
        <!-- Positive adjustments -->
        <button v-for="sec in [10, 60, 300, 900, 1800, 3600]" :key="sec" class="btn-adjust positive"
          @click="adjustTime(sec)">
          +{{ formatOffset(sec) }}
        </button>
      </div>
    </div>


    <!-- Action Buttons -->
    <div class="actions">
      <button class="btn-action btn-start" @click="start">시작</button>
      <button class="btn-action btn-stop" @click="stop">정지</button>
      <button class="btn-action btn-reset" @click="reset">리셋</button>
    </div>
  </div>
</template>



<style scoped>
/* Pinned overlay styles */
.pinned-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pinned-container {
  background: linear-gradient(135deg, #1a1d29 0%, #2d3142 100%);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 280px;
  backdrop-filter: blur(10px);
}

.pinned-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.pinned-title {
  font-weight: 900;
  font-size: 16px;
  color: #FF6239;
}

.btn-unpin {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-unpin:hover {
  background: rgba(255, 255, 255, 0.1);
}

.pinned-display {
  background-color: #111827;
  color: #D1D5DB;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  font-family: 'Menlo', monospace;
  font-size: 2.5rem;
  margin-bottom: 12px;
  border: 2px solid rgba(255, 255, 255, 0.05);
}

.pinned-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.btn-pinned-action {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  font-weight: 500;
}

.btn-pinned-action:active {
  transform: scale(0.95);
}

.timer-container {
  width: 70%;
  margin-right: 10px;
}

/* tab 영역 */
.tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #E2E8F0;
  margin-bottom: 24px;
}

.tabs-buttons {
  display: flex;
}


.tab-button {
  padding: 8px 16px;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  font-weight: 900;
  font-size: 15px;
  color: white;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.tab-button.active {
  color: #FF6239;
  border-color: #FF6239;
}

.btn-pin {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.btn-pin:hover {
  background: rgba(255, 98, 57, 0.2);
  border-color: #FF6239;
  transform: scale(1.05);
}

/* display 영역 */
.display-contianer {
  display: flex;
  padding-bottom: 20px;
  gap: 10px
}

.display {
  background-color: #111827;
  color: #D1D5DB;
  border-radius: 10px;
  padding: 20px 0;
  text-align: center;
  font-family: 'Menlo', monospace;
  font-size: 3rem;
  margin: 10px 0;
}

.adjust-grid {
  display: grid;
  width: 40%;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.btn-adjust {
  padding: 5px;
  margin: 10px 0;
  border: none;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 15px;
  cursor: pointer;
}

.btn-adjust.positive {
  background-color: #131314;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-action {
  padding: 8px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-start {
  background-color: green;
  color: #FFFFFF;
}

.btn-stop {
  background-color: red;
  color: #FFFFFF;
}

.btn-reset {
  background-color: #FFFFFF;
  color: #1A202C;
  border: 1px solid #CBD5E0;
}

/* Remove default focus outline */
button:focus {
  outline: none;
}

@media (max-width: 600px) {
  /* Mobile pinned overlay */
  .pinned-overlay {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .pinned-container {
    min-width: auto;
    width: 100%;
  }

  .pinned-display {
    font-size: 2rem;
    padding: 16px;
  }

  .btn-pinned-action {
    font-size: 0.8rem;
    padding: 8px 12px;
  }

  .timer-container {
    margin-bottom: 10px;
    width: 94%;
    padding: 10px 3% 10px 3%;
  }

  .btn-pin {
    font-size: 16px;
    padding: 4px 10px;
  }

  .display-contianer {
    flex-direction: column;
    gap: 0;
    align-items: stretch;
  }

  .display {
    width: 100% !important;
    font-size: 2.2rem;
    padding: 16px 0;
  }

  .adjust-grid {
    width: 100% !important;
    margin-top: 10px;
    grid-template-columns: repeat(3, 1fr);
  }

  .btn-adjust {
    margin: 0;
  }

  .btn-action {
    font-size: 0.8rem;
    font-weight: 500;
  }
}
</style>