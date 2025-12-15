<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2>TÉRMINOS Y CONDICIONES</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="modal-content">
        <h3>1. Aceptación de los Términos</h3>
        <p>Al registrarse en Art&Telas, usted acepta cumplir con los siguientes términos y condiciones relacionados con el uso de sus datos y la seguridad de la plataforma.</p>

        <h3>2. Protección de Datos Personales (Ley 19.628)</h3>
        <p>De conformidad con la Ley N° 19.628 sobre Protección de la Vida Privada, Art&Telas garantiza que:</p>
        <ul>
          <li>Sus datos personales (Nombre, RUT, Email, Dirección) serán utilizados exclusivamente para la gestión de su cuenta y el procesamiento de pedidos.</li>
          <li>No compartiremos su información con terceros sin su consentimiento expreso, salvo obligación legal.</li>
        </ul>

        <h3>3. Seguridad de la Información (ISO/IEC 27001)</h3>
        <p>Nos comprometemos a salvaguardar su información bajo los pilares fundamentales de la seguridad de la información:</p>
        <ul>
          <li><strong>Confidencialidad:</strong> Garantizamos que su información solo es accesible por personal autorizado.</li>
          <li><strong>Integridad:</strong> Protegemos sus datos contra modificaciones no autorizadas.</li>
          <li><strong>Disponibilidad:</strong> Aseguramos el acceso a sus datos cuando los necesite.</li>
        </ul>
        <p>Implementamos controles técnicos y organizativos alineados con la norma ISO 27001 para mitigar riesgos de ciberseguridad.</p>

        <h3>4. Derechos ARCO</h3>
        <p>Como titular de los datos, usted tiene derecho a:</p>
        <ul>
          <li><strong>Acceso:</strong> Solicitar información sobre sus datos almacenados.</li>
          <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
          <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos cuando sea procedente.</li>
          <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos para fines específicos.</li>
        </ul>

        <h3>5. Ley Marco de Ciberseguridad</h3>
        <p>Cumplimos con las disposiciones de la Ley Marco de Ciberseguridad de Chile, reportando cualquier incidente significativo que pudiera afectar la integridad de sus datos personales a las autoridades competentes.</p>
      </div>
      
      <div class="modal-actions">
        <button class="accept-btn" @click="$emit('close')">Entendido</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.modal {
  background: #1a1a2e;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.modal-header {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  margin: 0;
  color: #00f260;
  font-size: 1.5rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: #888;
  font-size: 2rem;
  cursor: pointer;
}

.modal-content {
  padding: 2rem;
  overflow-y: auto;
  color: #ccc;
  line-height: 1.6;
}

.modal-content h3 {
  color: white;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.modal-content ul {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.modal-content li {
  margin-bottom: 0.5rem;
}

.modal-actions {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
  background: rgba(255, 255, 255, 0.02);
}

.accept-btn {
  background: #00f260;
  color: #1a1a2e;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.accept-btn:hover {
  background: #00e05a;
}

/* Scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>
