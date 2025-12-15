<script setup>
import UserNavbar from './UserNavbar.vue'
import UserFooter from './UserFooter.vue'

defineProps({
  product: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  cartCount: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <div class="detail-container">
    <UserNavbar :user="user" :cartCount="cartCount" @logout="$emit('logout')" @toggleCart="$emit('toggleCart')" />
    
    <div class="content-wrapper">
      <button class="back-btn" @click="$emit('back')">← Back to Products</button>
      
      <div class="product-detail-card">
        <div class="image-section">
          <img v-if="product.imagen" :src="product.imagen" :alt="product.nombre" />
          <div v-else class="placeholder">📦</div>
        </div>
        
        <div class="info-section">
          <h1>{{ product.nombre }}</h1>
          <div class="price">${{ product.precio }}</div>
          <p class="description">{{ product.descripcion }}</p>
          <div class="stock">Available Stock: {{ product.stock }}</div>
          
          <button class="add-cart-btn" @click="$emit('addToCart', product)">Add to Cart</button>
        </div>
      </div>
    </div>

    <UserFooter />
  </div>
</template>

<style scoped>
.detail-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding-top: 80px;
  box-sizing: border-box;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

.back-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: #ccc;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.product-detail-card {
  display: flex;
  gap: 3rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.image-section {
  flex: 1;
  max-width: 400px;
}

.image-section img {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.placeholder {
  width: 100%;
  height: 300px;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  border-radius: 10px;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #00f260 0%, #0575e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #00f260;
  margin-bottom: 2rem;
}

.description {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.stock {
  color: #888;
  margin-bottom: 2rem;
}

.add-cart-btn {
  background: #00f260;
  color: #1a1a2e;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  align-self: flex-start;
  transition: transform 0.2s;
}

.add-cart-btn:hover {
  transform: translateY(-2px);
  background: #00e05a;
}

@media (max-width: 768px) {
  .product-detail-card {
    flex-direction: column;
  }
}
</style>
