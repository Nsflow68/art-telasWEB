<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['back', 'updateUser']);

const form = ref({
  id: '',
  nombre: '',
  apellido: '',
  email: '',
  rut: '',
  direccion: '',
  profileImage: ''
});

const loading = ref(false);
const uploading = ref(false);
const message = ref('');


watch(() => props.user, (newUser) => {
  if (newUser) {
    form.value = { ...newUser };
  }
}, { immediate: true });

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/users/upload-image`, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      form.value.profileImage = data.url;
    } else {
      console.error('Upload failed');
    }
  } catch (e) {
    console.error('Error uploading file', e);
  } finally {
    uploading.value = false;
  }
};

const saveProfile = async () => {
  loading.value = true;
  message.value = '';

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/users/${form.value.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });

    if (response.ok) {
      const updatedUser = await response.json();
      message.value = 'Perfil actualizado correctamente';
      emit('updateUser', updatedUser);
    } else {
      message.value = 'Error al actualizar el perfil';
    }
  } catch (e) {
    message.value = 'Error de conexión';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="profile-container">
    <div class="glass-card">
      <div class="header">
        <button class="back-btn" @click="$emit('back')">← Volver</button>
        <h2>Mi Perfil</h2>
      </div>

      <div class="profile-content">
        <div class="image-section">
          <div class="avatar-wrapper">
             <img v-if="form.profileImage" :src="form.profileImage" alt="Profile" class="avatar" />
             <div v-else class="avatar-placeholder">{{ form.nombre.charAt(0) }}</div>
          </div>
          <label class="upload-btn">
            Cambiar Foto
            <input type="file" @change="handleFileUpload" accept="image/*" />
          </label>
          <p v-if="uploading" class="status">Subiendo...</p>
        </div>

        <form @submit.prevent="saveProfile" class="profile-form">
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
            <label>Email (No editable)</label>
            <input v-model="form.email" disabled class="disabled-input" />
          </div>

          <div class="form-group">
            <label>RUT (No editable)</label>
            <input v-model="form.rut" disabled class="disabled-input" />
          </div>

          <div class="form-group">
            <label>Dirección</label>
            <input v-model="form.direccion" required />
          </div>

          <p v-if="message" class="message" :class="{'success': message.includes('correctamente')}">{{ message }}</p>

          <button type="submit" :disabled="loading" class="save-btn">
            {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  padding: 80px 20px 20px 20px; /* Top padding for navbar */
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  color: white;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
}

.header h2 {
  margin: 0;
  flex-grow: 1;
  text-align: center;
  color: #00f260;
}

.back-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ccc;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  left: 0;
}

.back-btn:hover {
  border-color: white;
  color: white;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 768px) {
  .profile-content {
    flex-direction: row;
    align-items: flex-start;
  }
}

.image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
}

.avatar-wrapper {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #00f260;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.3);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 4rem;
  font-weight: bold;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
}

.upload-btn {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.upload-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.upload-btn input {
  display: none;
}

.profile-form {
  flex-grow: 1;
  width: 100%;
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

.disabled-input {
  background: rgba(0, 0, 0, 0.4);
  color: #888;
  cursor: not-allowed;
}

.save-btn {
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

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  text-align: center;
  margin-top: 1rem;
  color: #ff6b6b;
}

.message.success {
  color: #00f260;
}
</style>
