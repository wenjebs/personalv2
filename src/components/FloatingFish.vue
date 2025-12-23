<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  enabled: boolean
}>()

interface Fish {
  x: number
  y: number
  rotation: number
  speedX: number
  speedY: number
  size: number
  emoji: string
}

interface Bubble {
  x: number
  y: number
  size: number
  opacity: number
  life: number
}

const fishEmojis = ['🐟', '🐠', '🐡', '🦑', '🐋']

const fishes = ref<Fish[]>([])
const bubbles = ref<Bubble[]>([])
let animationFrameId: number
let mouseX = -1000
let mouseY = -1000
let isMouseOnScreen = false
let frameCount = 0

function createFish(): Fish {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    rotation: Math.random() * 360,
    speedX: (Math.random() - 0.5) * 2,
    speedY: (Math.random() - 0.5) * 2,
    size: 1.5 + Math.random() * 1,
    emoji: fishEmojis[Math.floor(Math.random() * fishEmojis.length)],
  }
}

function handleMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
  isMouseOnScreen = true
}

function handleMouseLeave() {
  isMouseOnScreen = false
}

function animate() {
  frameCount++

  fishes.value.forEach((fish) => {
    if (isMouseOnScreen) {
      // Follow mouse with attraction
      const dx = mouseX - fish.x
      const dy = mouseY - fish.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Attraction strength (higher = stronger pull)
      const attraction = 0.02

      if (distance > 50) { // Don't get too close
        fish.speedX += (dx / distance) * attraction
        fish.speedY += (dy / distance) * attraction
      }

      // Limit speed
      const maxSpeed = 3
      const currentSpeed = Math.sqrt(fish.speedX ** 2 + fish.speedY ** 2)
      if (currentSpeed > maxSpeed) {
        fish.speedX = (fish.speedX / currentSpeed) * maxSpeed
        fish.speedY = (fish.speedY / currentSpeed) * maxSpeed
      }
    }
    else {
      // Random floating behavior when mouse not on screen
      // Add slight random drift
      fish.speedX += (Math.random() - 0.5) * 0.1
      fish.speedY += (Math.random() - 0.5) * 0.1

      // Limit speed
      const maxSpeed = 2
      const currentSpeed = Math.sqrt(fish.speedX ** 2 + fish.speedY ** 2)
      if (currentSpeed > maxSpeed) {
        fish.speedX = (fish.speedX / currentSpeed) * maxSpeed
        fish.speedY = (fish.speedY / currentSpeed) * maxSpeed
      }
    }

    // Update position
    fish.x += fish.speedX
    fish.y += fish.speedY

    // Create bubbles occasionally (every 10 frames, 20% chance)
    if (frameCount % 10 === 0 && Math.random() < 0.2) {
      bubbles.value.push({
        x: fish.x + (Math.random() - 0.5) * 20,
        y: fish.y + (Math.random() - 0.5) * 20,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.3,
        life: 1,
      })
    }

    // Bounce off edges
    if (fish.x < 0 || fish.x > window.innerWidth) {
      fish.speedX *= -1
      fish.x = Math.max(0, Math.min(window.innerWidth, fish.x))
    }
    if (fish.y < 0 || fish.y > window.innerHeight) {
      fish.speedY *= -1
      fish.y = Math.max(0, Math.min(window.innerHeight, fish.y))
    }

    // Update rotation to face movement direction (flipped 180 degrees)
    fish.rotation = Math.atan2(fish.speedY, fish.speedX) * (180 / Math.PI) + 180
  })

  // Update bubbles
  bubbles.value = bubbles.value.filter((bubble) => {
    bubble.y -= 0.5 // Float upward
    bubble.x += (Math.random() - 0.5) * 0.5 // Slight horizontal drift
    bubble.life -= 0.01
    bubble.opacity = bubble.life * 0.5
    return bubble.life > 0
  })

  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  // Create 10 fishes
  for (let i = 0; i < 5; i++) {
    fishes.value.push(createFish())
  }
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
  animate()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
  cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div v-if="props.enabled" class="fish-container">
    <div
      v-for="(bubble, index) in bubbles"
      :key="`bubble-${index}`"
      class="bubble"
      :style="{
        left: `${bubble.x}px`,
        top: `${bubble.y}px`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        opacity: bubble.opacity,
      }"
    />
    <div
      v-for="(fish, index) in fishes"
      :key="`fish-${index}`"
      class="floating-fish"
      :style="{
        left: `${fish.x}px`,
        top: `${fish.y}px`,
        transform: `translate(-50%, -50%) rotate(${fish.rotation}deg)`,
        fontSize: `${fish.size}rem`,
      }"
    >
      {{ fish.emoji }}
    </div>
  </div>
</template>

<style scoped>
.fish-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
}

.floating-fish {
  position: absolute;
  pointer-events: none;
  opacity: 0.6;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(173, 216, 230, 0.3));
  border: 1px solid rgba(255, 255, 255, 0.3);
  pointer-events: none;
  transform: translate(-50%, -50%);
}
</style>
