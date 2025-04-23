<template>
  <div class="login-container">
    <h1>Welcome to CryptoWallet</h1>
    <h2>{{ isRegistering ? 'Create account' : 'Login' }}</h2>
    <LoginForm :isRegistering="isRegistering" @submitForm="handleSubmit" />

    <p @click="toggleMode" class="toggle">
      {{ isRegistering ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up' }}
    </p>
    
    <Modal
      v-if="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @close="showModal = false"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from '@/components/LoginForm.vue';
import Modal from '@/components/Modal.vue';
import { useWalletStore } from '@/store/useWalletStore';

export default {
  components: {
    LoginForm,
    Modal, 
  },

  setup() {
    const router = useRouter();
    const isRegistering = ref(false);
    const walletStore = useWalletStore();

    const showModal = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');

    const handleSubmit = (data) => {
      if (isRegistering.value) {
        if (data.password !== data.confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        const newUserId = crypto.randomUUID();
        const user = { email: data.email, password: data.password, userId: newUserId };
        localStorage.setItem(newUserId, JSON.stringify(user));
        
        modalTitle.value = 'successful registration';
        modalMessage.value = `Your ID: ${newUserId}`;
        showModal.value = true;

        isRegistering.value = false;
      } else {
        const storedUser = localStorage.getItem(data.userId);
        if (storedUser) {
          walletStore.setUser(data.userId);
          walletStore.loadUserData();
          router.push('/trade');
        } else {
          alert('ID not valid');
        }
      }
    };

    const handleLogout = () => {
      walletStore.logout();
      router.push('/login');
    };

    const toggleMode = () => {
      isRegistering.value = !isRegistering.value;
    };

    return {
      isRegistering,
      handleSubmit,
      toggleMode,
      handleLogout,
      walletStore,
      showModal,
      modalTitle,
      modalMessage,
    };
  }
};
</script>

<style scoped>
h1 {
  font-style: italic;
}
h2 {
  font-size: large;
}
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 30px;
  background-color: #25314f;
  border-radius: 10px;
  text-align: center;
}

h2 {
  color: #9adeff;
  margin-bottom: 20px;
}

.toggle {
  color: #fafafa;
  cursor: pointer;
  font-size: 14px;
  margin-top: 15px;
  transition: color 0.3s ease-in-out;
}

.toggle:hover {
  color: #e6e6e6;
}
</style>
