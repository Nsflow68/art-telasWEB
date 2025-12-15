<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Home from './components/Home.vue'
import AdminPanel from './components/AdminPanel.vue'
import ProductDetail from './components/ProductDetail.vue'
import CartSidebar from './components/CartSidebar.vue'

const currentView = ref('login')
const currentUser = ref(null)
const selectedProduct = ref(null)
const cart = ref([])
const isCartOpen = ref(false)

const handleLoginSuccess = (user) => {
  currentUser.value = user
  if (user.role === 'admin') {
    currentView.value = 'admin'
  } else {
    currentView.value = 'home'
  }
}

const handleLogout = () => {
  currentUser.value = null
  selectedProduct.value = null
  cart.value = []
  currentView.value = 'login'
}

const handleProductSelection = (product) => {
  selectedProduct.value = product
  currentView.value = 'product-detail'
}

const handleBackToHome = () => {
  selectedProduct.value = null
  currentView.value = 'home'
}

const addToCart = (product) => {
  const existing = cart.value.find(item => item.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({ ...product, quantity: 1 })
  }
  isCartOpen.value = true
}

const increaseQuantity = (item) => {
  const cartItem = cart.value.find(i => i.id === item.id)
  if (cartItem) {
    cartItem.quantity++
  }
}

const decreaseQuantity = (item) => {
  const cartItem = cart.value.find(i => i.id === item.id)
  if (cartItem && cartItem.quantity > 1) {
    cartItem.quantity--
  }
}

const removeFromCart = (id) => {
  cart.value = cart.value.filter(item => item.id !== id)
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}
</script>

<template>
  <div class="app-wrapper">
    <nav class="nav-bar" v-if="currentView !== 'home' && currentView !== 'admin' && currentView !== 'product-detail'">
      <button @click="currentView = 'login'" :class="{ active: currentView === 'login' }">Login</button>
      <button @click="currentView = 'register'" :class="{ active: currentView === 'register' }">Registro</button>
    </nav>
    
    <CartSidebar 
      :isOpen="isCartOpen" 
      :cart="cart" 
      @close="isCartOpen = false" 
      @remove="removeFromCart"
      @increase="increaseQuantity"
      @decrease="decreaseQuantity"
    />

    <Login v-if="currentView === 'login'" @loginSuccess="handleLoginSuccess" />
    <Register v-if="currentView === 'register'" />
    <Home 
      v-if="currentView === 'home'" 
      :user="currentUser" 
      :cartCount="cart.length"
      @logout="handleLogout" 
      @selectProduct="handleProductSelection"
      @toggleCart="toggleCart"
    />
    <AdminPanel 
      v-if="currentView === 'admin'" 
      :user="currentUser" 
      @logout="handleLogout" 
    />
    <ProductDetail 
      v-if="currentView === 'product-detail'"
      :product="selectedProduct"
      :user="currentUser"
      :cartCount="cart.length"
      @logout="handleLogout"
      @back="handleBackToHome"
      @addToCart="addToCart"
      @toggleCart="toggleCart"
    />
  </div>
</template>

<style scoped>
.nav-bar {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  background: rgba(0,0,0,0.5);
  padding: 0.5rem;
  border-radius: 50px;
  backdrop-filter: blur(5px);
}

button {
  background: transparent;
  border: none;
  color: #aaa;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: color 0.3s;
}

button.active {
  color: #00f260;
}

button:hover {
  color: white;
}
</style>

