# Art & Telas - Frontend

Bienvenido al repositorio del frontend de **Art & Telas**. Esta aplicación es una plataforma de comercio electrónico moderna y ágil, construida utilizando **Vue 3** y **Vite**.

## 📋 Descripción del Proyecto

El objetivo de este proyecto es proveer una interfaz de usuario intuitiva y robusta para la compra de telas y artículos de arte, gestionando todo el flujo desde la selección de productos hasta el pago seguro y la administración de órdenes.

## ✨ Características Principales

### 🛍️ Experiencia de Usuario (Cliente)
- **Home Page Dinámica**: Visualización atractiva de productos destacados y navegación fluida.
- **Detalle de Productos**: Vista detallada con información completa del producto.
- **Carrito de Compras**: Barra lateral (`CartSidebar`) para una gestión rápida de los productos seleccionados sin salir de la página actual.
- **Soporte Rápido**: Botón flotante de WhatsApp (`WhatsAppButton`) para contacto directo.

### 🔐 Autenticación y Perfil
- **Registro e Inicio de Sesión**: Formularios seguros para nuevos usuarios y usuarios recurrentes (`Login`, `Register`).
- **Perfil de Usuario**: Área personal (`UserProfile`) donde los clientes pueden ver su información y estado.

### 💳 Pagos
- **Integración con Transbank**: Flujo de pago completo incluyendo redirección y confirmación (`PaymentResult`).

### 🛠️ Administración
- **Panel de Control**: Acceso exclusivo para administradores (`AdminPanel`) que permite:
  - Gestionar el inventario de productos.
  - Visualizar órdenes y transacciones de pagos.

## 💻 Stack Tecnológico

- **Framework**: [Vue 3](https://vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilos**: CSS Moderno (Vanilla)
- **Gestor de Paquetes**: npm

## 🚀 Instalación y Configuración

### Prerrequisitos
Asegúrate de tener instalado **Node.js** (versión recomendada 18+).

### Pasos
1.  **Clonar el repositorio** (si aún no lo has hecho):
    ```bash
    git clone <url-del-repositorio>
    cd frontend
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configuración de Variables de Entorno**:
    Crea un archivo `.env` en la raíz del proyecto si es necesario configurar la URL del backend u otras credenciales.
    ```env
    VITE_API_URL=http://localhost:3000/api
    ```

## ▶️ Ejecución

### Desarrollo
Para levantar el entorno de desarrollo local con recarga en caliente (HMR):

```bash
npm run dev
```
La aplicación estará disponible usualmente en `http://localhost:5173`.

### Producción
Para compilar la aplicación para un entorno de producción:

```bash
npm run build
```
Esto generará los archivos estáticos en la carpeta `dist`.

Para previsualizar la build de producción localmente:
```bash
npm run preview
```

## 📂 Estructura del Proyecto

Los componentes principales se encuentran en `src/components`:

- `AdminPanel.vue`: Gestión administrativa.
- `CartSidebar.vue`: Carrito de compras.
- `Home.vue`: Página principal.
- `Login.vue` / `Register.vue`: Autenticación.
- `ProductDetail.vue`: Vista individual de producto.
- `PaymentResult.vue`: Página de respuesta de pago.
- `WhatsAppButton.vue`: Componente de contacto flotante.

---
Desarrollado para Art & Telas.
