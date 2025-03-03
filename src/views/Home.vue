// src/views/Home.vue
<script setup>
import bookingImage from '../assets/booking.svg';
import videoCallImage from '../assets/video-call.svg';
</script>

<template>
  <div class="home-container">
    <header class="header">
      <h1>Vårdappen - Träffa din läkare online</h1>
      <p>Boka videosamtal med en läkare enkelt och smidigt.</p>
      <div class="nav-buttons">
        <router-link to="/bookings" class="button">Boka Tid</router-link>
        <router-link to="/doctor" class="button secondary">Läkarens Profil</router-link>
      </div>
    </header>

    <section class="features">
      <div class="feature">
        <img :src="bookingImage" alt="Boka tid">
        <h2>Snabb och säker bokning</h2>
        <p>Boka ett möte med några få klick.</p>
      </div>
      <div class="feature">
        <img :src="videoCallImage" alt="Videosamtal">
        <h2>Träffa läkare online</h2>
        <p>Gör ditt möte var du än är.</p>
      </div>
    </section>
  </div>
</template>

<style>
.home-container {
  text-align: center;
  padding: 40px;
}

.header {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.nav-buttons {
  margin-top: 20px;
}

.button {
  display: inline-block;
  padding: 14px 24px;
  margin: 10px;
  background-color: #2ecc71;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-size: 18px;
  transition: background 0.3s ease-in-out;
}

.button:hover {
  background-color: #27ae60;
}

.button.secondary {
  background-color: #e67e22;
}

.features {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  flex-wrap: wrap;
}

.feature {
  width: 45%;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.feature:hover {
  transform: scale(1.05);
}

.feature img {
  width: 80px;
  margin-bottom: 10px;
}
</style>