<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  slidesToShow: {
    type: Number,
    default: 3,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  autoplaySpeed: {
    type: Number,
    default: 5000,
  },
  gap: {
    type: Number,
    default: 16,
  },
})

const currentIndex = ref(0)
const trackRef = ref(null)
let autoplayInterval = null

// Responsive slides to show based on viewport width
const responsiveSlidesToShow = ref(props.slidesToShow)

// Duplicate images for infinite effect
const extendedImages = computed(() => {
  // Clone images to create the illusion of infinity
  return [...props.images, ...props.images.slice(0, responsiveSlidesToShow.value)]
})

// Width of each slide based on number to show and gap
const slideWidth = computed(() => {
  const gapTotal = props.gap * (responsiveSlidesToShow.value - 1)
  return `calc((100% / ${responsiveSlidesToShow.value}) - ${gapTotal / responsiveSlidesToShow.value}px)`
})

// Transform value for track
const trackTransform = computed(() => {
  const slidePercentage = 100 / responsiveSlidesToShow.value
  return `translateX(-${currentIndex.value * slidePercentage}%)`
})

function next() {
  // If we're reaching the end of original images, reset to beginning smoothly
  if (currentIndex.value >= props.images.length) {
    // First jump instantly to the beginning (duplicate)
    currentIndex.value = 0
    setTimeout(() => {
      // Then animate to next
      currentIndex.value = 1
    }, 50)
  }
  else {
    currentIndex.value++
  }
}

function prev() {
  if (currentIndex.value <= 0) {
    // Jump to the end
    currentIndex.value = props.images.length - 1
  }
  else {
    currentIndex.value--
  }
}

function goToSlide(index) {
  currentIndex.value = index
}

function updateSlidesToShow() {
  if (window.innerWidth < 640) {
    responsiveSlidesToShow.value = 1
  }
  else if (window.innerWidth < 1024) {
    responsiveSlidesToShow.value = Math.min(2, props.slidesToShow)
  }
  else {
    responsiveSlidesToShow.value = props.slidesToShow
  }
}

function startAutoplay() {
  if (props.autoplay) {
    autoplayInterval = setInterval(() => {
      next()
    }, props.autoplaySpeed)
  }
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
}

onMounted(() => {
  updateSlidesToShow()
  window.addEventListener('resize', updateSlidesToShow)
  startAutoplay()

  return () => {
    window.removeEventListener('resize', updateSlidesToShow)
    stopAutoplay()
  }
})

// Reset autoplay when props change
watch(() => props.autoplay, (newVal) => {
  if (newVal) {
    startAutoplay()
  }
  else {
    stopAutoplay()
  }
})
</script>

<template>
  <div
    class="carousel"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div class="carousel-track-container">
      <div
        ref="trackRef"
        class="carousel-track"
        :style="{
          transform: trackTransform,
          gap: `${gap}px`,
        }"
      >
        <div
          v-for="(image, index) in extendedImages"
          :key="`slide-${index}`"
          class="carousel-slide"
          :style="{ width: slideWidth }"
        >
          <img :src="image.src" :alt="image.alt" class="carousel-image">
          <p class="carousel-caption text-main">
            {{ image.alt }}
          </p>
        </div>
      </div>
    </div>

    <button class="carousel-button prev" aria-label="Previous" @click="prev">
      <span class="i-carbon-chevron-left" />
    </button>

    <button class="carousel-button next" aria-label="Next" @click="next">
      <span class="i-carbon-chevron-right" />
    </button>

    <div class="carousel-dots">
      <button
        v-for="index in props.images.length"
        :key="`dot-${index - 1}`"
        class="carousel-dot"
        :class="{ active: currentIndex % props.images.length === (index - 1) }"
        :aria-label="`Go to slide ${index}`"
        @click="goToSlide(index - 1)"
      />
    </div>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 120%;
  max-width: 1400px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 0.5rem;
}

.carousel-track-container {
  overflow: hidden;
  padding: 1rem 0;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  flex: 0 0 auto;
  padding: 0.25rem;
  box-sizing: border-box;
}

.carousel-image {
  width: 100%;
  object-fit: fit;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}
.carousel-caption {
  text-align: center;
  margin-top: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.carousel-slide:hover .carousel-image {
  transform: scale(1.04);
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
  z-index: 10;
}

.carousel-button:hover {
  background: rgba(255, 255, 255, 1);
}

.carousel-button.prev {
  left: 10px;
}

.carousel-button.next {
  right: 10px;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  gap: 8px;
  padding: 0.5rem 0;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  transition:
    background 0.3s,
    transform 0.2s;
}

.carousel-dot:hover {
  transform: scale(1.2);
}

.carousel-dot.active {
  background: rgba(0, 0, 0, 0.6);
}

@media (max-width: 640px) {
  .carousel-button {
    width: 32px;
    height: 32px;
  }
}
</style>
