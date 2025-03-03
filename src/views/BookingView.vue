<template>
  <div class="container">
    <h1>Boka ett möte</h1>

    <!-- Datum & tid -->
    <input type="date" v-model="selectedDate" class="date-picker" />
    <input type="time" v-model="selectedTime" class="time-picker" />

    <!-- E-postadress -->
    <input type="email" v-model="email" placeholder="Ange din e-post" class="email-input" />

    <!-- Skicka bokningsförfrågan -->
    <button @click="requestBooking" class="button" :disabled="isLoading">
      {{ isLoading ? 'Skickar...' : 'Skicka bokningsförfrågan' }}
    </button>

    <!-- Visa status för bokning -->
    <div v-if="bookingStatus" :class="statusClass">
      <p>{{ bookingStatus }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const selectedDate = ref("");
    const selectedTime = ref("");
    const email = ref("");
    const bookingStatus = ref("");
    const isLoading = ref(false);
    
    // Dynamisk API-URL (ändra vid deploy till Vercel)
    const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    // 📨 **Skicka bokningsförfrågan**
    async function requestBooking() {
      if (!selectedDate.value || !selectedTime.value || !email.value) {
        bookingStatus.value = "❌ Vänligen fyll i alla fält.";
        return;
      }

      if (!validateEmail(email.value)) {
        bookingStatus.value = "❌ Ange en giltig e-postadress.";
        return;
      }

      isLoading.value = true;

      const roomName = `Meeting-${selectedDate.value.replace(/-/g, "")}-${selectedTime.value.replace(/:/g, "")}`;
      const meetingLink = `${window.location.origin}/video-call/${roomName}`;

      try {
        const response = await fetch(`${API_URL}/request-booking`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.value, date: selectedDate.value, time: selectedTime.value, link: meetingLink }),
        });

        const result = await response.json();

        if (result.success) {
          bookingStatus.value = "✅ Bokningen har skickats. Vänta på bekräftelse från läkaren.";
        } else {
          bookingStatus.value = "❌ Bokningsförfrågan misslyckades. Försök igen.";
        }
      } catch (error) {
        console.error("❌ Fel vid bokning:", error);
        bookingStatus.value = "⚠️ Något gick fel. Försök igen senare.";
      } finally {
        isLoading.value = false;
      }
    }

    // 🛠 **Validering av e-post**
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    return { selectedDate, selectedTime, email, bookingStatus, requestBooking, isLoading };
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.date-picker, .time-picker, .email-input {
  padding: 8px;
  margin: 10px;
  font-size: 16px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.button {
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  border: none;
  transition: background 0.3s ease-in-out;
}

.button:hover {
  background-color: #2980b9;
}

.button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

/* Statusmeddelanden */
div[statusClass] {
  margin-top: 10px;
  font-size: 16px;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
