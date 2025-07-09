<script setup lang="ts">
import { ref, type Ref } from 'vue'
const activeTab: Ref<'preset' | 'history'> = ref('preset')

</script>
<template>
    <div class="preset-container default-background">
        <div class="tabs">
            <button :class="['tab-button', { active: activeTab === 'preset' }]" @click="activeTab = 'preset'">
                소비 프리셋
            </button>
            <button :class="['tab-button', { active: activeTab === 'history' }]" @click="activeTab = 'history'">
                사냥 히스토리
            </button>
        </div>
    </div>
</template>
<style scoped>
.preset-container {
    width: 30%;
    padding-left: 20px;
}

.tabs {
    display: flex;
    border-bottom: 1px solid #E2E8F0;
    margin-bottom: 24px;
}

.tab-button {
    padding: 8px 16px;
    border: none;
    border-bottom: 2px solid transparent;
    background: none;
    font-weight: bolder;
    color: white;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
}

.tab-button.active {
    color: #2563EB;
    border-color: #2563EB;
}

button:focus {
    outline: none;
}
</style>