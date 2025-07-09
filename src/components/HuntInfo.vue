<script setup lang="ts">
import { computed, ref } from 'vue';
import { useConsumeStore } from '../stores/consume';
import { useHuntStore } from '../stores/hunt';

const imageUrl = ref<string | null>(null)

// props
const props = defineProps<{ type: 'start' | 'end' }>();

// store
const huntStore = useHuntStore()
const consumeStore = useConsumeStore()


const selectedItems = computed(() => consumeStore.selectedItems)

const quantities = computed(() =>
    props.type === 'start' ? huntStore.startQuantities : huntStore.endQuantities
);

function updateQuantity(itemId: number, value: number) {
    if (props.type === 'start') {
        huntStore.setStartQuantity(itemId, value);
    } else {
        huntStore.setEndQuantity(itemId, value);
    }
}

const huntInfo = computed(() =>
    props.type === 'start' ? huntStore.huntStart : huntStore.huntEnd
);

function updateHuntInfo(field: keyof typeof huntStore.huntStart, value: number) {
    if (props.type === 'start') {
        huntStore.setHuntStart({ ...huntStore.huntStart, [field]: value });
    } else {
        huntStore.setHuntEnd({ ...huntStore.huntEnd, [field]: value });
    }
}

function onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (files && files[0]) {
        imageUrl.value = URL.createObjectURL(files[0])
    }
}

function onDrop(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        imageUrl.value = URL.createObjectURL(event.dataTransfer.files[0])
    }
}

function onPaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items
    if (items) {
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile()
                if (file) {
                    imageUrl.value = URL.createObjectURL(file)
                }
            }
        }
    }
}
function deleteSelectedItem(id: number) {
    consumeStore.deleteSelectedItem(id)
}
</script>

<template>
    <div class="image-dropbox" @drop="onDrop" @dragover.prevent @paste="onPaste" tabindex="0">
        <input type="file" accept="image/*" @change="onFileChange" />
        <p style="margin: 0;">메랜 게임 스샷을 넣으면 레벨, 경험치, 메소가 자동입력됩니다.</p>
        <p style="margin: 0;">드래그, 영역 클릭 후 붙여넣기(Ctrl+V)</p>
    </div>
    <div class="hunt-info">
        <div class="level-exp-meso">
            <div class="level info-element">
                <span class="level-title">LV.</span>
                <input type="number" class="level-input hunt-input" id="level" :value="huntInfo.level"
                    @input="updateHuntInfo('level', +(($event.target as HTMLInputElement)?.value || 0))">
            </div>
            <div class="exp info-element">
                <span class="exp-title">EXP.</span>
                <input type="number" class="exp-input hunt-input" id="exp" :value="huntInfo.exp"
                    @input="updateHuntInfo('exp', +(($event.target as HTMLInputElement)?.value || 0))">
            </div>
            <div class="meso info-element">
                <img src="../assets/meso.png" alt="meso-icon" class="meso-icon" style="width: 22px; height: 22px;">
                <input type="number" class="meso-input hunt-input" id="meso" :value="huntInfo.meso"
                    @input="updateHuntInfo('meso', +(($event.target as HTMLInputElement)?.value || 0))">
            </div>
        </div>
    </div>

    <div class="hunt-consume">
        <h3>소비 내역</h3>
        <div v-for="item in selectedItems" :key="item.id" class="hunt-consume-item">
            <img :src="`https://maplestory.io/api/GMS/255/item/${item.id}/icon`"
                style="margin-right: 5px; width: 30px;">
            <p style="width: 30%;">{{ item.name }}</p>
            <label style="margin-left: 3px; font-weight: 400; width: 30%;">
                개수:
                <input type="number" min="0" style="width: 50%;margin-left: 1px;" :value="quantities[item.id] || 0"
                    @input="updateQuantity(item.id, +(($event.target as HTMLInputElement)?.value || 0))">
            </label>
            <button @click="deleteSelectedItem(item.id)">×</button>
        </div>
    </div>

</template>
<style scoped>
.image-dropbox {
    display: flex;
    flex-direction: column;
    border: 2px dashed #aaa;
    padding: 10px;
    cursor: pointer;
    height: 80px;
    background: none;
    margin-bottom: 10px;
    border-radius: 8px;
}

.image-dropbox:focus {
    outline: 2px solid #2563EB;
}

.level-exp-meso {
    display: flex;
    justify-content: space-between;
}

.info-element {
    display: flex;
    align-items: center;
}

.level {
    width: 20%;
}

.exp,
.meso {
    width: 40%;
}


/* level, exp, meso input */
.level-input {
    margin-left: 5px;
    width: 100%;
    height: 20px;

}

.exp-input,
.meso-input {
    margin-left: 5px;
    width: 100%;
    height: 20px;
}

/* level exp title font */
.level-title,
.exp-title {
    font-weight: 900;
}

.hunt-consume-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 800;
    height: 35px;
}
</style>