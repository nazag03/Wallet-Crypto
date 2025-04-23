<template>
  <div class="history-container">
    <h1>Transaction History</h1>

    <div v-if="walletStore.transactions.length === 0">
      <p>have not made transactions</p>
    </div>

    <div v-else class="transactions-list">
      <TransactionHistory
        :transactions="walletStore.transactions"
        @transactionSelected="selectTransaction"
      />
    </div>

    <TransactionDetails
      v-if="selectedTransaction"
      :transaction="selectedTransaction"
      @editTransaction="editTransaction"
      @deleteTransaction="deleteTransaction"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useWalletStore } from '@/store/useWalletStore';
import TransactionDetails from '@/components/TransactionDetails.vue';
import TransactionHistory from '@/components/TransactionHistory.vue';

const walletStore = useWalletStore();
const selectedTransaction = ref(null);


const selectTransaction = (transaction) => {
  selectedTransaction.value = transaction;
};


const editTransaction = (transaction) => {
  walletStore.editTransaction(transaction);
  selectedTransaction.value = null; 
};


const deleteTransaction = (transaction) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    walletStore.removeTransaction(transaction.transactionId); 
    selectedTransaction.value = null; 
  }
};
</script>

<style scoped>
.history-container {
  padding: 20px;
}
.transactions-list {
  margin-bottom: 20px;
}
</style>
