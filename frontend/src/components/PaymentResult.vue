<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['back']);

const isSuccess = computed(() => props.status === 'success');
const message = computed(() => isSuccess.value ? '¡Pago Exitoso!' : 'Pago Fallido o Anulado');
const description = computed(() => isSuccess.value ? 'Gracias por tu compra. Tu pedido ha sido procesado.' : 'Lo sentimos, no se pudo completar la transacción.');
</script>

<template>
  <div class="payment-result">
    <div class="card" :class="{ success: isSuccess, failure: !isSuccess }">
      <div class="icon">
        {{ isSuccess ? '🎉' : '❌' }}
      </div>
      <h2>{{ message }}</h2>
      <p>{{ description }}</p>
      <button @click="$emit('back')">Volver al Inicio</button>
    </div>
  </div>
</template>

<style scoped>
.payment-result {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  padding: 2rem;
}

.card {
  background: #1a1a2e;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  max-width: 400px;
  width: 100%;
  border: 1px solid rgba(255,255,255,0.1);
}

.icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h2 {
  color: white;
  margin-bottom: 1rem;
}

.success h2 {
  color: #00f260;
}

.failure h2 {
  color: #ff4757;
}

p {
  color: #ccc;
  margin-bottom: 2rem;
}

button {
  background: #00f260;
  color: #1a1a2e;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.05);
}
</style>
