<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['habit-added'])

const title = ref('')
const category = ref('Growth')
const description = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const categories = ['Growth', 'Discipline', 'Health', 'Learning', 'Work', 'Other']

const submitHabit = async () => {
  if (!title.value) {
    error.value = 'Title is required'
    return
  }
  
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    const res = await axios.post('http://localhost:3000/api/habits', {
      title: title.value,
      category: category.value,
      description: description.value
    })
    
    success.value = true
    title.value = ''
    description.value = ''
    emit('habit-added', res.data)
    
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to connect to the server. Is the backend running?'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="glass-panel habit-form">
    <h2>Log Activity</h2>
    <form @submit.prevent="submitHabit">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="title" class="form-control" placeholder="e.g., Read 20 pages" />
      </div>
      
      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="category" class="form-control">
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="description">Description (Optional)</label>
        <textarea id="description" v-model="description" class="form-control" rows="3" placeholder="Additional details..."></textarea>
      </div>
      
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div v-if="success" class="alert alert-success">Activity logged successfully!</div>
      
      <button type="submit" class="btn submit-btn" :disabled="loading">
        {{ loading ? 'Processing...' : 'Log & Get AI Advice' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.habit-form {
  position: sticky;
  top: 2rem;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.submit-btn {
  width: 100%;
  margin-top: 1rem;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert {
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.alert-error {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.alert-success {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
}
</style>
