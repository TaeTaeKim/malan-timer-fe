<template>
    <div class="consume-section">
        <h2 class="consume-title">소비 아이템 설정</h2>
        <div class="consume-list">

        </div>
        <div class="consume-section-botton">
            <button class="consume-add">추가</button>
            <button class="consume-save">프리셋 저장</button>
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
</style>