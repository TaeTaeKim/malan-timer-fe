<script setup lang="ts">
import { ref, computed } from 'vue';

const showModal = ref<boolean>(false);
const search = ref('');
const tabs = ['hp', 'mp', '버프', '기타'];
const selectedTab = ref<string>(tabs[0]);

// Example items, replace with your actual data
interface Item {
    name: string;
    type: string;
}
const items = ref<Item[]>([
    { name: 'HP 포션', type: 'hp' },
    { name: 'MP 포션', type: 'mp' },
    { name: '버프', type: '버프' },
    { name: '기타', type: '기타' },
    { name: '슈퍼 HP 포션', type: 'hp' },
    { name: '슈퍼 MP 포션', type: 'mp' },
]);

const filteredItems = computed(() => {
    return items.value.filter(item =>
        item.type === selectedTab.value &&
        item.name.toLowerCase().includes(search.value.toLowerCase())
    );
});
</script>
<template>
    <div class="consume-section">
        <h2 class="consume-title">소비 아이템 설정</h2>
        <div class="consume-list">

        </div>
        <div class="consume-section-botton">
            <button class="consume-add" @click="showModal = true">추가</button>
            <button class="consume-save">프리셋 저장</button>
        </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
        <div class="modal-container">
            <div class="modal-header">
                <input v-model="search" class="potion-search" placeholder="소비템 검색">
            </div>
            <div class="modal-tabs">
                <button v-for="tab in tabs" :key="tab" :class="['modal-tab', { active: selectedTab === tab }]"
                    @click="selectedTab = tab">{{ tab }}</button>
            </div>
            <div class="modal-list">
                <div v-for="item in filteredItems" :key="item.name" class="modal-list-item">
                    {{ item.name }}
                </div>
            </div>
            <button class="modal-close" @click="showModal = false">닫기</button>

        </div>
    </div>

</template>

<style scoped>
.consume-section {
    background-color: #343741;
    border-radius: 8px;
    margin-bottom: 10px;
    min-height: 220px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

}

.consume-title {
    text-align: center;
    margin: 5px 0;
}

.consume-list {
    height: 140px;
    margin-bottom: 5px;
}

.consume-title {
    text-align: center;
}

.consume-section-botton {
    display: flex;
    height: 30px;
    justify-content: end;
    gap: 10px;
}

.consume-section-botton>button {
    font-size: 18px;
    font-weight: 900;
    border-radius: 8px;
    background: none;
    border: 2px solid #484B56;
}


.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-container {
    background: #23242a;
    border-radius: 12px;
    padding: 24px 20px 16px 20px;
    min-width: 500px;
    min-height: 600px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: relative;
}

.modal-header {
    margin-bottom: 12px;
}

.potion-search {
    width: 95%;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #484B56;
    font-size: 16px;
    background: #343741;
    color: #fff;
}

.modal-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.modal-tab {
    flex: 1;
    padding: 8px 0;
    border: none;
    background: #343741;
    color: #fff;
    border-radius: 6px 6px 0 0;
    font-weight: 700;
    cursor: pointer;
    font-size: 16px;
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s;
}

.modal-tab.active {
    border-bottom: 2px solid #2563EB;
    color: #2563EB;
}

.modal-list {
    flex: 1;
    overflow-y: auto;
    background: #2a2b31;
    border-radius: 6px;
    margin-bottom: 16px;
}

.modal-list-item {
    padding: 8px 12px;
    border-radius: 4px;
    margin-bottom: 6px;
    background: #343741;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s;
}

.modal-list-item:hover {
    background: #484B56;
}

.modal-close {
    align-self: flex-end;
    margin-top: 8px;
    padding: 6px 16px;
    border-radius: 6px;
    border: none;
    background: #484B56;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
}
</style>