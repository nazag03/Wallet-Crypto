<template>
    <div class="sell-crypto">
      <h2>Vender {{ selectedCrypto }}</h2>
      <p>Current price: ${{ cryptoPrice }}</p>
      <p>Available balance: {{ userCryptoBalance }} {{ selectedCrypto }}</p>
      <input v-model.number="amount" type="number" placeholder="Quantity to sell" min="0.01" step="0.01" />
      <button @click="sell">Sell</button>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useWalletStore } from '../store/useWalletStore';
  
  export default {
    props: {
      selectedCrypto: String,
      cryptoPrice: Number
    },
    setup(props) {
      const store = useWalletStore();
      const amount = ref(0);
      const message = ref('');
  
      const userCryptoBalance = computed(() => store.cryptoHoldings[props.selectedCrypto] || 0);
  
      const sell = () => {
        if (amount.value > 0 && userCryptoBalance.value >= amount.value) {
          store.sellCrypto(props.selectedCrypto, amount.value, props.cryptoPrice);
          message.value = `Sale made: ${amount.value} ${props.selectedCrypto}`;
        } else {
          message.value = "Insufficient or invalid quantity";
        }
      };
  
      return { amount, sell, message, userCryptoBalance };
    }
  };
  </script>
  
  <style scoped>
  .sell-crypto {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .message {
    color: red;
  }
  </style>
  