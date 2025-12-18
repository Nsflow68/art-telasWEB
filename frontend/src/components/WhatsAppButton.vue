<script setup>
const whatsappUrl = 'https://www.whatsapp.com/catalog/56956954973/?app_absent=0&utm_source=ig';
</script>

<template>
  <a :href="whatsappUrl" target="_blank" class="whatsapp-btn" title="Contáctanos por WhatsApp">
    <div class="icon-wrapper">
        <!-- SVG for WhatsApp Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="white">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.53C9.42 7.29 9.31 7.29 9.21 7.29C9.11 7.29 9 7.29 8.88 7.29C8.77 7.29 8.59 7.33 8.44 7.5C8.28 7.66 7.85 8.08 7.85 8.92C7.85 9.77 8.46 10.59 8.55 10.71C8.64 10.83 9.76 12.67 11.53 13.36C13.29 14.06 13.29 13.82 13.61 13.79C13.93 13.76 14.63 13.36 14.77 12.94C14.92 12.53 14.92 12.17 14.88 12.11C14.83 12.05 14.71 12.01 14.53 11.92C14.35 11.83 13.46 11.4 13.3 11.34C13.13 11.29 13 11.26 12.89 11.43C12.78 11.61 12.45 11.98 12.35 12.11C12.24 12.23 12.12 12.24 11.94 12.16C11.77 12.07 11.2 11.88 10.53 11.28C10 10.81 9.64 10.23 9.54 10.05C9.43 9.88 9.53 9.78 9.62 9.69C9.7 9.61 9.8 9.48 9.89 9.38C9.98 9.27 10 9.19 10.07 9.07C10.13 8.94 10.1 8.83 10.05 8.73C10 8.63 9.66 7.74 9.53 7.53Z" />
        </svg>
    </div>
  </a>
</template>

<style scoped>
.whatsapp-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  background-color: #25D366;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  text-decoration: none;
}

.whatsapp-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 6px 16px rgba(37, 211, 102, 0.5);
  background-color: #20BA5A;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pulse animation for attention */
.whatsapp-btn::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #25D366;
  opacity: 0.5;
  z-index: -1;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.5; }
  70% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1.5); opacity: 0; }
}
</style>
