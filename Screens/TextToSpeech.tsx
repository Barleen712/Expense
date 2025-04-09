import Tts from "react-native-tts";
export const initializeTtsListeners = async () => {
  Tts.getInitStatus().then(
    (e) => {
      console.log("ALL OK TTS ✅");
    },
    (err) => {
      if (err.code === "no_engine") {
        console.log("NO ENGINE TTS ✅");
        Tts.requestInstallEngine();
      }
    }
  );
  Tts.setDefaultRate(0.3, true);
  Tts.setIgnoreSilentSwitch("ignore");
  Tts.setDefaultPitch(0.7);
  Tts.addEventListener("tts-start", (event) => {
    console.log("TTS Started: ", event);
  });
  Tts.addEventListener("tts-progress", (event) => {
    console.log("TTS progress: ", event);
  });
  Tts.addEventListener("tts-finish", (event) => {
    console.log("TTS finished: ", event);
  });
  Tts.addEventListener("tts-finish", (event) => {
    console.log("TTS finished: ", event);
  });
};
export const playTTS = async (message) => {
  // Ensure TTS is initialized before speaking
  //   Tts.getInitStatus().then(
  //     (e) => {
  //       console.log("ALL OK TTS ✅"); // TTS is initialized successfully
  //     },
  //     (err) => {
  //       // If there is no TTS engine installed, request to install one
  //       if (err.code === "no_engine") {
  //         console.log("NO ENGINE TTS ✅");
  //         Tts.requestInstallEngine();
  //       }
  //     }
  //   );

  // Use TTS to speak the provided message
  Tts.speak(message);
};
