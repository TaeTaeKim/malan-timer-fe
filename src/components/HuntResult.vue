<script setup lang="ts">
import { computed } from 'vue';
import { useConsumeStore } from '../stores/consume';

const consumeStore = useConsumeStore()
const selectedItems = computed(() => consumeStore.selectedItems)
</script>
<template>
    <div class="hunt-result-container">
        <h2 class="hunt-result-title">사냥 결과</h2>
        <div class="result-info">
            <div class="result-time">
                <p style="font-weight: 900; font-size: 20px; padding-bottom: 10px;">사냥 시간</p>
            </div>
            <div class="result-exp-profit" style=" padding-bottom: 10px;">
                <div class="result-exp" style="width: 50%; border-bottom: 2px solid greenyellow;">
                    <p style="font-weight: 900; font-size: 20px; color:greenyellow">EXP</p>
                    <p></p>
                </div>
                <div class="result-profit" style="width: 50%;border-bottom: 2px solid gold;">
                    <p style="font-weight: 900; font-size: 20px; color:gold">수익</p>
                    <p></p>
                </div>
            </div>
            <div class="result-earn-requiredtime" style="margin: 10px 0;">
                <div class="result-earn" style="width: 50%; border-bottom: 2px solid;">
                    <p>획득메소</p>
                </div>
                <div class="result-levelup-time" style="width: 50%; border-bottom: 2px solid;">
                    <p>레벨업까지 필요시간</p>
                </div>
            </div>
            <div class="result-cosume">
                <p>소비 가격</p>
                <div class="result-consume-list" style="padding-bottom: 10px;">
                    <div v-for="item in selectedItems" class="result-consume-item">
                        <img :src="`https://maplestory.io/api/GMS/255/item/${item.id}/icon`"
                            style="margin-right: 5px; width: 30px;">
                        <span style="width: 30%;">{{ item.name }}</span>
                        <span style="margin-right: 10px;">개수 : </span>
                        <span>메소 : </span>
                    </div>
                </div>
                <div class="result-consume-cost">
                    <p>총 사용 메소 : </p>
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
</style>