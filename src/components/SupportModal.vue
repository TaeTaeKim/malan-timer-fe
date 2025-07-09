<script setup>
const props = defineProps({
    isOpen: Boolean
})

</script>

<template>
    <div class="support-modal" v-if="isOpen">

        <img src="/support-qr.jpg" alt="support-qr" class="support-qr-img">

        <div class="support-msg">
            <h2>소중한 후원 감사합니다</h2>
            <p>이 사이트는 후원으로 유지됩니다.<br>전붕이 개발자 후원해주셔도 좋습니다! <br>[등촌유랑단]</p>
            <h4>토스뱅크 1000-2831-3830 [ㄱㅌㅇ]</h4>
        </div>
    </div>
</template>

<style scoped>
.support-modal {
    top: 55px;
    left: -130px;
    width: 300px;
    padding: 20px;
    display: flex;
    background: #404552;
    box-shadow: black 0 0 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 13px;
    position: absolute;
    z-index: 100;
}

.support-msg {
    text-align: center;
}

.support-msg>p {
    color: lightgray;
}

.support-msg>h4 {
    color: #f57234;
    margin-bottom: 0px;
}

.support-qr-img {
    height: 130px;
}
</style>