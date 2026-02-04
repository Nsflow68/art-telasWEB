```vue
<script setup>
import { ref, onMounted, computed } from 'vue'
import UserNavbar from './UserNavbar.vue'
import UserFooter from './UserFooter.vue'
import DeliveriesCarousel from './DeliveriesCarousel.vue'

const props = defineProps({
  user: {
    type: Object,
    required: false
  },
  cartCount: {
    type: Number,
    default: 0
  },
  searchQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['selectProduct', 'addToCart'])

const products = ref([])
const loading = ref(true)
const error = ref(null)

const filteredProducts = computed(() => {
  if (!props.searchQuery) return products.value;
  const query = props.searchQuery.toLowerCase();
  return products.value.filter(product => 
    product.nombre.toLowerCase().includes(query) || 
    product.descripcion.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  try {
    loading.value = true
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/products`);
    if (response.ok) {
      products.value = await response.json();
    }
  } catch (e) {
    console.error('Failed to fetch products', e);
  } finally {
    loading.value = false;
  }
})
</script>

<template>
  <div class="home-container">
    <!-- Navbar handled by App.vue now -->
    
    <div class="content-wrapper">
      <h1>Welcome back, <span class="highlight">{{ user ? user.nombre : 'Guest' }}</span>!</h1>
      <p class="subtitle">Here are the products currently in our catalog.</p>
      
      <div class="carousel-section">
        <h2 class="section-title">Nuestras Entregas</h2>
        <DeliveriesCarousel />
      </div>
      
      <div v-if="loading" class="loading">Loading products...</div>
      
      <div v-else class="products-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card" @click="$emit('selectProduct', product)">
          <div class="product-image" v-if="product.imagen">
            <img :src="product.imagen" :alt="product.nombre" />
          </div>
          <div class="product-placeholder" v-else>
             📦
          </div>
          <div class="product-info">
            <h3>{{ product.nombre }}</h3>
            <p class="desc">{{ product.descripcion }}</p>
            <div class="price">${{ product.precio }}</div>
            <div class="stock">Stock: {{ product.stock }}</div>
            <button class="add-btn" @click.stop="$emit('addToCart', product)">
              Agregar al Carrito 🛒
            </button>
          </div>
        </div>
        
        <div v-if="products.length === 0" class="no-products">
          <p>No products found in the database.</p>
        </div>
      </div>

      <div class="dashboard-grid" style="margin-top: 3rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
        <div class="card">
          <div class="icon">🎨</div>
          <h3>My Projects</h3>
          <p>View and manage your recent work</p>
        </div>
        
        <div class="card">
          <div class="icon">✨</div>
          <h3>New Creation</h3>
          <p>Start a new design project</p>
        </div>
        
        <div class="card">
          <div class="icon">⚙️</div>
          <h3>Settings</h3>
          <p>Update your profile and preferences</p>
        </div>
      </div>
    </div>
    
    <UserFooter />
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding-top: 80px; /* Space for fixed navbar */
  box-sizing: border-box;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.highlight {
  background: linear-gradient(90deg, #00f260 0%, #0575e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: #a0a0a0;
  margin-bottom: 3rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.1);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h3 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}


.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.product-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
}

.product-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: rgba(0,0,0,0.2);
}

.product-info {
  padding: 1.5rem;
}

.desc {
  font-size: 0.9rem;
  color: #ccc;
  margin: 0.5rem 0;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00f260;
  margin-top: 1rem;
}

.stock {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.5rem;
}

.add-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.6rem;
  border: none;
  background: linear-gradient(90deg, #00f260 0%, #0575e6 100%);
  color: white;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s, transform 0.2s;
}

.add-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.loading, .no-products {
  text-align: center;
  font-size: 1.2rem;
  color: #a0a0a0;
  padding: 2rem;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
  text-align: center;
}

</style>
