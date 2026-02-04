<script setup>
import { ref, onMounted } from 'vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Home from './components/Home.vue'
import AdminPanel from './components/AdminPanel.vue'
import ProductDetail from './components/ProductDetail.vue'
import CartSidebar from './components/CartSidebar.vue'
import UserNavbar from './components/UserNavbar.vue';
import UserFooter from './components/UserFooter.vue';
import UserProfile from './components/UserProfile.vue';

import PaymentResult from './components/PaymentResult.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';
import Swal from 'sweetalert2';

const currentView = ref('home')
const currentUser = ref(null)
const selectedProduct = ref(null)
const cart = ref([])
const isCartOpen = ref(false)
const paymentStatus = ref('');
const searchQuery = ref('');

onMounted(() => {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
        currentUser.value = JSON.parse(savedUser);
        if (currentUser.value.role === 'admin') {
        } else {
           if (currentView.value === 'login') {
             currentView.value = 'home';
           }
        }
    } catch (e) {
        console.error('Error parsing saved user', e);
        localStorage.removeItem('currentUser');
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('payment_status');
  if (status) {
    paymentStatus.value = status;
    currentView.value = 'payment-result';
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

const handleLoginSuccess = (user) => {
  currentUser.value = user
  localStorage.setItem('currentUser', JSON.stringify(user));
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
  isCartOpen.value = false;
  currentView.value = 'home'
  localStorage.removeItem('currentUser');
}

const handleProductSelection = (product) => {
  selectedProduct.value = product
  currentView.value = 'product-detail'
}

const handleBackToHome = () => {
  selectedProduct.value = null
  currentView.value = 'home'
}

const handleGoToProfile = () => {
  currentView.value = 'profile';
};

const handleGoHome = () => {
    currentView.value = 'home';
    selectedProduct.value = null;
};

const handleSearch = (query) => {
    searchQuery.value = query;
    if (currentView.value !== 'home') {
        currentView.value = 'home';
    }
};

const handleUpdateUser = (updatedUser) => {
  currentUser.value = updatedUser;
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
};

const addToCart = (product) => {
  const existing = cart.value.find(item => item.id === product.id)
  if (existing) {
    if (existing.quantity < product.stock) {
       existing.quantity++;
       
       const Toast = Swal.mixin({
         toast: true,
         position: 'top-end',
         showConfirmButton: false,
         timer: 3000,
         timerProgressBar: true,
         didOpen: (toast) => {
           toast.onmouseenter = Swal.stopTimer;
           toast.onmouseleave = Swal.resumeTimer;
         }
       });
       Toast.fire({
         icon: 'success',
         title: 'Cantidad actualizada'
       });

    } else {
       Swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: 'No hay más stock disponible'
       });
       return;
    }
  } else {
    cart.value.push({ ...product, quantity: 1 })
    
    const Toast = Swal.mixin({
         toast: true,
         position: 'top-end',
         showConfirmButton: false,
         timer: 3000,
         timerProgressBar: true,
         didOpen: (toast) => {
           toast.onmouseenter = Swal.stopTimer;
           toast.onmouseleave = Swal.resumeTimer;
         }
       });
       Toast.fire({
         icon: 'success',
         title: 'Agregado al carrito'
       });
  }
  isCartOpen.value = true
}

const increaseQuantity = (item) => {
  const cartItem = cart.value.find(i => i.id === item.id)
  if (cartItem) {
    if (cartItem.quantity < item.stock) {
        cartItem.quantity++;
    } else {
        Swal.fire({
         icon: 'error',
         title: 'Límite alcanzado',
         text: 'Stock máximo alcanzado'
       });
    }
  }
}

const decreaseQuantity = (item) => {
  const cartItem = cart.value.find(i => i.id === item.id)
  if (cartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--
    } else {
      removeFromCart(item.id);
    }
  }
}

const removeFromCart = (id) => {
  cart.value = cart.value.filter(item => item.id !== id)
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const handleCheckout = async () => {
  if (!currentUser.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Inicia Sesión',
      text: 'Debes iniciar sesión para comprar',
      showCancelButton: true,
      confirmButtonText: 'Ir al Login',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        currentView.value = 'login';
      }
    });
    return;
  }

  try {
    const total = cart.value.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    console.log('Initiating transaction to:', `${apiUrl}/api/transbank/create`);
    const response = await fetch(`${apiUrl}/api/transbank/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: currentUser.value.id,
        amount: total,
        products: cart.value
      })
    });

    const data = await response.json();
    
    if (data.url && data.token) {
      const form = document.createElement('form');
      form.action = data.url;
      form.method = 'POST';
      
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token_ws';
      input.value = data.token;
      
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } else {
        console.error('Transbank create response:', data);
        Swal.fire({
          icon: 'error',
          title: 'Error de Transacción',
          text: 'Error al iniciar transacción: ' + (data.message || data.error || JSON.stringify(data))
        });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de Checkout',
      text: 'Error al procesar el checkout: ' + error.message
    });
  }
}
</script>

<template>
  <div class="app-container">
    <Login v-if="currentView === 'login'" @login-success="handleLoginSuccess" @go-to-register="currentView = 'register'" />
    <Register v-if="currentView === 'register'" @go-to-login="currentView = 'login'" />
    <AdminPanel v-if="currentView === 'admin'" :user="currentUser" @logout="handleLogout" />
    
    <!-- User Layout (Navbar + Content + Footer) -->
    <div v-if="['home', 'product-detail', 'profile', 'payment-result'].includes(currentView)" class="user-layout">
        <UserNavbar 
          :user="currentUser" 
          :cartCount="cart.length" 
          @logout="handleLogout" 
          @toggleCart="toggleCart"
          @goToProfile="handleGoToProfile"
          @goHome="handleGoHome"
          @search="handleSearch"
          @login="currentView = 'login'"
          @register="currentView = 'register'"
        />
        
        <Home 
          v-if="currentView === 'home'" 
          :user="currentUser" 
          :searchQuery="searchQuery"
          @selectProduct="handleProductSelection"
          @addToCart="addToCart"
        />
        
        <ProductDetail 
          v-if="currentView === 'product-detail' && selectedProduct && currentUser" 
          :product="selectedProduct" 
          :user="currentUser"
          @back="handleBackToHome"
          @addToCart="addToCart"
        />

        <UserProfile
          v-if="currentView === 'profile' && currentUser"
          :user="currentUser"
          @back="handleBackToHome"
          @updateUser="handleUpdateUser"
        />

        <PaymentResult
          v-if="currentView === 'payment-result'"
          :status="paymentStatus"
          @back="handleBackToHome"
        />
        
        <UserFooter />

        <CartSidebar 
          :isOpen="isCartOpen" 
          :cart="cart" 
          @close="isCartOpen = false" 
          @remove="removeFromCart"
          @increase="increaseQuantity"
          @decrease="decreaseQuantity"
          @checkout="handleCheckout"
        />
    </div>

    <!-- Global Floating WhatsApp Button -->
    <WhatsAppButton />

  </div>
</template>



