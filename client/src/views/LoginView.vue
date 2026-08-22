<template>
  <div class="xg-auth-page">
    <div class="xg-card xg-auth-card">
      <h2>Connexion</h2>
      <form @submit.prevent="handleSubmit">
        <input v-model="login" class="xg-input" placeholder="Nom d'utilisateur ou email" required />
        <input v-model="password" type="password" class="xg-input" placeholder="Mot de passe" required />
        <p v-if="error" class="xg-error">{{ error }}</p>
        <button class="xg-btn" type="submit" :disabled="loading">
          {{ loading ? '...' : 'Se connecter' }}
        </button>
      </form>
      <router-link to="/register">Pas encore de compte ? S'inscrire</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const login = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(login.value, password.value);
    router.push(route.query.redirect || '/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur de connexion';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.xg-auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}
.xg-auth-card {
  width: 100%;
  max-width: 360px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 1rem 0;
}
a {
  color: var(--xg-gold-light);
  font-size: 0.85rem;
}
</style>
