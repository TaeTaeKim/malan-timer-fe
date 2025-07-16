<script setup lang="ts">
import { ref } from 'vue';
import SupportModal from '../components/SupportModal.vue'
import { useAuthStore } from '../stores/auth';

const isSupportOpen = ref<Boolean>(false)
const toggleSupport = () => {
  isSupportOpen.value = !isSupportOpen.value;
}

function goToNotifier() {
  window.open('https://malanutil.com/malan-alerter', '_blank');
}

function redirectToDiscordLogin() {
  window.location.href = import.meta.env.VITE_DISCORD_LOGIN_URL
}

const authStore = useAuthStore();
</script>

<template>
  <header class="app-header">
    <div class="header-row">
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
        <button class="header-button"
          style="background-color: #5865f2; display: flex; align-items: center; gap: 5px; border: none;"
          @click="!authStore.currentUser && redirectToDiscordLogin">
          <span class="user-name">
            <span v-if="authStore.currentUser">{{ authStore.currentUser.name }}</span>
            <span v-else>로그인</span>
          </span>
          <span>
            <img v-if="authStore.isAvartar()" :src="authStore.currentUser?.avatar || ''" alt="avatar"
              style="width: 30px; border-radius: 50%;" />
            <img v-else src="https://cdn.discordapp.com/embed/avatars/0.png" alt="default avatar" class="avatar" />
          </span>
        </button>
      </div>
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

.header-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.avatar {
  width: 30px;
  border-radius: 50%;
}

@media (max-width: 600px) {
  .app-header {
    height: auto;
    padding: 5px 10px;
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


  .avatar {
    width: 3rem;
  }

  .header-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    margin-top: 6px;
    justify-content: flex-start;
  }
}
</style>
