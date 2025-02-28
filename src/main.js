import { createApp } from 'vue';
import './style.css'; // 🔥 Importera CSS-filen
import './index.css'; // Se till att denna fil existerar

import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
