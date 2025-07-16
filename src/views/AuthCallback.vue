<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

onMounted(() => {
    // Get accessToken from query param
    const accessToken = route.query.accessToken as string | undefined;
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        // Optionally, you can also update user state here
    }
    // Redirect to home or show a message
    setTimeout(() => {
        router.replace({ path: '/' });
    }, 1200);
});
</script>

<template>
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh;">
        <h2>로그인 중입니다.</h2>
        <p>곧 페이지로 연결해드릴게요! 잠시만 기다려주세요.</p>
    </div>
</template>