<script setup lang="ts">
import MasonryWall from '@yeger/vue-masonry-wall'
import { ref } from 'vue'

interface CarouselImage {
  src: string
  alt: string
}

const props = withDefaults(defineProps<{
  images: CarouselImage[]
  columnWidth?: number
  gap?: number
  showCaptions?: boolean
}>(), {
  columnWidth: 300,
  gap: 16,
  showCaptions: true,
})

// Modal state
const isModalOpen = ref(false)
const selectedImage = ref<CarouselImage | null>(null)

// Handle image click
function handleImageClick(item: CarouselImage) {
  selectedImage.value = item
  isModalOpen.value = true
}

// Close modal
function closeModal() {
  isModalOpen.value = false
  selectedImage.value = null
}
</script>

<template>
  <div class="carousel-container">
    <MasonryWall
      :items="props.images"
      :column-width="props.columnWidth"
      :gap="props.gap"
      :ssr-columns="1"
    >
      <template #default="{ item, index }: { item: CarouselImage, index: number }">
        <div class="carousel-slide" @click="handleImageClick(item)">
          <img :src="item.src" :alt="item.alt || `Image ${index}`" class="carousel-image">
          <p v-if="props.showCaptions && item.alt" class="carousel-caption text-main">
            {{ item.alt }}
          </p>
        </div>
      </template>
    </MasonryWall>

    <!-- Full-screen modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="close-button" @click="closeModal">
            &times;
          </button>
          <img
            v-if="selectedImage"
            :src="selectedImage.src"
            :alt="selectedImage.alt"
            class="modal-image"
          >
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  margin: 0 auto;
}

.carousel-slide {
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0.5rem;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.carousel-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.carousel-slide:hover {
  transform: scale(1.02);
  opacity: 0.9;
}

.carousel-caption {
  margin: 0;
  padding: 0;
  font-size: 0.75rem;
  line-height: 1.2;
  text-align: center;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.close-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 36px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.modal-image {
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
}
</style>
