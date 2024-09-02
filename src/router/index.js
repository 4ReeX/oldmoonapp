import { createRouter, createWebHistory } from 'vue-router';

// Импорт компонентов для каждой страницы
import Home from '../views/Home.vue';
import Stocks from '../views/Stocks.vue';
import Materials from '../views/Materials.vue';
import Supply from '../views/Supply.vue';
import Cards from '../views/Cards.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/stocks', name: 'Stocks', component: Stocks },
    { path: '/materials', name: 'Materials', component: Materials },
    { path: '/supply', name: 'Supply', component: Supply },
    { path: '/cards', name: 'Cards', component: Cards },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
