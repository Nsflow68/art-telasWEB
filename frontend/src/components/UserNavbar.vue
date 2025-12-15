<script setup>
defineProps({
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
  <nav class="user-navbar">
    <div class="brand">Art&Telas</div>
    <div class="user-info">
      <span>Hola, {{ user.nombre }}</span>
      <button class="cart-btn" @click="$emit('toggleCart')">
        🛒 <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
      </button>
      <button class="logout-btn" @click="$emit('logout')">Salir</button>
    </div>
  </nav>
</template>

<style scoped>
.user-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #00f260 0%, #0575e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
}

.cart-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
}

.cart-btn:hover {
  transform: scale(1.1);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 50%;
  font-weight: bold;
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 0, 0, 0.2);
  border-color: #ff6b6b;
  color: #ff6b6b;
}
</style>
