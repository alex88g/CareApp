<template>
  <div class="container">
    <h1>Videosamtal</h1>
    <div id="jitsi-container"></div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();

    onMounted(() => {
      setTimeout(() => { 
        if (!window.JitsiMeetExternalAPI) {
          console.error("JitsiMeetExternalAPI är inte laddat! Kontrollera att du har rätt skript i index.html.");
          return;
        }

        const domain = "meet.jit.si";
        const roomName = route.params.roomName || "VardApp-VideoCall"; 

        const options = {
          roomName: roomName,
          parentNode: document.querySelector("#jitsi-container"),
          width: "100%",
          height: "500px",
        };

        new window.JitsiMeetExternalAPI(domain, options);
      }, 1000);
    });
  }
};
</script>
