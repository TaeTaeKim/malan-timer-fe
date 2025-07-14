<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import HuntInfo from '../components/HuntInfo.vue';
import Preset from '../components/Preset.vue';
import Timer from '../components/Timer.vue';
import Consume from '../components/Consume.vue'
import HuntResult from '../components/HuntResult.vue';

// Cookie helpers
function setCookie(name: string, value: string, ttlSeconds: number) {
  const expires = new Date(Date.now() + ttlSeconds * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

const showAdModal = ref(false);

function checkAdModal() {
  showAdModal.value = getCookie('hideAlarmyAdModal') !== '1';
}
function closeAdModalToday() {
  setCookie('hideAlarmyAdModal', '1', 60 * 60 * 24); // 1 day TTL
  showAdModal.value = false;
}
function closeAdModal() {
  showAdModal.value = false;
}

onMounted(() => {
  checkAdModal();
});
</script>

<template>
  <AppHeader />
  <div v-if="showAdModal" class="ad-modal-overlay">
    <div class="ad-modal">
      <h2>🚀 메랜지지 매물 알림 받아보실래요?</h2>
      <p>메랜지지 원하는 매물을 디스코드 알람으로 받아보세요!<br>
        <a href="https://malanutil.com/malan-alerter/" target="_blank" rel="noopener">메랜지지알리미 링크</a>
        <br><span style="font-size: 14px; color: bisque;">알림 서비스는 알림 발송을 위해 디스코드 로그인이 필요합니다.</span>
      </p>
      <div class="ad-modal-actions">
        <button @click="closeAdModalToday">오늘 하루 보지 않기</button>
        <button @click="closeAdModal">닫기</button>
      </div>
    </div>
  </div>
  <div class="timer-preset-container">
    <Timer />
    <Preset />
  </div>
  <div class="consume-container">
    <Consume />
  </div>
  <div class="hunt-info-container">
    <div class="hunt-start">
      <h2 class="hunt-title">사냥 전</h2>
      <HuntInfo type="start" />
    </div>
    <div class="hunt-end">
      <h2 class="hunt-title">사냥 후</h2>
      <HuntInfo type="end" />
    </div>
  </div>
  <div class="hunt-result">
    <HuntResult />
  </div>
  <footer class="app-footer">
    <div>
      <a href="https://open.kakao.com/o/s4fVKDFh" target="_blank" rel="noopener noreferrer" class="openchat-link">
        💬 카카오톡 문의
      </a>
    </div>
    <div class="copyright">
      &copy; 2025 메랜 사냥 타이머. All rights reserved.
    </div>
  </footer>
</template>

<style scoped>
.ad-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.ad-modal {
  background: #23242a;
  border-radius: 16px;
  padding: 32px 24px 24px 24px;
  min-width: 340px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: #fff;
}

.ad-modal h2 {
  margin-top: 0;
  margin-bottom: 12px;
}

.ad-modal a {
  color: #2563EB;
  font-weight: bold;
  text-decoration: underline;
}

.ad-modal-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.ad-modal-actions button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #484B56;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
}

.ad-modal-actions button:hover {
  background: #2563EB;
}

.timer-preset-container {
  margin-top: 20px;
  display: flex;
  margin-bottom: 10px;
}

.hunt-info-container {
  display: flex;
  gap: 10px;
}

.hunt-title {
  text-align: center;
  margin: 5px 0;
}

.hunt-start,
.hunt-end {
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  width: 50%;
  background-color: #343741;
  border-radius: 8px;
  height: 400px;
}


.app-footer {
  margin-top: 40px;
  padding: 20px 0 10px 0;
  text-align: center;
  color: #888;
  font-size: 15px;
  background: none;
}

.openchat-link {
  color: #888;
  text-decoration: none;
  font-size: 13px;
  font-weight: bolder;
  margin-bottom: 8px;
  display: inline-block;
}

.openchat-link:hover {
  text-decoration: underline;
}

.copyright {
  margin-top: 6px;
  font-size: 13px;
}

@media(max-width:600px) {
  .hunt-title {
    font-size: 1.1rem;
  }

  .hunt-start,
  .hunt-end {
    width: 94% !important;
    padding: 10px 3% 10px 3% !important;
    height: auto;
  }

  .hunt-info-container,
  .timer-preset-container {
    flex-direction: column !important;
    gap: 10px !important;
  }
}
</style>
