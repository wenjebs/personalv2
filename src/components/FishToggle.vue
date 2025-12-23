<script setup lang="ts">
import { ref } from 'vue'
import FloatingFish from './FloatingFish.vue'

const fishEnabled = ref(true)

function toggleFish() {
  fishEnabled.value = !fishEnabled.value
}
</script>

<template>
  <div>
    <FloatingFish :enabled="fishEnabled" />
    <button
      class="fish-toggle-btn"
      :aria-label="fishEnabled ? 'Disable fish' : 'Enable fish'"
      :title="fishEnabled ? 'Disable fish' : 'Enable fish'"
      @click="toggleFish"
    >
      {{ fishEnabled ? '🐟' : '🚫' }}
    </button>
  </div>
</template>

<style scoped>
.fish-toggle-btn {
  position: fixed;
  top: 6rem;
  right: 1.5rem;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.fish-toggle-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.fish-toggle-btn:active {
  transform: scale(0.95);
}

@media (prefers-color-scheme: dark) {
  .fish-toggle-btn {
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .fish-toggle-btn:hover {
    background: rgba(0, 0, 0, 0.8);
  }
}
</style>
