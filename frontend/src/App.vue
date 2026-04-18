<script setup>
import { ref } from 'vue'
import HabitForm from './components/HabitForm.vue'
import HabitHistory from './components/HabitHistory.vue'

// A key to force HabitHistory to re-render when a new habit is added
const historyKey = ref(0)

const handleHabitAdded = () => {
  historyKey.value += 1
}
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>Growth & Discipline Tracker</h1>
      <p>AI-Powered Personal Development</p>
    </header>
    
    <main class="main-content">
      <div class="column">
        <HabitForm @habit-added="handleHabitAdded" />
      </div>
      <div class="column">
        <HabitHistory :key="historyKey" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #60a5fa, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .main-content {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
