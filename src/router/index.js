import { createRouter, createWebHistory } from 'vue-router';
import { useWalletStore } from '@/store/useWalletStore'; 
import LoginView from '@/views/LoginView.vue';
import TradeView from '@/views/TradeView.vue';
import HistoryView from '@/views/HistoryView.vue';
import AnalysisView from '@/views/AnalysisView.vue';

const routes = [
  { path: '/', component: LoginView },
  { path: '/trade', component: TradeView, meta: { requiresAuth: true } },
  { path: '/history', component: HistoryView, meta: { requiresAuth: true } },
  { path: '/analysis', component: AnalysisView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const store = useWalletStore(); 
  store.loadUserData();
  console.log("Verificando Usuario:", store.currentUser); 

  if (to.meta.requiresAuth && !store.currentUser) {
    console.warn("Acceso denegado. Redirigiendo al login...");
    next('/'); 
  } else {
    next(); 
  }
});

export default router;
