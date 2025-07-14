<script setup lang="ts">
import { ref } from 'vue';
import SupportModal from '../components/SupportModal.vue'

const isSupportOpen = ref<Boolean>(false)
const toggleSupport = () => {
  isSupportOpen.value = !isSupportOpen.value;
}

function goToNotifier() {
  window.open('https://malanutil.com/malan-alerter', '_blank');
}
</script>

<template>
  <header class="app-header">
    <div class="logo-title">
      <img src="../assets/logo.png" alt="Logo" class="logo-image">
      <h1 class="title-text">메랜 사냥 타이머</h1>
    </div>
    <div class="header-actions">
      <div class="support-container">
        <button class="header-button" @click="toggleSupport">💸 후원하기</button>
        <SupportModal :is-open="isSupportOpen" />
      </div>
      <button class="header-button" @click="goToNotifier">메랜지지 알리미</button>
      <!-- <button class="header-button"
        style="background-color: #5865f2; display: flex; align-items: center; gap: 5px; border: none;">
        <span>로그인</span>
        <span><img src="https://cdn.discordapp.com/embed/avatars/0.png" alt="" style="width: 30px;"></span>
      </button> -->
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  color: white;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-title {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 6px;
}

.logo-image {
  height: 56px;
  width: auto;
}

.title-text {
  color: white;
}

.support-container {
  position: relative;
  border-radius: 8px;
}

.header-button {
  padding: 3px 12px 3px 12px;
  color: white;
  background: #1D1E23;
  font-weight: bolder;
  font-size: 18px;
  height: 48px;
  border: none;
  border-radius: 8px;
  border: 1px solid #b9bcbd;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .app-header {
    height: 36px;
  }

  .logo-image {
    height: 24px;
  }

  .title-text {
    font-size: 1.1rem;
  }

  .header-button {
    font-size: 13px;
    height: 28px;
    padding: 2px 8px 2px 8px;
  }
}
</style>
