import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useRunsStore = defineStore('runs', () => {
  const runs = ref([]);
  const maxSlots = ref(5);

  async function fetchRuns() {
    const { data } = await axios.get('/api/runs');
    runs.value = data.runs;
    maxSlots.value = data.maxSlots;
  }

  async function createRun(name) {
    const { data } = await axios.post('/api/runs', { name });
    await fetchRuns();
    return data.run;
  }

  async function deleteRun(id) {
    await axios.delete(`/api/runs/${id}`);
    await fetchRuns();
  }

  return { runs, maxSlots, fetchRuns, createRun, deleteRun };
});
