let audio = null;

export const initAudio = () => {
  if (!audio) {
    audio = new Audio("/ringtone-you-would-be-glad-to-know.mp3");
  }
};

export const unlockAudio = async () => {
  if (!audio) initAudio();

  try {
    await audio.play();
    audio.pause();
    audio.currentTime = 0;

    console.log("🔓 Audio unlocked");
  } catch (err) {
    console.log("Audio unlock failed");
  }
};

export const playSound = () => {
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch(() => {});
};