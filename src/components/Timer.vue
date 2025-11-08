<script setup lang="ts">
import { ref, computed, type Ref, watch, onUnmounted } from 'vue'
import { useHuntStore } from '../stores/hunt'

// 스토어 사용
const huntStore = useHuntStore()

// Active tab: 'timer' or 'stopwatch'
const activeTab: Ref<'timer' | 'stopwatch'> = ref('timer')
const displayWidth = computed(() => activeTab.value === 'timer' ? '60%' : '100%')
const alarmAudio = new Audio('alarm-sound.mp3')

// Picture-in-Picture state
let pipWindow: Window | null = null
const isPipActive: Ref<boolean> = ref(false)

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

// Update PiP window content
function updatePipWindow(): void {
  if (!pipWindow || pipWindow.closed) return

  const displayEl = pipWindow.document.querySelector('.pip-display')
  const titleEl = pipWindow.document.querySelector('.pip-title')

  if (displayEl) {
    displayEl.textContent = displayTime.value
  }
  if (titleEl) {
    titleEl.textContent = activeTab.value === 'timer' ? '타이머' : '스톱워치'
  }
}

// Open Picture-in-Picture window
async function openPip(): Promise<void> {
  try {
    // Check if Document PiP API is supported
    if (!('documentPictureInPicture' in window)) {
      alert('이 브라우저는 팝업 창 기능을 지원하지 않습니다.\n최신 Chrome/Edge 브라우저를 사용해주세요.')
      return
    }

    // @ts-ignore - documentPictureInPicture is not in TypeScript types yet
    pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 320,
      height: 240,
    })

    if (!pipWindow) return

    isPipActive.value = true

    // Add styles to pip window
    const style = pipWindow.document.createElement('style')
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #1a1d29 0%, #2d3142 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        overflow: hidden;
      }
      .pip-container {
        padding: 16px;
        width: 100%;
        box-sizing: border-box;
      }
      .pip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .pip-title {
        font-weight: 900;
        font-size: 14px;
        color: #FF6239;
      }
      .btn-close {
        background: transparent;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background 0.2s;
      }
      .btn-close:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .pip-display {
        background-color: #111827;
        color: #D1D5DB;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
        font-size: 2.5rem;
        margin-bottom: 12px;
        border: 2px solid rgba(255, 255, 255, 0.05);
      }
      .pip-actions {
        display: flex;
        justify-content: center;
        gap: 8px;
      }
      .btn-pip-action {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.1s;
        font-weight: 500;
        flex: 1;
      }
      .btn-pip-action:active {
        transform: scale(0.95);
      }
      .btn-pip-action:hover {
        opacity: 0.9;
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
    `
    pipWindow.document.head.appendChild(style)

    // Add content to pip window
    const container = pipWindow.document.createElement('div')
    container.className = 'pip-container'
    container.innerHTML = `
      <div class="pip-header">
        <span class="pip-title">${activeTab.value === 'timer' ? '타이머' : '스톱워치'}</span>
        <button class="btn-close" id="closeBtn">✕</button>
      </div>
      <div class="pip-display">${displayTime.value}</div>
      <div class="pip-actions">
        <button class="btn-pip-action btn-start" id="startBtn">시작</button>
        <button class="btn-pip-action btn-stop" id="stopBtn">정지</button>
        <button class="btn-pip-action btn-reset" id="resetBtn">리셋</button>
      </div>
    `
    pipWindow.document.body.appendChild(container)

    // Add event listeners to buttons
    pipWindow.document.getElementById('startBtn')?.addEventListener('click', start)
    pipWindow.document.getElementById('stopBtn')?.addEventListener('click', stop)
    pipWindow.document.getElementById('resetBtn')?.addEventListener('click', reset)
    pipWindow.document.getElementById('closeBtn')?.addEventListener('click', closePip)

    // Listen for window close
    pipWindow.addEventListener('pagehide', () => {
      isPipActive.value = false
      pipWindow = null
    })

  } catch (error) {
    console.error('Failed to open Picture-in-Picture window:', error)
    alert('팝업 창을 열 수 없습니다. 브라우저 설정에서 팝업을 허용해주세요.')
  }
}

// Close Picture-in-Picture window
function closePip(): void {
  if (pipWindow && !pipWindow.closed) {
    pipWindow.close()
  }
  isPipActive.value = false
  pipWindow = null
}

// Watch for changes and update PiP window
watch([displayTime, activeTab], () => {
  updatePipWindow()
})

// Cleanup on component unmount
onUnmounted(() => {
  closePip()
})
</script>

<template>
  <div class="timer-container default-background">
    <!-- Tabs with Pop-out Button -->
    <div class="tabs">
      <div class="tabs-buttons">
        <button :class="['tab-button', { active: activeTab === 'timer' }]" @click="activeTimer">
          타이머
        </button>
        <button :class="['tab-button', { active: activeTab === 'stopwatch' }]" @click="activeStopwatch">
          스톱워치
        </button>
      </div>
      <button
        class="btn-pip"
        @click="isPipActive ? closePip() : openPip()"
        :title="isPipActive ? '팝업 닫기' : '팝업으로 열기'"
        :class="{ active: isPipActive }"
      >
      <div class="pip-text-img">
        <span style="color: black;">PIP 모드</span>
        <img src="../assets/pip-logo.png" alt="">
      </div>
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
.timer-container {
  width: 70%;
  margin-right: 10px;
}

/* tab 영역 */
.tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.btn-pip {
  background: white;
  border-radius: 10px;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.pip-text-img{
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-pip.active {
  background: #cccccc;
  
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
  .timer-container {
    margin-bottom: 10px;
    width: 94%;
    padding: 10px 3% 10px 3%;
  }

  .btn-pip {
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