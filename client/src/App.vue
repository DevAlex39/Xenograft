<template>
  <div class="xg-app">
    <header class="xg-header" v-if="auth.isLoggedIn">
      <h1>XENOGRAFT</h1>
      <div class="xg-header-right">
        <span class="xg-username">{{ auth.user?.username }}</span>
        <button class="xg-btn" @click="handleLogout">Déconnexion</button>
      </div>
    </header>
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const auth = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await auth.init();
});

function handleLogout() {
  auth.logout();
  router.push('/login');
}
</script>

<style>
.xg-app {
  min-height: 100vh;
}
.xg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--xg-border);
}
.xg-header h1 {
  margin: 0;
  font-size: 1.4rem;
  letter-spacing: 0.1em;
}
.xg-header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.xg-username {
  color: var(--xg-text-dim);
}
</style>
