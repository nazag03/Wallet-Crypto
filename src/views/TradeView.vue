<template>
  <div class="trade-view">
    <h1>Buying and selling cryptos</h1>

    <p>Available balance: ${{ balance }} USD</p>

    <div v-if="loading">Loading prices...</div>
    <div v-else class="crypto-list">
      <div v-for="crypto in cryptos" :key="crypto.id" class="crypto-item">
        <h2>{{ crypto.name }} ({{ crypto.id }})</h2>
        <p>Current price: ${{ crypto.price }}</p>

        <button @click="openTrade(crypto, 'buy')">Buy</button>
        <button @click="openTrade(crypto, 'sell')" :disabled="crypto.quantity <= 0">Sell</button>

        <p v-if="crypto.quantity > 0">Portfolio amount: {{ crypto.quantity }} {{ crypto.id }}</p>
      </div>
    </div>

    
    <div class="chart-section">
      <h2>📊 Crypto Price</h2>
      <CryptoChart title="Bitcoin (BTC)" :dataPoints="[30000, 31200, 31000, 30200, 31500, 32000]" />
      <CryptoChart title="Ethereum (ETH)" :dataPoints="[2000, 2050, 2100, 2080, 2120, 2150]" />
    </div>

    
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ selectedAction === 'buy' ? 'Comprar' : 'Vender' }} {{ selectedCrypto.name }}</h2>
        <p>Price: ${{ selectedCrypto.price }}</p>

        <input v-model="selectedQuantity" type="number" min="0.01" step="0.01" placeholder="Enter quantity" />
        <p><strong>Total:</strong> ${{ calculatedTotal.toFixed(2) }}</p>

        <div class="modal-buttons">
          <button @click="confirmTrade">Save</button>
          <button @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useWalletStore } from '@/store/useWalletStore';
import { fetchCryptoPrices } from '@/api/cryptoApi';
import CryptoChart from '@/components/CryptoChart.vue';

export default {
  components: {
    CryptoChart
  },
  setup() {
    const walletStore = useWalletStore();

    const cryptos = ref([
      { id: 'BTC', name: 'Bitcoin', price: 0, quantity: 0 },
      { id: 'ETH', name: 'Ethereum', price: 0, quantity: 0 },
      { id: 'XRP', name: 'Ripple', price: 0, quantity: 0 },
      { id: 'LTC', name: 'Litecoin', price: 0, quantity: 0 }
    ]);

    const loading = ref(true);
    const balance = computed(() => walletStore.balance);

    const showModal = ref(false);
    const selectedCrypto = ref({});
    const selectedAction = ref('');
    const selectedQuantity = ref(0);

    const calculatedTotal = computed(() => {
      return parseFloat(selectedQuantity.value) * selectedCrypto.value.price || 0;
    });

    const fetchPrices = async () => {
      try {
        const prices = await fetchCryptoPrices();
        cryptos.value.forEach(crypto => {
          crypto.price = prices[crypto.id.toLowerCase()] || 0;
          const storedCrypto = walletStore.cryptocurrencies.find(c => c.id === crypto.id);
          if (storedCrypto) {
            crypto.quantity = storedCrypto.quantity;
          }
        });
        loading.value = false;
      } catch (error) {
        console.error('Error getting prices', error);
      }
    };

    onMounted(fetchPrices);

    const openTrade = (crypto, action) => {
      selectedCrypto.value = crypto;
      selectedAction.value = action;
      selectedQuantity.value = 0;
      showModal.value = true;
    };

    const confirmTrade = () => {
      const quantity = parseFloat(selectedQuantity.value);
      if (isNaN(quantity) || quantity <= 0) {
        alert('Invalid amount');
        return;
      }

      const total = quantity * selectedCrypto.value.price;

      if (selectedAction.value === 'buy' && total > balance.value) {
        alert('Insufficient balance');
        return;
      }

      if (selectedAction.value === 'sell') {
        const storedCrypto = walletStore.cryptocurrencies.find(c => c.id === selectedCrypto.value.id);
        if (!storedCrypto || storedCrypto.quantity < quantity) {
          alert('You dont have enough cryptocurrency to sell.');
          return;
        }
      }

      walletStore.addTransaction({
        type: selectedAction.value,
        cryptoId: selectedCrypto.value.id,
        quantity,
        total
      });

      showModal.value = false;
      fetchPrices();
    };

    return {
      cryptos,
      loading,
      balance,
      showModal,
      selectedCrypto,
      selectedAction,
      selectedQuantity,
      openTrade,
      confirmTrade,
      calculatedTotal
    };
  }
};
</script>

<style scoped>
.trade-view {
  text-align: center;
}
.crypto-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.crypto-item {
  border: 1px solid #c9c9c981;
  background-color: #576283;
  padding: 15px;
  margin: 15px;
  border-radius: 10px;
}
.chart-section {
  margin-top: 40px;
  padding: 0px;
  background: #1f1f2f;
  border-radius: 10px;
  color: rgb(245, 245, 245);
  margin: 50px;
}
button {
  background-color: #475272;
  color: rgb(223, 223, 223);
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(104, 104, 104, 0.301);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: rgb(98, 115, 146);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
.modal-buttons {
  margin-top: 10px;
}
.modal-buttons button {
  margin: 5px;
}
</style>
