<template>
    <div class="container">
      <h1>Bokningshantering</h1>
  
      <!-- Laddningsindikator -->
      <p v-if="isLoading">🔄 Laddar bokningar...</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  
      <ul v-if="bookings.length">
        <li v-for="booking in bookings" :key="booking.id">
          <p>{{ booking.date }} kl. {{ booking.time }} - {{ booking.email }}</p>
          <button @click="confirmBooking(booking)" v-if="!booking.confirmed" :disabled="isConfirming">
            {{ isConfirming ? "Bekräftar..." : "Bekräfta möte" }}
          </button>
          <p v-else class="confirmed">✅ Bekräftat</p>
        </li>
      </ul>
  
      <p v-else-if="!isLoading && !errorMessage">Inga bokningar tillgängliga.</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  
  export default {
    setup() {
      const bookings = ref([]);
      const isLoading = ref(false);
      const isConfirming = ref(false);
      const errorMessage = ref("");
  
      // Dynamisk backend-URL för Vercel
      const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  
      // 🔄 **Hämta alla bokningar**
      async function fetchBookings() {
        isLoading.value = true;
        errorMessage.value = "";
  
        try {
          const response = await fetch(`${API_URL}/get-bookings`);
          if (!response.ok) throw new Error("Kunde inte hämta bokningar.");
          bookings.value = await response.json();
        } catch (error) {
          errorMessage.value = "❌ Fel vid hämtning av bokningar.";
          console.error(error);
        } finally {
          isLoading.value = false;
        }
      }
  
      // ✅ **Bekräfta bokning**
      async function confirmBooking(booking) {
        isConfirming.value = true;
  
        try {
          const response = await fetch(`${API_URL}/confirm-booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: booking.email,
              date: booking.date,
              time: booking.time,
              link: booking.link,
            }),
          });
  
          const result = await response.json();
          if (result.success) {
            alert("✅ Mötet har bekräftats och e-post har skickats till patienten!");
            fetchBookings(); // Uppdatera listan
          } else {
            alert("❌ Misslyckades med att bekräfta mötet.");
          }
        } catch (error) {
          console.error("❌ Fel vid bekräftelse:", error);
        } finally {
          isConfirming.value = false;
        }
      }
  
      onMounted(fetchBookings);
      return { bookings, isLoading, isConfirming, errorMessage, confirmBooking };
    },
  };
  </script>
  
  <style>
  .container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  button {
    margin-top: 10px;
    padding: 10px;
    background-color: #2ecc71;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    font-size: 16px;
    font-weight: bold;
    transition: background 0.3s ease-in-out;
  }
  
  button:hover {
    background-color: #27ae60;
  }
  
  button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
  
  p {
    font-size: 16px;
  }
  
  .error {
    color: red;
    font-weight: bold;
  }
  
  .confirmed {
    color: green;
    font-weight: bold;
  }
  </style>
  