<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  cart: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'remove', 'checkout', 'increase', 'decrease'])

const total = computed(() => {
  return props.cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0)
})
</script>

<template>
  <div class="cart-sidebar-wrapper">
    <div class="backdrop" v-if="isOpen" @click="$emit('close')"></div>
    <div class="cart-sidebar" :class="{ open: isOpen }">
      <div class="cart-header">
        <h2>Your Cart ({{ cart.length }})</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="cart-items" v-if="cart.length > 0">
        <div v-for="item in cart" :key="item.id" class="cart-item">
          <div class="item-image">
             <img v-if="item.imagen" :src="item.imagen" :alt="item.nombre" />
             <div v-else class="placeholder">📦</div>
          </div>
          <div class="item-details">
            <h4>{{ item.nombre }}</h4>
            <p class="price">${{ item.precio }}</p>
            
            <div class="quantity-controls">
              <button class="qty-btn" @click="$emit('decrease', item)">-</button>
              <span class="qty">{{ item.quantity }}</span>
              <button class="qty-btn" @click="$emit('increase', item)">+</button>
            </div>
          </div>
          <button class="remove-btn" @click="$emit('remove', item.id)">🗑️</button>
        </div>
      </div>

      <div class="empty-cart" v-else>
        <p>Your cart is empty.</p>
      </div>

      <div class="cart-footer" v-if="cart.length > 0">
        <div class="total">
          <span>Total:</span>
          <span class="amount">${{ total }}</span>
        </div>
        <button class="checkout-btn" @click="$emit('checkout')">Checkout</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-sidebar-wrapper {
  position: relative;
  z-index: 2000;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 350px;
  height: 100vh;
  background: #1a1a2e;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  transition: right 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-sizing: border-box;
  color: white;
  box-shadow: -5px 0 15px rgba(0,0,0,0.5);
}

.cart-sidebar.open {
  right: 0;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 10px;
}

.item-image {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0;
  font-size: 0.9rem;
}

.item-details p {
  margin: 0;
  color: #00f260;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0,0,0,0.3);
  width: fit-content;
  padding: 0.2rem;
  border-radius: 5px;
}

.qty-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.qty-btn:hover {
  background: rgba(255,255,255,0.2);
}

.qty {
  font-size: 0.9rem;
  min-width: 20px;
  text-align: center;
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.empty-cart {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}

.cart-footer {
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.total {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.amount {
  color: #00f260;
}

.checkout-btn {
  width: 100%;
  background: #00f260;
  color: #1a1a2e;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.checkout-btn:hover {
  background: #00e05a;
}
</style>
