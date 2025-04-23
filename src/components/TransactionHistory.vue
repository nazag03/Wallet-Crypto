<template>
  <div class="transaction-list">
    <transition-group name="fade" tag="div">
      <div
        v-for="transaction in walletStore.transactions"
        :key="transaction.transactionId"
        class="transaction-card"
        :class="transaction.type"
      >
        <div class="transaction-info">
          <h3>{{ transaction.cryptoName }}</h3>
          <p>{{ transaction.quantity }} units</p>
          <p>Total: ${{ transaction.total ? transaction.total.toFixed(2) : '0.00' }}</p>
          <p class="date-time">📅{{ transaction.dateTime }}</p>
          <span class="type-label">{{ transaction.type === 'buy' ? '🟢 Buy' : '🔴 Sell' }}</span>
        </div>

        <div class="actions">
          <button @click="startEdit(transaction)" class="btn edit">✏️edit</button>
          <button @click="walletStore.removeTransaction(transaction.transactionId)" class="btn delete">🗑️delete</button>
        </div>
      </div>
    </transition-group>

    <div v-if="editingTransaction" class="edit-section">
      <h3>Editar Transacción</h3>
      <label for="editQuantity">Select amount: </label>
      <input
        v-model.number="editQuantity"
        type="number"
        step="0.0001"
        min="0.0001"
      />

      <p>Total: ${{ newTotal.toFixed(2) }}</p>

      <!-- Mostrar mensaje de error si hay alguno -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <button @click="saveEdit" class="btn save">💾 Save</button>
      <button @click="cancelEdit" class="btn cancel">❌ Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useWalletStore } from '@/store/useWalletStore';

const walletStore = useWalletStore();
const editingTransaction = ref(null);
const editQuantity = ref(0);
const errorMessage = ref(null); // Variable para almacenar el mensaje de error

const newTotal = computed(() => {
  if (!editingTransaction.value) return 0;
  return editQuantity.value * editingTransaction.value.price;
});

const startEdit = async (transaction) => {
  await walletStore.updateCryptoPrices();
  const crypto = walletStore.cryptocurrencies.find(c => c.name === transaction.cryptoName);
  editingTransaction.value = {
    ...transaction,
    price: crypto ? crypto.price : transaction.price
  };
  editQuantity.value = transaction.quantity;
  errorMessage.value = null; // Limpiar el mensaje de error cuando se empieza a editar
};

const saveEdit = async () => {
  // Intentar editar la transacción
  const result = await walletStore.editTransaction({
    ...editingTransaction.value,
    quantity: editQuantity.value,
    total: newTotal.value
  });

  if (result.error) {
    // Si hubo un error, mostrar el mensaje
    errorMessage.value = result.errorMessage;
  } else {
    // Si la transacción se editó con éxito, limpiar la variable de error
    editingTransaction.value = null;
  }
};

const cancelEdit = () => {
  editingTransaction.value = null;
  errorMessage.value = null; // Limpiar el mensaje de error cuando se cancela
};
</script>

<style scoped>
.transaction-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.transaction-card {
  background-color: #1e1e2f;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.transaction-card.buy {
  border-left: 5px solid #4caf50;
}

.transaction-card.sell {
  border-left: 5px solid #f44336;
}

.transaction-info h3 {
  margin: 0;
  font-size: 1.2rem;
}

.transaction-info p {
  margin: 4px 0;
}

.type-label {
  font-size: 0.9rem;
  font-weight: bold;
  opacity: 0.8;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.btn.edit {
  background-color: #4caf50;
  color: white;
}

.btn.delete {
  background-color: #f44336;
  color: white;
}

.btn:hover {
  opacity: 0.85;
}

.date-time {
  font-size: 0.85rem;
  opacity: 0.7;
}

.edit-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #3a3a5a;
  border-radius: 8px;
  color: white;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
