<script setup lang="ts">
</script>

<template>
  <header class="app-header">
    <div class="logo-title">
      <img src="../assets/logo.png" alt="Logo" class="logo-image">
      <h1>메랜 사냥 타이머</h1>
    </div>
    <div class="header-actions">
      <div class="support-container">
        <button class="support-btn" @click="">💸 후원하기</button>
      </div>
      <!-- <button @click="handleLogout" class="logout-btn">로그아웃</button> -->
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

.support-container {
  position: relative;
  border-radius: 8px;
}

.support-btn {
  padding: 3px 12px 3px 12px;
  color: white;
  background: #1D1E23;
  font-weight: bolder;
  font-size: 18px;
  height: 48px;
  border: 1px solid #b9bcbd;
}
</style>
