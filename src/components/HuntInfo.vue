<script setup lang="ts">
import { ref } from 'vue';
const imageUrl = ref<string | null>(null)

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
</script>

<template>
    <div class="image-dropbox" @drop="onDrop" @dragover.prevent @paste="onPaste" tabindex="0">
        <input type="file" accept="image/*" @change="onFileChange" />
        <p>이미지 드래그 또는 영역 클릭 후 붙여넣기(Ctrl+V).</p>
    </div>
    <div class="hunt-info">
        <div class="level-exp-meso">
            <div class="level info-element">
                <span class="level-title">LV.</span>
                <input type="number" class="level-input hunt-input" id="level">
            </div>
            <div class="exp info-element">
                <span class="exp-title">EXP.</span>
                <input type="number" class="exp-input hunt-input" id="exp">
            </div>
            <div class="meso info-element">
                <img src="../assets/meso.png" alt="meso-icon" class="meso-icon" style="width: 22px; height: 22px;">
                <input type="number" class="meso-input hunt-input" id="meso">
            </div>
        </div>
    </div>

</template>
<style scoped>
.hunt-info {
    padding: 10px;
}

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
    width: 15%;
}

.exp,
.meso {
    width: 40%;
}


/* level, exp, meso input */
.level-input {
    margin-left: 5px;
    width: 80%;
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
</style>