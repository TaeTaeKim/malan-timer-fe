<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import Preset from '../components/Preset.vue';
import Timer from '../components/Timer.vue';
</script>

<template>
  <AppHeader />
  <div class="timer-preset-container">
    <Timer />
    <Preset />
  </div>
  <div class="hunt-info-container">


  </div>
</template>

<style scoped>
.timer-preset-container {
  margin-top: 20px;
  height: 400px;
  display: flex;
}
</style>
