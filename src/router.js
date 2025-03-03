// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Video from './views/Video.vue';
import DoctorView from './views/DoctorView.vue';
import BookingView from './views/BookingView.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/video-call/:roomName', component: Video },
  { path: '/doctor', component: DoctorView },
  { path: '/bookings', component: BookingView } // Ny bokningsvy
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;