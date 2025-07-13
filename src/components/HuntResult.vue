<script setup lang="ts">
import { computed, ref } from 'vue';
import { useConsumeStore } from '../stores/consume';
import { useHuntStore } from '../stores/hunt';
import { requiredExp } from '../data/requiredExp';

const consumeStore = useConsumeStore()
const huntStore = useHuntStore()

const huntTime = computed(() => huntStore.usedTime);
function formatOffset(time: number) {
    if (time >= 3600) {
        return `${Math.round(time / 60)}분`;
    }
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}분 ${sec}초`;
}
const earnedExp = computed(() => {
    const startLevel = huntStore.huntStart.level;
    const endLevel = huntStore.huntEnd.level;
    const startExp = huntStore.huntStart.exp;
    const endExp = huntStore.huntEnd.exp;

    if (endLevel === startLevel) {
        return endExp - startExp;
    } else if (endLevel > startLevel) {
        let exp = requiredExp[startLevel] - startExp; // exp to finish start level
        // Add full levels in between
        for (let lvl = startLevel + 1; lvl < endLevel; lvl++) {
            exp += requiredExp[lvl];
        }
        exp += endExp; // add exp in the last level
        return exp;
    } else {
        // If endLevel < startLevel, treat as 0 or error
        return 0;
    }

});
const needTimeForLevelup = computed(() => {
    const exp = earnedExp.value;
    const time = huntTime.value;
    if (!time || time === 0 || exp <= 0) return '측정 시간이 없습니다.';
    const expPerSec = exp / time;
    const currentLevel = huntStore.huntEnd.level;
    const expToNextLevel = requiredExp[currentLevel] - huntStore.huntEnd.exp;
    const needTime = expToNextLevel / expPerSec;
    return formatOffset(Math.ceil(needTime))
});

const earnedMeso = computed(() => huntStore.huntEnd.meso - huntStore.huntStart.meso);

const usedConsumables = computed(() =>
    consumeStore.selectedItems.map(item => {
        const start = huntStore.startQuantities[item.id] || 0;
        const end = huntStore.endQuantities[item.id] || 0;
        const used = start - end;
        const usedPrice = used * (item.price || 0);
        return {
            ...item,
            used,
            usedPrice,
        };
    })
);

const totalUsedPrice = computed(() =>
    usedConsumables.value.reduce((sum, item) => sum + item.usedPrice, 0)
);

const isEditingTime = ref(false);
const editMin = ref(0);
const editSec = ref(0);

function startEditTime() {
    isEditingTime.value = true;
    // Parse current huntTime into min/sec
    editMin.value = Math.floor(huntTime.value / 60) % 60;
    editSec.value = huntTime.value % 60;
}

function saveEditTime() {
    let totalSec = editMin.value * 60 + editSec.value;
    huntStore.setUsedTime(totalSec);
    isEditingTime.value = false;
}
function cancelEditTime() {
    isEditingTime.value = false;
}
</script>
<template>
    <div class="hunt-result-container">
        <h2 class="hunt-result-title">사냥 결과</h2>
        <div class="result-info">
            <div class="result-time">
                <template v-if="!isEditingTime">
                    <p style="font-weight: 900; font-size: 20px; padding-bottom: 10px;">
                        사냥 시간 : {{ formatOffset(huntTime) }}
                        <button @click="startEditTime" class="edit-time-btn">수정</button>
                    </p>
                </template>
                <template v-else>
                    <input type="number" v-model.number="editMin" min="0" max="59" class="edit-time-input"
                        style="width: 60px" placeholder="분" /> 분
                    <input type="number" v-model.number="editSec" min="0" max="59" class="edit-time-input"
                        style="width: 60px" placeholder="초" /> 초
                    <button @click="saveEditTime" class="edit-time-btn">저장</button>
                    <button @click="cancelEditTime" class="edit-time-btn">취소</button>
                </template>
            </div>
            <div class="result-exp-profit" style=" padding-bottom: 10px;">
                <div class="result-exp"
                    style="width: 50%; border-bottom: 2px solid greenyellow; display: flex; align-items: center;">
                    <p style="font-weight: 900; font-size: 20px; color:greenyellow">EXP</p>
                    <p style="margin-left: 20px;">{{ earnedExp }}</p>
                </div>
                <div class="result-profit"
                    style="width: 50%;border-bottom: 2px solid gold; display: flex; align-items: center;">
                    <p style="font-weight: 900; font-size: 20px; color:gold">수익</p>
                    <p style="margin-left: 20px;">{{ earnedMeso - totalUsedPrice }}</p>
                </div>
            </div>
            <div class="result-earn-requiredtime" style="margin: 10px 0;">
                <div class="result-earn" style="width: 50%; border-bottom: 2px solid;">
                    <p>획득메소 : {{ earnedMeso }}</p>
                </div>
                <div class="result-levelup-time" style="width: 50%; border-bottom: 2px solid;">
                    <p>레벨업까지 필요시간 : {{ needTimeForLevelup }}</p>
                </div>
            </div>
            <div class="result-cosume">
                <p>소비 가격</p>
                <div class="result-consume-list" style="padding-bottom: 10px;">
                    <div v-for="item in usedConsumables" class="result-consume-item">
                        <img :src="`https://maplestory.io/api/GMS/255/item/${item.id}/icon`"
                            style="margin-right: 5px; width: 30px;">
                        <span style="width: 30%;">{{ item.name }}</span>
                        <span style="margin-right: 10px; width: 25%;">사용 개수 : {{ item.used }}</span>
                        <span>메소 : {{ item.usedPrice }}</span>
                    </div>
                </div>
                <div class="result-consume-cost">
                    <p>총 사용 메소 : {{ totalUsedPrice }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
p {
    margin: 0;
    font-weight: 900;
    font-size: 20px;
}

.hunt-result-container {
    padding: 15px;
    margin-top: 10px;
    background-color: #343741;
    border-radius: 8px;
}

.hunt-result-title {
    text-align: center;
}

.result-exp-profit {
    display: flex;
    gap: 20px;
}

.result-earn-requiredtime {
    display: flex;
    gap: 20px;
}

.result-consume-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.result-consume-item {
    display: flex;
    align-items: center;
}

.edit-time-btn {
    margin-left: 8px;
    font-size: 14px;
    padding: 2px 8px;
    border-radius: 6px;
    border: none;
    background: #484B56;
    color: #fff;
    cursor: pointer;
}

.edit-time-btn:hover {
    background: #2563EB;
}

.edit-time-input {
    font-size: 18px;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #aaa;
    margin-right: 8px;
}
</style>