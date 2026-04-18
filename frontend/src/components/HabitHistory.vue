<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const habits = ref([])
const loading = ref(true)
const error = ref('')

const fetchHabits = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const res = await axios.get(`${API_URL}/api/habits`)
    habits.value = res.data
  } catch (err) {
    error.value = 'Failed to load history. Ensure backend is running and database is configured.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchHabits()
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<template>
  <div class="glass-panel history-container">
    <h2>History & Insights</h2>
    
    <div v-if="loading" class="loading">Loading history...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="habits.length === 0" class="empty">No habits logged yet. Start your journey!</div>
    
    <div v-else class="habit-list">
      <div v-for="habit in habits" :key="habit.id" class="habit-card">
        <div class="habit-header">
          <h3>{{ habit.title }}</h3>
          <span class="category-badge">{{ habit.category }}</span>
        </div>
        <p v-if="habit.description" class="habit-desc">{{ habit.description }}</p>
        <div class="habit-meta">
          <span class="date">{{ formatDate(habit.logged_at) }}</span>
        </div>
        
        <div class="ai-advice" v-if="habit.ai_advice">
          <div class="ai-header">
            <span class="ai-icon">✨</span> AI Advisor 
            <span class="sentiment" :class="habit.ai_sentiment?.toLowerCase() || 'neutral'">
              {{ habit.ai_sentiment || 'Neutral' }}
            </span>
          </div>
          <p>{{ habit.ai_advice }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.error {
  color: #fca5a5;
}

.habit-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.habit-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid var(--glass-border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: transform 0.2s;
}

.habit-card:hover {
  transform: translateY(-2px);
  background: rgba(15, 23, 42, 0.6);
}

.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.habit-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.category-badge {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.habit-desc {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.habit-meta {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.ai-advice {
  background: linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
  border-left: 3px solid var(--success-color);
  padding: 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #6ee7b7;
}

.ai-icon {
  font-size: 1.1rem;
}

.sentiment {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  background: rgba(255,255,255,0.1);
  margin-left: auto;
}

.sentiment.positive { color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.3); }
.sentiment.neutral { color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3); }
.sentiment.negative { color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }

.ai-advice p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-primary);
}
</style>
