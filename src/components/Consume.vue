<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { hpItems, mpItems, buffItems, etcItems, type Item } from '../data/items';
import { useConsumeStore } from '../stores/consume';
import { usePresetStore } from '../stores/preset';
import mapleImage from '../assets/mapleimage.png';

// use store
const consumeStore = useConsumeStore()
const presetStore = usePresetStore()

const showModal = ref<boolean>(false);
const showPresetSaveModal = ref<boolean>(false);
const showCustomItemModal = ref<boolean>(false);
const search = ref('');
const tabs = ['hp', 'mp', 'buff', 'etc'];
const selectedTab = ref<string>(tabs[0]);
const presetName = ref('');
const presetNameError = ref('');
const customItemName = ref('');
const customItemPrice = ref<number>(0);
const customItemError = ref('');

function closeModal() {
    showModal.value = false;
    showPresetSaveModal.value = false;
    showCustomItemModal.value = false;
    search.value = '';
    customItemName.value = '';
    customItemPrice.value = 0;
    customItemError.value = '';
}
const itemList = {
    hp: hpItems,
    mp: mpItems,
    buff: buffItems,
    etc: etcItems
}

const isComposing = ref(false);

function onInput(e: Event) {
    if (!isComposing.value) {
        search.value = (e.target as HTMLInputElement).value;
    }
}
function onCompositionEnd(e: CompositionEvent) {
    isComposing.value = false;
    search.value = (e.target as HTMLInputElement).value;
}
const filteredItems = computed(() => {
    const list = itemList[selectedTab.value as keyof typeof itemList] || [];
    if (!search.value) return list;
    return list.filter(item =>
        item.name.includes(search.value)
    );
});

const selectedItems = computed(() => consumeStore.selectedItems)

function selectItem(item: Item) {
    const found = selectedItems.value.find(i => i.id === item.id);
    if (found) {
        consumeStore.deleteSelectedItem(item.id);
    } else {
        consumeStore.addItem(item);
    }
}

function deleteSelectedItem(id: number) {
    consumeStore.deleteSelectedItem(id)
}
function isSelectedItem(id: number) {
    return selectedItems.value.some(i => i.id === id);
}

const MAX_PRESET_COUNT = 5;
const isPresetLimitReached = computed(() => presetStore.presetList.length >= MAX_PRESET_COUNT);

async function handlePresetSaveConfirm() {
    const trimmedPresetName = presetName.value.trim();

    if (!trimmedPresetName) {
        presetNameError.value = '프리셋 이름을 입력해주세요.';
        return;
    }

    if (trimmedPresetName.length > 10) {
        presetNameError.value = '프리셋 이름은 최대 10자까지 입력 가능합니다.';
        return;
    }

    try {
        await presetStore.savePreset(
            trimmedPresetName,
            selectedItems.value.map(item => ({
                itemId: item.id,
                price: item.price,
                isCustom: item.isCustom,
                customItemName: item.isCustom ? item.name : undefined
            }))
        );
        await presetStore.fetchPresetList();
        closeModal();
        presetName.value = '';
        presetNameError.value = '';
    } catch (e) {
        alert("저장에 실패했습니다. 관리자에게 문의하세요")
    }
}
function handlePresetSaveCancel() {
    closeModal();
    presetName.value = '';
    presetNameError.value = '';
}

watch(presetName, () => {
    if (presetNameError.value) presetNameError.value = '';
});

function handleCustomItemAdd() {
    const trimmedName = customItemName.value.trim();

    if (!trimmedName) {
        customItemError.value = '아이템 이름을 입력해주세요.';
        return;
    }

    if (trimmedName.length > 10) {
        customItemError.value = '아이템 이름은 최대 10자까지 입력 가능합니다.';
        return;
    }

    // Check if item name already exists in predefined items
    const allItems = [...hpItems, ...mpItems, ...buffItems, ...etcItems];
    const isDuplicate = allItems.some(item => item.name === trimmedName);
    if (isDuplicate) {
        customItemError.value = '이미 존재하는 아이템입니다. 다른 이름을 사용해주세요.';
        return;
    }

    if (customItemPrice.value < 0) {
        customItemError.value = '가격은 0 이상이어야 합니다.';
        return;
    }

    consumeStore.addCustomItem(trimmedName, customItemPrice.value);
    closeModal();
}

watch(customItemName, () => {
    if (customItemError.value) customItemError.value = '';
});

</script>
<template>
    <div class="consume-section">
        <h2 class="consume-title">소비 아이템 설정</h2>
        <div v-if="selectedItems.length === 0" class="consume-empty-message">
            사냥에서 사용하는 아이템을 추가해보세요
        </div>
        <div v-else class="consume-list">
            <div v-for="item in selectedItems" :key="item.id" class="consume-list-item">
                <div class="item-info">
                    <div class="item-left">
                        <img v-if="item.isCustom" :src="mapleImage" alt="custom item" class="item-icon">
                        <img v-else :src="`https://maplestory.io/api/GMS/255/item/${item.id}/icon?`" class="item-icon">
                        <p class="item-name-text">{{ item.name }}</p>
                    </div>
                    <div class="item-right">
                        <div class="price-input-wrapper">
                            <input type="number" v-model.number="item.price" min="0" class="price-input">
                            <span class="input-suffix">메소</span>
                        </div>
                        <button class='x-button' @click="deleteSelectedItem(item.id)">×</button>
                    </div>
                </div>
            </div>

        </div>
        <div class="consume-section-botton">
            <button class="consume-add consume-btn" @click="showModal = true">소비 아이템 추가</button>
            <div class="save-reset-btn">
                <button class="consume-save consume-btn" @click="showPresetSaveModal = true">프리셋 저장</button>
                <button class="consume-reset consume-btn" @click="consumeStore.clear()">초기화</button>
            </div>
        </div>
    </div>

    <!-- 소비 아이템 선택 모달 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
            <div class="modal-header">
                <input v-model="search" class="potion-search" :placeholder="`${selectedTab} 아이템 검색`"
                    @compositionstart="isComposing = true" @compositionend="onCompositionEnd" @input="onInput" />
            </div>
            <div class="modal-tabs">
                <button v-for="tab in tabs" :key="tab" :class="['modal-tab', { active: selectedTab === tab }]"
                    @click="selectedTab = tab">{{ tab }}</button>
            </div>
            <div class="modal-list">
                <div v-for="item in filteredItems" :key="item.name" class="modal-list-item"
                    :class="{ selected: isSelectedItem(item.id) }" @click="selectItem(item)">
                    <img :src="`https://maplestory.io/api/GMS/255/item/${item.id}/icon`">
                    {{ item.name }}
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-custom-add-btn" @click="showModal = false; showCustomItemModal = true">
                    찾는 아이템이 없으신가요?
                </button>
                <button class="modal-close" @click="closeModal">닫기</button>
            </div>

        </div>
    </div>

    <!--  프리셋 저장 모달 -->
    <div v-if="showPresetSaveModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container preset-modal-container">
            <div class="modal-header preset-modal-header">
                <label class="preset-modal-label">프리셋 이름</label>
                <input v-model="presetName" class="preset-modal-input" placeholder="프리셋 이름 입력 (최대 10자)"
                    maxlength="10" />
                <div v-if="presetNameError || isPresetLimitReached" class="preset-modal-error">
                    <div v-if="presetNameError">{{ presetNameError }}</div>
                    <div v-if="isPresetLimitReached">최신날짜 기준 5개만 저장됩니다</div>
                </div>
            </div>
            <div class="preset-modal-list-title">저장될 아이템 목록</div>
            <div class="preset-modal-item-list">
                <div v-for="item in selectedItems" :key="item.id" class="preset-modal-item-row">
                    <img v-if="item.isCustom" :src="mapleImage" alt="custom item" class="preset-modal-item-img" />
                    <img v-else :src="`https://maplestory.io/api/GMS/255/item/${item.id}/icon`"
                        class="preset-modal-item-img" />
                    <span class="preset-modal-item-name">{{ item.name }}</span>
                    <span class="preset-modal-item-price">{{ item.price }}메소</span>
                </div>
                <div v-if="selectedItems.length === 0" class="preset-modal-empty">선택된 아이템이 없습니다.</div>
            </div>
            <div class="preset-modal-btn-group">
                <button class="modal-close" @click="handlePresetSaveCancel">취소</button>
                <button class="modal-close preset-modal-confirm" @click="handlePresetSaveConfirm">확인</button>
            </div>
        </div>
    </div>

    <!-- 커스텀 아이템 추가 모달 -->
    <div v-if="showCustomItemModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container preset-modal-container">
            <div class="modal-header preset-modal-header">
                <label class="preset-modal-label">커스텀 아이템 추가</label>
                <input v-model="customItemName" class="preset-modal-input" placeholder="아이템 이름 입력 (최대 10자)"
                    maxlength="10" style="margin-top: 8px; margin-bottom: 12px;" />
                <label class="preset-modal-label">가격</label>
                <input v-model.number="customItemPrice" type="number" min="0" class="preset-modal-input"
                    placeholder="가격 입력" style="margin-top: 8px;" />
                <div v-if="customItemError" class="preset-modal-error">
                    {{ customItemError }}
                </div>
            </div>
            <div class="preset-modal-btn-group">
                <button class="modal-close" @click="closeModal">취소</button>
                <button class="modal-close preset-modal-confirm" @click="handleCustomItemAdd">추가</button>
            </div>
        </div>
    </div>

</template>

<style scoped>
.consume-section {
    background-color: #343741;
    border-radius: 8px;
    margin-bottom: 10px;
    min-height: 230px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

}

.consume-title {
    text-align: center;
    margin: 5px 0;
}

.consume-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    height: 140px;
    margin-bottom: 5px;
    column-gap: 20px;
    overflow-y: auto;
}

.consume-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 35px;
}

.item-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
}

.item-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.item-icon {
    width: 30px;
    height: 30px;
}

.item-name-text {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
}

.item-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.price-input-wrapper {
    display: flex;
    align-items: center;
    gap: 5px;
}

.price-input {
    width: 80px;
}

.input-suffix {
    font-weight: 700;
    font-size: 14px;
    color: #eab308;
}

.consume-title {
    text-align: center;
}

.consume-section-botton {
    display: flex;
    height: 35px;
    justify-content: space-between;
    gap: 10px;
}

.consume-btn {
    font-size: 18px;
    font-weight: 500;
    border-radius: 8px;
    background: none;
    border: 2px solid #484B56;
    height: 100%;
}

.consume-btn:hover {
    background: #515972;
}

.consume-add {
    width: 20%;
}

.save-reset-btn {
    display: flex;
    gap: 10px;
    width: 30%;
}

.consume-save,
.consume-reset {
    width: 50%;
}

.consume-empty-message {
    text-align: center;
    color: #888;
    padding: 20px;
    font-size: 20px;
    height: 120px;
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
    max-height: 600px;
    overflow-y: auto;
}

.modal-list-item {
    padding: 8px 12px;
    border-radius: 4px;
    margin-bottom: 6px;
    background: #343741;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    gap: 20px;
    font-weight: 800;
}

.modal-list-item.selected {
    background: #2563EB;
    color: #fff;
}

.modal-list-item:hover {
    background: #484B56;
}

.modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}

.modal-custom-add-btn {
    padding: 6px 16px;
    border-radius: 6px;
    border: none;
    background: #2563EB;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
}

.modal-custom-add-btn:hover {
    background: #1d4ed8;
}

.modal-close {
    padding: 6px 16px;
    border-radius: 6px;
    border: none;
    background: #484B56;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
}

.preset-modal-container {
    min-height: unset;
    min-width: 340px;
    width: 340px;
}

.preset-modal-header {
    margin-bottom: 12px;
}

.preset-modal-label {
    font-weight: 700;
}

.preset-modal-input {
    width: 100%;
    margin-top: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #484B56;
    font-size: 16px;
    background: #343741;
    color: #fff;
    box-sizing: border-box;
}

.preset-modal-list-title {
    margin: 16px 0 8px 0;
    font-weight: 700;
}

.preset-modal-item-list {
    max-height: 180px;
    overflow-y: auto;
}

.preset-modal-item-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
}

.preset-modal-item-img {
    width: 24px;
}

.preset-modal-item-name {
    flex: 1;
}

.preset-modal-item-type,
.preset-modal-item-count,
.preset-modal-item-price {
    font-size: 13px;
}

.preset-modal-empty {
    text-align: center;
    color: #888;
    padding: 12px;
}

.preset-modal-btn-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 18px;
}

.preset-modal-confirm {
    background: #2563EB;
    color: #fff;
}

.preset-modal-error {
    color: #ff5a5a;
    font-size: 14px;
    margin-top: 4px;
    margin-bottom: 0;
    min-height: 18px;
}

.preset-modal-confirm:disabled,
.preset-modal-confirm.preset-modal-confirm-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 600px) {
    .consume-section {
        width: 94%;
        padding: 10px 3% 10px 3%;
    }

    .consume-title {
        font-size: 1.1rem;
    }

    .consume-list {
        grid-template-columns: 1fr !important;
        height: auto;
        column-gap: 0;
    }

    .item-name-text {
        max-width: 120px;
        font-size: 13px;
    }

    .price-input {
        width: 60px;
        font-size: 13px;
    }

    .input-suffix {
        font-size: 12px;
    }

    .consume-section-botton {
        flex-direction: column;
        gap: 6px;
        height: auto;
        align-items: stretch;
    }

    .consume-btn {
        font-size: 15px;
        padding: 6px 0;
        width: 100% !important;
        min-width: 0;
        box-sizing: border-box;
    }

    .save-reset-btn {
        width: 100%;
        display: flex;
    }

    .consume-add,
    .consume-save,
    .consume-reset {
        width: 100% !important;
    }

    .consume-empty-message {
        font-size: 16px;
        height: 80px;
        padding: 12px;
    }

    .modal-container {
        min-width: 90vw !important;
        max-width: 98vw !important;
        min-height: 60vh !important;
        max-height: 70vh !important;
        padding: 12px 4vw 8px 4vw !important;
        font-size: 15px;
        box-sizing: border-box;
        overflow-y: auto;
    }

    .modal-list {
        max-height: 70vh !important;
        margin-bottom: 7px;
    }

    .modal-footer {
        flex-direction: row;
        justify-content: space-between;
    }

    .modal-custom-add-btn {
        font-size: 13px;
        padding: 6px 10px;
    }

    .modal-close {
        font-size: 15px;
        margin: 0;
        padding: 6px 10px;
    }

    .preset-modal-container {
        min-width: 90vw !important;
        max-width: 98vw !important;
        width: 98vw !important;
    }

    .preset-modal-input {
        font-size: 15px;
        padding: 6px 10px;
    }

    .preset-modal-item-list {
        max-height: 30vh !important;
    }

    .preset-modal-btn-group {
        flex-direction: column;
        gap: 6px;
    }
}
</style>