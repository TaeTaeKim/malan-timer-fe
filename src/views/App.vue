<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import HuntInfo from '../components/HuntInfo.vue';
import Preset from '../components/Preset.vue';
import Timer from '../components/Timer.vue';
import Consume from '../components/Consume.vue'
</script>

<template>
  <AppHeader />
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
      <HuntInfo />
    </div>
    <div class="hunt-end">
      <h2 class="hunt-title">사냥 후</h2>
      <HuntInfo />
    </div>
  </div>
</template>

<style scoped>
.timer-preset-container {
  margin-top: 20px;
  display: flex;
  margin-bottom: 20px;
}

.hunt-info-container {
  display: flex;
  gap: 20px;
}

.hunt-title {
  text-align: center;
  margin: 5px 0;
}

.hunt-start,
.hunt-end {
  width: 50%;
  background-color: #343741;
  border-radius: 8px;
  min-height: 400px;
}
</style>
