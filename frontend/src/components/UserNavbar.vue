<script setup>
import { ref } from 'vue';

defineProps({
  user: {
    type: Object,
    required: false
  },
  cartCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['logout', 'toggleCart', 'goToProfile', 'goHome', 'search', 'login', 'register'])

const searchQuery = ref('');
const isMenuOpen = ref(false);

const handleSearch = () => {
  emit('search', searchQuery.value);
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<template>
  <nav class="user-navbar">
    <div class="nav-header">
      <div class="brand" @click="$emit('goHome')">Art&Telas</div>
      
      <div class="mobile-controls">
        <button class="cart-btn mobile-cart" @click="$emit('toggleCart')">
          🛒 <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </button>
        <button class="hamburger" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    </div>
    
    <div class="nav-content" :class="{ 'is-open': isMenuOpen }">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch" 
          placeholder="Buscar productos..." 
        />
        <span class="search-icon">🔍</span>
      </div>

      <div class="user-info">
        <button class="nav-btn desktop-only" @click="$emit('goHome')" title="Inicio">🏠</button>
        
        <button class="cart-btn desktop-only" @click="$emit('toggleCart')">
          🛒 <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </button>

        <template v-if="user">
            <div class="profile-menu">
              <button class="nav-btn profile-btn" @click="$emit('goToProfile'); isMenuOpen = false">
                👤 {{ user.nombre }}
              </button>
            </div>

            <button class="logout-btn" @click="$emit('logout'); isMenuOpen = false">Salir</button>
        </template>
        <template v-else>
            <button class="nav-btn login-btn" @click="$emit('login'); isMenuOpen = false">Iniciar Sesión</button>
            <button class="nav-btn register-btn" @click="$emit('register'); isMenuOpen = false">Registrarse</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.user-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.nav-header {
  display: contents;
}

.nav-content {
  display: contents;
}

.brand {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(90deg, #00f260 0%, #0575e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  letter-spacing: -1px;
}

.search-bar {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 0.7rem 1rem 0.7rem 2.5rem;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: white;
  outline: none;
  transition: all 0.3s;
}

.search-bar input:focus {
  background: rgba(255,255,255,0.1);
  border-color: #00f260;
  box-shadow: 0 0 15px rgba(0, 242, 96, 0.2);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
}

.nav-btn {
  background: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 10px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-btn:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.profile-btn {
  font-size: 1rem;
  font-weight: 500;
}

.cart-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
  padding: 0.5rem;
}

.cart-btn:hover {
  transform: scale(1.1);
}

.badge {
  position: absolute;
  top: 0;
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
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff4757;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  font-weight: bold;
  margin-left: 1rem;
}

.logout-btn:hover {
  background: #ff4757;
  color: white;
  box-shadow: 0 0 15px rgba(255, 71, 87, 0.4);
}

.login-btn {
    border: 1px solid rgba(0, 242, 96, 0.5);
    color: #00f260;
    font-weight: bold;
    border-radius: 20px;
    padding: 0.5rem 1rem;
}

.login-btn:hover {
    background: rgba(0, 242, 96, 0.1);
    box-shadow: 0 0 10px rgba(0, 242, 96, 0.2);
}

.register-btn {
    background: linear-gradient(90deg, #00f260 0%, #0575e6 100%);
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 20px;
    padding: 0.5rem 1rem;
}

.register-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 117, 230, 0.4);
}

/* Mobile Controls */
.mobile-controls {
  display: none;
}
.mobile-cart {
  display: none;
}
.hamburger {
  display: none;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .user-navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.8rem 1rem;
  }

  .nav-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  }

  .nav-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
  }

  .nav-content.is-open {
    max-height: 500px;
    margin-top: 1rem;
  }

  .mobile-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .mobile-cart {
    display: block;
  }

  .desktop-only {
    display: none !important;
  }

  .hamburger {
    display: block;
    background: none;
    border: none;
    cursor: pointer;
  }

  .bar {
    display: block;
    width: 25px;
    height: 3px;
    margin: 5px auto;
    background-color: white;
    transition: all 0.3s ease-in-out;
  }

  .hamburger.is-active .bar:nth-child(2) {
    opacity: 0;
  }

  .hamburger.is-active .bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger.is-active .bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  .search-bar {
    width: 100%;
    margin: 0 0 1rem 0;
    max-width: none;
  }

  .user-info {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .nav-btn, .logout-btn, .login-btn, .register-btn {
    width: 100%;
    justify-content: center;
    margin: 0;
  }
}
</style>
