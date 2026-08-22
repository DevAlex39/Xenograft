<template>
  <div class="xg-runs-page">
    <h2>Mes parties</h2>
    <p class="xg-hint">{{ runs.runs.length }} / {{ runs.maxSlots }} emplacements utilisés</p>

    <div class="xg-runs-grid">
      <div v-for="run in runs.runs" :key="run.id" class="xg-card xg-run-card">
        <h3>{{ run.name }}</h3>
        <p class="xg-hint">Monde : {{ run.world }} · Statut : {{ run.status }}</p>
        <div class="xg-run-actions">
          <button class="xg-btn">Reprendre</button>
          <button class="xg-btn xg-btn-danger" @click="handleDelete(run.id)">Abandonner</button>
        </div>
      </div>

      <div v-if="runs.runs.length < runs.maxSlots" class="xg-card xg-run-card xg-run-new">
        <input v-model="newRunName" class="xg-input" placeholder="Nom de la run" />
        <button class="xg-btn" @click="handleCreate" :disabled="creating">
          {{ creating ? '...' : '+ Nouvelle run' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRunsStore } from '@/stores/runs.js';

const runs = useRunsStore();
const newRunName = ref('');
const creating = ref(false);

onMounted(() => runs.fetchRuns());

async function handleCreate() {
  creating.value = true;
  try {
    await runs.createRun(newRunName.value || undefined);
    newRunName.value = '';
  } finally {
    creating.value = false;
  }
}

async function handleDelete(id) {
  await runs.deleteRun(id);
}
</script>

<style scoped>
.xg-runs-page {
  padding: 2rem;
  max-width: 960px;
  margin: 0 auto;
}
.xg-hint {
  color: var(--xg-text-dim);
  font-size: 0.85rem;
}
.xg-runs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}
.xg-run-card h3 {
  margin: 0 0 0.4rem;
}
.xg-run-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
}
.xg-btn-danger {
  background: rgba(224, 82, 82, 0.15);
  border-color: rgba(224, 82, 82, 0.4);
}
.xg-btn-danger:hover {
  background: rgba(224, 82, 82, 0.3);
}
.xg-run-new {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  justify-content: center;
  border-style: dashed;
}
</style>
