<script setup lang="ts">
import { computed, ref } from 'vue';
import { useConsumeStore } from '../stores/consume';
import { useHuntStore } from '../stores/hunt';
import { useImageStore } from '../stores/image';
import { requiredExp } from '../data/requiredExp';

const imageUrl = ref<string | null>(null)

// props
const props = defineProps<{ type: 'start' | 'end' }>();

// store
const huntStore = useHuntStore()
const consumeStore = useConsumeStore()
const imageStore = useImageStore();


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
    let newData;
    if (props.type === 'start') {
        newData = { ...huntStore.huntStart, [field]: value };
        if (newData.level === 0) {
            // If level is 0, do not calculate percent or exp
            if (field === 'exp') newData.percent = 0;
            if (field === 'percent') newData.exp = 0;
        } else if (field === 'exp' || field === 'level') {
            const reqExp = requiredExp[newData.level] || 1;
            newData.percent = Math.floor((newData.exp / reqExp) * 10000) / 100; // 2 decimal places
        } else if (field === 'percent') {
            const reqExp = requiredExp[newData.level] || 1;
            newData.exp = Math.floor((newData.percent / 100) * reqExp);
        }
        huntStore.setHuntStart(newData);
    } else {
        newData = { ...huntStore.huntEnd, [field]: value };
        if (newData.level === 0) {
            if (field === 'exp') newData.percent = 0;
            if (field === 'percent') newData.exp = 0;
        } else if (field === 'exp' || field === 'level') {
            const reqExp = requiredExp[newData.level] || 1;
            newData.percent = Math.floor((newData.exp / reqExp) * 10000) / 100;
        } else if (field === 'percent') {
            const reqExp = requiredExp[newData.level] || 1;
            newData.exp = Math.floor((newData.percent / 100) * reqExp);
        }
        huntStore.setHuntEnd(newData);
    }
}

function handleExtracted({ level, exp, meso }: { level: number, exp: number, meso: number }) {
    const reqExp = requiredExp[level] || 1;
    const percent = level === 0 ? 0 : Math.floor((exp / reqExp) * 10000) / 100; // 2 decimal places

    if (props.type === 'start') {
        huntStore.setHuntStart({
            ...huntStore.huntStart,
            level: !isNaN(level) ? level : huntStore.huntStart.level,
            exp: !isNaN(exp) ? exp : huntStore.huntStart.exp,
            meso: !isNaN(meso) ? meso : huntStore.huntStart.meso,
            percent: !isNaN(percent) ? percent : huntStore.huntStart.percent,
        });
    } else {
        huntStore.setHuntEnd({
            ...huntStore.huntEnd,
            level: !isNaN(level) ? level : huntStore.huntEnd.level,
            exp: !isNaN(exp) ? exp : huntStore.huntEnd.exp,
            meso: !isNaN(meso) ? meso : huntStore.huntEnd.meso,
            percent: !isNaN(percent) ? percent : huntStore.huntEnd.percent,
        });
    }
}

function onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (files && files[0]) {
        imageUrl.value = URL.createObjectURL(files[0])
        imageStore.processImage(files[0], handleExtracted);
    }
}

function onDrop(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        imageUrl.value = URL.createObjectURL(event.dataTransfer.files[0])
        imageStore.processImage(event.dataTransfer.files[0], handleExtracted);
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
                    imageStore.processImage(file, handleExtracted);
                }
            }
        }
    }
}
function deleteSelectedItem(id: number) {
    consumeStore.deleteSelectedItem(id)
}

const formattedMeso = computed(() => {
    const meso = huntInfo.value.meso || 0;
    if (meso >= 100000000) {
        const eok = Math.floor(meso / 100000000);
        const man = Math.floor((meso % 100000000) / 10000);
        if (man > 0) {
            return `${eok.toLocaleString()}억 ${man.toLocaleString()}만 메소`;
        } else {
            return `${eok.toLocaleString()}억 메소`;
        }
    } else {
        const man = Math.floor(meso / 10000);
        return man > 0 ? `${man.toLocaleString()}만 메소` : '';
    }
});
</script>

<template>
    <div class="image-dropbox" @drop="onDrop" @dragover.prevent @paste="onPaste" tabindex="0">
        <div v-if="!imageStore.loading">
            <input type="file" accept="image/*" @change="onFileChange" />
            <p class="info-desc" style="color: beige;">메랜 게임 스샷을 넣으면 레벨, 경험치, 메소가 자동입력됩니다.</p>
            <p class="info-desc">드래그, 영역 클릭 후 붙여넣기(Ctrl+V)</p>
        </div>
        <div v-if="imageStore.loading" class="loading-text">추출중..</div>
    </div>
    <div class="hunt-info">
        <div class="level-exp">
            <div class="level info-element">
                <span class="level-title">LV.</span>
                <input type="number" class="level-input hunt-input" id="level" :value="huntInfo.level"
                    @input="updateHuntInfo('level', +(($event.target as HTMLInputElement)?.value || 0))">
            </div>
            <div class="exp info-element">
                <span class="exp-title">EXP.</span>
                <input type="number" class="exp-input hunt-input" id="exp" :value="huntInfo.exp"
                    @input="updateHuntInfo('exp', +(($event.target as HTMLInputElement)?.value || 0))">
                <input type="number" class="exp-percent-input" :value="huntInfo.percent"
                    @input="updateHuntInfo('percent', +(($event.target as HTMLInputElement)?.value || 0))">
                <span style="font-weight: 800;">%</span>
                </input>
            </div>
        </div>
        <div class="meso info-element">
            <img src="../assets/meso.png" alt="meso-icon" class="meso-icon" style="width: 22px; height: 22px;">
            <input type="number" class="meso-input hunt-input" id="meso" :value="huntInfo.meso"
                @input="updateHuntInfo('meso', +(($event.target as HTMLInputElement)?.value || 0))">
            <span class="meso-korean">{{ formattedMeso }}</span>
        </div>
    </div>

    <div class="hunt-consume">
        <h3>소비 내역</h3>
        <div v-for="item in selectedItems" :key="item.id" class="hunt-consume-item">
            <img :src="`https://maplestory.io/api/GMS/255/item/${item.id}/icon`" style="margin-right: 5px; width: 30px;"
                alt="아이템이미지">
            <p class="item-name">{{ item.name }}</p>
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
    border: 1px dashed #aaa;
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

.level-exp {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.info-element {
    display: flex;
    align-items: center;
}

.level {
    width: 20%;
}

.exp {
    width: 75%;
}

.meso {
    width: 100%;
    display: flex;
    align-items: center;
}

.meso-input {
    width: 50%;
}

.meso-korean {
    width: 100%;
    text-align: right;
    font-weight: 700;
    color: #eab308;
    padding-left: 8px;
}


/* level, exp, meso input */

.level-input,
.exp-input,
.meso-input {
    margin-left: 5px;
    font-size: 15px;
    width: 100%;
    height: 25px;
    font-weight: bold;
}

.exp-percent-input {
    margin-left: 5px;
    font-size: 15px;
    width: 40%;
    height: 25px;
    font-weight: bold;

}

/* level exp title font */
.level-title,
.exp-title {
    font-size: 20px;
    font-weight: 900;
}

.hunt-consume-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 35px;
}

.loading-text {
    color: #2563EB;
    font-weight: 900;
    text-align: center;
    font-size: 2.2rem;
    margin-top: 5px;
}

.info-desc {
    font-size: 1rem;
    margin: 0;
}

.item-name {
    width: 30%;
}

@media (max-width: 600px) {
    .info-desc {
        font-size: 0.85rem;
    }

    .image-dropbox {
        height: auto;
    }

    .hunt-consume>h3 {
        font-size: 1rem;
    }

    .item-name {
        width: 45%;
        font-size: .95rem;
    }

    .level-input,
    .exp-input,
    .meso-input,
    .exp-percent-input {
        font-size: .75rem;
    }
}
</style>