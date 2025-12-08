<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { usePresetStore } from '../stores/preset'
import { useConsumeStore } from '../stores/consume';
import { useAuthStore } from '../stores/auth';

const activeTab: Ref<'preset' | 'history'> = ref('preset')
const presetStore = usePresetStore();
const consumeStore = useConsumeStore();
const authStore = useAuthStore();

function handleDelete(presetId: number) {
    presetStore.deletePreset(presetId);
}

async function loadPresetItem(presetId: number) {
    const items = await presetStore.fetchPresetItems(presetId);
    consumeStore.loadPresetItem(items)
}

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
        <div>
            <div v-if="activeTab === 'preset'">
                <div v-if="authStore.isAuthenticated" v-for="preset in presetStore.presetList" :key="preset.presetId"
                    class="preset-item">
                    <span class="preset-name" v-on:click="loadPresetItem(preset.presetId)" style="cursor: pointer;">{{
                        preset.name }}</span>
                    <div class="preset-buttons">
                        <button class="preset-select-btn" v-on:click="loadPresetItem(preset.presetId)">선택</button>
                        <button class="preset-delete-btn" @click="handleDelete(preset.presetId)">삭제</button>
                    </div>
                </div>
                <div v-else style="text-align: center;">로그인이 필요한 기능입니다.</div>
            </div>
            <div v-if="activeTab === 'history'" style="text-align: center;">
                열심히 개발중입니다🔥
            </div>
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
    margin-bottom: 24px;
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

button:focus {
    outline: none;
}

.preset-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
}

.preset-name {
    font-size: 18px
}

.preset-buttons {
    display: flex;
    gap: 10px;
}

.preset-select-btn,
.preset-delete-btn {
    padding: 6px 16px;
    border-radius: 6px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.preset-select-btn {
    background: #2563EB;
    color: #fff;
}

.preset-select-btn:hover {
    background: #1d4ed8;
}

.preset-delete-btn {
    background: #484B56;
    color: #fff;
}

.preset-delete-btn:hover {
    background: #ef4444;
}

@media(max-width:600px) {
    .preset-container {
        width: 94%;
        padding: 10px 3% 10px 3%;
    }

    .preset-select-btn,
    .preset-delete-btn {
        font-size: 13px;
        padding: 5px 12px;
    }
}
</style>