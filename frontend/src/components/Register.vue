import { ref, computed } from 'vue';
import TermsModal from './TermsModal.vue';

const form = ref({
  nombre: '',
  apellido: '',
  email: '',
  rut: '',
  direccion: '',
  password: ''
});

const error = ref('');
const loading = ref(false);
const showTerms = ref(false);
const acceptedTerms = ref(false);

const validateRut = (rut) => {
  if (!rut || !/^[0-9]+-[0-9kK]{1}$/.test(rut)) return false;
  const split = rut.split('-');
  let num = parseInt(split[0]);
  const dv = split[1].toLowerCase();
  let m = 0, s = 1;
  for (; num; num = Math.floor(num / 10)) {
    s = (s + num % 10 * (9 - m++ % 6)) % 11;
  }
  const expectedDv = s ? (s - 1).toString() : 'k';
  return dv === expectedDv;
};

const validatePassword = (pass) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number OR special char
  return /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(pass) && pass.length >= 8;
};

const isFormValid = computed(() => {
  return form.value.nombre.length >= 2 &&
         form.value.apellido.length >= 2 &&
         form.value.email.includes('@') &&
         validateRut(form.value.rut) &&
         form.value.direccion.length >= 5 &&
         validateRut(form.value.rut) &&
         form.value.direccion.length >= 5 &&
         validatePassword(form.value.password);
});

const handleRegister = async () => {
    if (!isFormValid.value) return;

    if (!acceptedTerms.value) {
      showTerms.value = true;
      return;
    }

    loading.value = true;
    error.value = '';

    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value)
        });

        const data = await response.json();
        
        if (!response.ok) {
            // Handle array of errors from class-validator
            const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
            throw new Error(msg || 'Registration failed');
        }

        alert('Registration successful! Please login.');
        // Redirect or clear form
        form.value = { nombre: '', apellido: '', email: '', rut: '', direccion: '', password: '' };
    } catch (e) {
        error.value = e.message;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
  <div class="auth-container">
    <div class="glass-card">
      <h2>Registro</h2>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="row">
            <div class="form-group">
                <label>Nombre</label>
                <input v-model="form.nombre" required />
            </div>
            <div class="form-group">
                <label>Apellido</label>
                <input v-model="form.apellido" required />
            </div>
        </div>
        
        <div class="form-group">
            <label>RUT (Ej: 12345678-k)</label>
            <input v-model="form.rut" required :class="{ 'invalid': form.rut && !validateRut(form.rut) }" />
            <span v-if="form.rut && !validateRut(form.rut)" class="hint">RUT Inválido</span>
        </div>

        <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="form.email" required />
        </div>

        <div class="form-group">
            <label>Dirección</label>
            <input v-model="form.direccion" required />
        </div>

        <div class="form-group">
            <label>Contraseña</label>
            <input type="password" v-model="form.password" required :class="{ 'invalid': form.password && !validatePassword(form.password) }" />
            <span v-if="form.password && !validatePassword(form.password)" class="hint">Mín 8 caracteres, Mayúscula, Minúscula, Número/Especial</span>
        </div>

        <div class="form-group terms-check">
            <label class="terms-label">
                <input type="checkbox" v-model="acceptedTerms" />
                <span>He leído y acepto los <a href="#" @click.prevent="showTerms = true">Términos y Condiciones</a></span>
            </label>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading || !isFormValid" class="submit-btn" :class="{ 'disabled': !isFormValid }">
          {{ loading ? 'Registrando...' : 'Registrar' }}
        </button>
      </form>
    </div>
    
    <TermsModal :isOpen="showTerms" @close="showTerms = false" />
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  max-height: 90vh;
  overflow-y: auto;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #00f260;
}

.row {
    display: flex;
    gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  color: #a0a0a0;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.7rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  color: white;
  outline: none;
  box-sizing: border-box; 
}

input.invalid {
    border-color: #ff6b6b;
}

.hint {
    font-size: 0.75rem;
    color: #ff6b6b;
    margin-top: 0.2rem;
    display: block;
}

.submit-btn {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(90deg, #00f260 0%, #0575e6 100%);
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}

.submit-btn.disabled {
    background: #555;
    cursor: not-allowed;
    opacity: 0.7;
}

.error {
  color: #ff6b6b;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.terms-check {
  margin-top: 1rem;
}

.terms-label {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  color: #ccc;
  font-size: 0.9rem;
  cursor: pointer;
}

.terms-label input {
  width: auto;
  margin: 0;
}

.terms-label a {
  color: #00f260;
  text-decoration: none;
}

.terms-label a:hover {
  text-decoration: underline;
}
</style>
