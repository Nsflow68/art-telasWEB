<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const activeTab = ref('users')
const users = ref([])
const products = ref([])
const showProductModal = ref(false)
const editingProduct = ref(null)

const productForm = ref({
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0,
  imagen: ''
})

const imageSourceType = ref('url')
const uploading = ref(false)

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/products/upload-image`, {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      const data = await response.json()
      productForm.value.imagen = data.url
    } else {
      console.error('Upload failed')
    }
  } catch (e) {
    console.error('Error uploading file', e)
  } finally {
    uploading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/users`);
    if (response.ok) {
      users.value = await response.json();
    }
  } catch (e) {
    console.error('Failed to fetch users', e);
  }
}

const fetchProducts = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/products`);
    if (response.ok) {
      products.value = await response.json();
    }
  } catch (e) {
    console.error('Failed to fetch products', e);
  }
}

const openProductModal = (product = null) => {
  if (product) {
    editingProduct.value = product
    productForm.value = { ...product }
  } else {
    editingProduct.value = null
    productForm.value = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagen: ''
    }
  }
  showProductModal.value = true
}

const saveProduct = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = editingProduct.value 
      ? `${apiUrl}/api/products/${editingProduct.value.id}`
      : `${apiUrl}/api/products`;
    
    const method = editingProduct.value ? 'PATCH' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm.value)
    });

    if (response.ok) {
      showProductModal.value = false
      fetchProducts()
    }
  } catch (e) {
    console.error('Failed to save product', e);
  }
}

const deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/products/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      fetchProducts()
    }
  } catch (e) {
    console.error('Failed to delete product', e);
  }
}

onMounted(() => {
  fetchUsers()
  fetchProducts()
})

// User Management Logic
const showUserModal = ref(false)
const editingUser = ref(null)
const userForm = ref({
  nombre: '',
  apellido: '',
  email: '',
  rut: '',
  direccion: '',
  role: 'user'
})

const openUserModal = (user) => {
  editingUser.value = user
  userForm.value = { ...user } // Copy user data
  showUserModal.value = true
}

const saveUser = async () => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/users/${editingUser.value.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userForm.value)
        });

        if (response.ok) {
            showUserModal.value = false;
            fetchUsers();
        }
    } catch (e) {
        console.error('Failed to update user', e);
    }
}

const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/users/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchUsers();
        }
    } catch (e) {
        console.error('Failed to delete user', e);
    }
}
</script>

<template>
  <div class="admin-container">
    <div class="admin-panel">
      
      <div class="header-actions">
        <h1>Admin Control</h1>
        <button class="logout-btn" @click="$emit('logout')">Logout</button>
      </div>

      <div class="tabs">
        <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">Users</button>
        <button :class="{ active: activeTab === 'products' }" @click="activeTab = 'products'">Products</button>
      </div>

      <div class="content-area">
        <!-- USERS TAB -->
        <div v-if="activeTab === 'users'" class="tab-content">
          <h2>Registered Users</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>RUT</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in users" :key="u.id">
                  <td>{{ u.id }}</td>
                  <td>{{ u.nombre }} {{ u.apellido }}</td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.rut }}</td>
                  <td>
                    <span :class="['badge', u.role]">{{ u.role }}</span>
                  </td>
                  <td class="actions-cell">
                    <button class="edit-btn" @click="openUserModal(u)">Edit</button>
                    <button class="delete-btn" @click="deleteUser(u.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- PRODUCTS TAB -->
        <div v-if="activeTab === 'products'" class="tab-content">
          <div class="flex-header">
            <h2>Product Management</h2>
            <button class="create-btn" @click="openProductModal()">+ Add Product</button>
          </div>
          
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in products" :key="p.id">
                  <td>{{ p.id }}</td>
                  <td>
                    <img v-if="p.imagen" :src="p.imagen" alt="img" class="thumb" />
                    <span v-else>📦</span>
                  </td>
                  <td>{{ p.nombre }}</td>
                  <td>${{ p.precio }}</td>
                  <td>{{ p.stock }}</td>
                  <td class="actions-cell">
                    <button class="edit-btn" @click="openProductModal(p)">Edit</button>
                    <button class="delete-btn" @click="deleteProduct(p.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- MODAL -->
    <div v-if="showProductModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ editingProduct ? 'Edit Product' : 'New Product' }}</h3>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Name</label>
            <input v-model="productForm.nombre" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="productForm.descripcion"></textarea>
          </div>
          <div class="form-group">
            <label>Price</label>
            <input type="number" v-model="productForm.precio" required />
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input type="number" v-model="productForm.stock" required />
          </div>
          <div class="form-group">
            <label>Image Source</label>
            <div class="image-source-options">
              <label>
                <input type="radio" v-model="imageSourceType" value="url" /> URL
              </label>
              <label>
                <input type="radio" v-model="imageSourceType" value="file" /> Upload File
              </label>
            </div>
          </div>

          <div class="form-group" v-if="imageSourceType === 'url'">
            <label>Image URL</label>
            <input v-model="productForm.imagen" placeholder="https://..." />
          </div>

          <div class="form-group" v-if="imageSourceType === 'file'">
            <label>Select Image</label>
            <input type="file" @change="handleFileUpload" accept="image/*" />
            <div v-if="uploading" class="uploading-status">Uploading...</div>
          </div>
          
          <div v-if="productForm.imagen" class="preview">
             <p>Preview:</p>
             <img :src="productForm.imagen" alt="Preview" class="thumb-preview" />
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="showProductModal = false">Cancel</button>
            <button type="submit" class="save-btn">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- USER MODAL -->
    <div v-if="showUserModal" class="modal-overlay">
      <div class="modal">
        <h3>Edit User</h3>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="userForm.nombre" required />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="userForm.apellido" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="userForm.email" required />
          </div>
          <div class="form-group">
            <label>RUT</label>
            <input v-model="userForm.rut" required />
          </div>
           <div class="form-group">
            <label>Address</label>
            <input v-model="userForm.direccion" required />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="userForm.role" class="role-select">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="showUserModal = false">Cancel</button>
            <button type="submit" class="save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
.admin-container {
  min-height: 100vh;
  width: 100vw;
  background: #1a1a2e;
  color: white;
  padding: 2rem;
  box-sizing: border-box;
}

.admin-panel {
  max-width: 1000px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logout-btn {
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.tabs button {
  background: transparent;
  border: none;
  color: #888;
  font-size: 1.2rem;
  padding: 1rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tabs button.active {
  color: #00f260;
  border-bottom: 2px solid #00f260;
}

.tab-content {
  background: rgba(255,255,255,0.05);
  padding: 2rem;
  border-radius: 10px;
}

.flex-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.create-btn {
  background: #00f260;
  color: #1a1a2e;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

th {
  color: #888;
}

.thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.badge {
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
  text-transform: uppercase;
}
.badge.admin { background: #6b4c9a; color: white; }
.badge.user { background: #2c3e50; color: #ccc; }

.actions-cell button {
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
}

.edit-btn { background: #3498db; color: white; }
.delete-btn { background: #e74c3c; color: white; }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #252540;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #ccc;
}

.form-group input, .form-group textarea {
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.5rem;
  color: white;
  border-radius: 5px;
}

.role-select {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 0.5rem;
    color: white;
    border-radius: 5px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.save-btn {
  background: #00f260;
  color: #1a1a2e;
  font-weight: bold;
}
</style>
