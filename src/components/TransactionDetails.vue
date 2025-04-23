<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="transaction-details">
    <h3>Detalles de la Transacción</h3>
    <p><strong>ID:</strong> {{ transaction.transactionId }}</p>
    <p><strong>Tipo:</strong> {{ transaction.type === 'buy' ? 'Compra' : 'Venta' }}</p>
    <p><strong>Criptomoneda:</strong> {{ transaction.cryptoName }}</p>
    <p><strong>Cantidad:</strong> {{ transaction.quantity }}</p>
    <p><strong>Precio:</strong> ${{ transaction.price.toFixed(2) }}</p>
    <p><strong>Total:</strong> ${{ transaction.total.toFixed(2) }}</p>
    <p><strong>Fecha:</strong> {{ transaction.dateTime }}</p>
  </div>
</template>

<style scoped>
.transaction-details {
  border: 1px solid #7e7d7d;
  padding: 15px;
  border-radius: 5px;
  background: #858585;
  color: white;
}
</style>
