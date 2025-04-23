<script>
import { ref } from 'vue';
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

    const buy = () => {
      const total = amount.value * props.cryptoPrice;

      if (amount.value > 0 && store.balance >= total) {
        store.addTransaction({
          type: 'buy',
          cryptoId: props.selectedCrypto,
          quantity: amount.value,
          total: total
        });
        message.value = `Purchase made: ${amount.value} ${props.selectedCrypto}`;
        amount.value = 0; 
      } else {
        message.value = "Insufficient funds or invalid amount";
      }
    };

    return { amount, buy, message };
  }
};
</script>
