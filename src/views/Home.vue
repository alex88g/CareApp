<template>
  <div class="container">
    <h1>Välkommen till vårdappen</h1>
    
    <!-- Starta ett nytt rum -->
    <button @click="createRoom" class="button">Starta videosamtal</button>

    <!-- Ange ett rums ID för att gå med -->
    <input v-model="roomName" placeholder="Ange rumskod" />
    <button @click="joinRoom" class="button">Gå med</button>

    <!-- Visa och kopiera länken till mötet -->
    <div v-if="roomLink">
      <p>Kopiera länken och skicka till din vän:</p>
      <input type="text" :value="roomLink" readonly @click="copyLink" />
      <p v-if="copied">Länk kopierad!</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const roomName = ref('');
    const roomLink = ref('');
    const copied = ref(false);

    // Skapa ett unikt rums ID och generera en länk
    function createRoom() {
      const randomRoom = "VardApp-" + Math.random().toString(36).substr(2, 9);
      // Använd den externa URL en i stället för localhost
      roomLink.value = `${window.location.origin}/video-call/${randomRoom}`;
      router.push(`/video-call/${randomRoom}`);
    }

    // Användare anger ett rum och går med
    function joinRoom() {
      if (roomName.value.trim() !== "") {
        router.push(`/video-call/${roomName.value}`);
      }
    }

    // Kopiera rums länken till urklipp
    function copyLink() {
      navigator.clipboard.writeText(roomLink.value);
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000); // Visa Länk kopierad! i 2 sekunder
    }

    return { roomName, roomLink, copied, createRoom, joinRoom, copyLink };
  },
};
</script>
