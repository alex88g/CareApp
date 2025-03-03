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

    // Funktion för att ladda Jitsi API om det inte redan finns
    function loadJitsiScript() {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    onMounted(async () => {
      try {
        await loadJitsiScript(); // Se till att API:t laddas in
        if (!window.JitsiMeetExternalAPI) {
          console.error("JitsiMeetExternalAPI kunde inte laddas.");
          return;
        }

        const domain = "meet.jit.si";
        const roomName = route.params.roomName || "VardApp-VideoCall"; 

        const options = {
          roomName: roomName,
          parentNode: document.querySelector("#jitsi-container"),
          width: "100%",
          height: "500px",
          configOverwrite: {
            startWithAudioMuted: true, // Starta utan ljud
            startWithVideoMuted: false, // Video aktiverad från start
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false, // Dölj Jitsi-loggan
            TOOLBAR_BUTTONS: ["microphone", "camera", "chat", "hangup"], // Anpassa verktygsfält
          },
        };

        new window.JitsiMeetExternalAPI(domain, options);
      } catch (error) {
        console.error("Fel vid laddning av Jitsi API:", error);
      }
    });
  }
};
</script>

<style>
.container {
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 24px;
  color: #2c3e50;
}

#jitsi-container {
  width: 100%;
  height: 500px;
  background: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
</style>
