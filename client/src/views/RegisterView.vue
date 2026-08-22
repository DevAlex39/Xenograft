<template>
  <div class="xg-auth-page">
    <div class="xg-card xg-auth-card">
      <h2>Inscription</h2>
      <form @submit.prevent="handleSubmit">
        <input v-model="username" class="xg-input" placeholder="Nom d'utilisateur" required />
        <input v-model="email" type="email" class="xg-input" placeholder="Email" required />
        <input v-model="password" type="password" class="xg-input" placeholder="Mot de passe (6 caractères min)" required />
        <p v-if="error" class="xg-error">{{ error }}</p>
        <button class="xg-btn" type="submit" :disabled="loading">
          {{ loading ? '...' : 'Créer mon compte' }}
        </button>
      </form>
      <router-link to="/login">Déjà un compte ? Se connecter</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const username = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.register({ username: username.value, email: email.value, password: password.value });
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur d\'inscription';
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
