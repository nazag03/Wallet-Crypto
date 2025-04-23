<template>
  <form @submit.prevent="submitForm">
    <div v-if="isRegistering">
      <input v-model="email" type="email" placeholder="email" required />

      <input v-model="password" type="password" placeholder="Password" required />
      

      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />

      <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
      <p v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</p>
    </div>

    <div v-else>
      <input v-model="userId" type="text" placeholder="User Id" required />
    </div>

    <button type="submit">{{ isRegistering ? 'Register' : 'Login' }}</button>

    <button v-if="walletStore.currentUser" type="button" @click="handleLogout" class="logout-btn">
      Log Out
    </button>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useWalletStore } from '@/store/useWalletStore';

export default {
  props: {
    isRegistering: Boolean
  },
  setup(props, { emit }) {
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const userId = ref('');

    const passwordError = ref('');
    const confirmPasswordError = ref('');

    const walletStore = useWalletStore();

    const submitForm = () => {
      // Limpiar errores
      passwordError.value = '';
      confirmPasswordError.value = '';

      if (props.isRegistering) {
        if (password.value.length < 8) {
          passwordError.value = 'The password must be at least 8 characters long.';
          return;
        }
        if (password.value !== confirmPassword.value) {
          confirmPasswordError.value = 'Passwords do not match.';
          return;
        }
      }

      emit('submitForm', {
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        userId: userId.value
      });
    };

    const handleLogout = () => {
      walletStore.logout();
      alert('Session closed successfully');
    };

    return {
      email,
      password,
      confirmPassword,
      userId,
      passwordError,
      confirmPasswordError,
      submitForm,
      handleLogout,
      walletStore
    };
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #2d3c5e;
  border-radius: 8px;
}

input {
  padding: 12px;
  border: 1px solid #f5f2f2;
  border-radius: 6px;
  background-color: transparent;
  color: #fdfdfd;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  margin-bottom:  10px;
}

input:focus {
  outline: none;
  box-shadow: 0px 0px 5px rgba(7, 2, 2, 0.7);
}

button {
  padding: 12px;
  background-color: #3c79e4;
  color: rgb(247, 247, 247);
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

button:hover {
  background-color: #255bb8;
}

.logout-btn {
  margin-top: 10px;
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
