<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const images = ref([]);
const currentIndex = ref(0);
const loading = ref(true);
const intervalId = ref(null);

const fetchImages = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/carousel`);
    if (response.ok) {
      const data = await response.json();
      images.value = data.map(img => ({
        ...img,
        imageUrl: `${apiUrl}${img.imageUrl}`
      }));
    }
  } catch (e) {
    console.error('Failed to fetch carousel images', e);
  } finally {
    loading.value = false;
  }
};

const nextSlide = () => {
  if (images.value.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  }
};

const prevSlide = () => {
  if (images.value.length > 0) {
    currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
  }
};

const startAutoPlay = () => {
  intervalId.value = setInterval(nextSlide, 5000);
};

const stopAutoPlay = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
};

onMounted(async () => {
  await fetchImages();
  if (images.value.length > 0) {
    startAutoPlay();
  }
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<template>
  <div class="carousel-container" v-if="images.length > 0" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
    <div class="carousel-wrapper">
      <div class="carousel-slides" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="image in images" :key="image.id" class="carousel-slide">
          <img :src="image.imageUrl" :alt="image.title || 'Delivery'" />
          <div class="slide-caption" v-if="image.title">
            <h3>{{ image.title }}</h3>
          </div>
        </div>
      </div>
      
      <button class="nav-btn prev" @click="prevSlide">❮</button>
      <button class="nav-btn next" @click="nextSlide">❯</button>
      
      <div class="indicators">
        <span 
          v-for="(image, index) in images" 
          :key="index" 
          class="indicator" 
          :class="{ active: index === currentIndex }"
          @click="currentIndex = index"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  position: relative;
  aspect-ratio: 16/9;
  max-height: 500px;
}

.carousel-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-slides {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  position: relative;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 2rem 1rem 1rem;
  color: white;
  text-align: center;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  padding: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  transition: background 0.3s;
  z-index: 10;
}

.nav-btn:hover {
  background: rgba(0,0,0,0.8);
}

.prev { left: 0; }
.next { right: 0; }

.indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: background 0.3s;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .carousel-container {
    aspect-ratio: 4/3;
  }
}
</style>
