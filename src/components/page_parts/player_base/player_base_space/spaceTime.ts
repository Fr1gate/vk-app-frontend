import { readonly, ref } from "vue";

export const SPEED_PRESETS = [0.5, 1, 2, 10, 100] as const;

const GAME_SECONDS_PER_DAY = 86_400;

const gameTime = ref(Math.floor(Date.now() / 1000));
const multiplier = ref<number>(1);
const isPlaying = ref(false);

let frameId: number | undefined;
let lastFrameAt = 0;

function loop(frameAt: number) {
  const deltaSeconds = (frameAt - lastFrameAt) / 1000;
  lastFrameAt = frameAt;

  if (!isPlaying.value) {
    frameId = undefined;
    return;
  }

  gameTime.value += deltaSeconds * GAME_SECONDS_PER_DAY * multiplier.value;
  frameId = requestAnimationFrame(loop);
}

function ensureLoop() {
  if (frameId !== undefined) return;
  lastFrameAt = performance.now();
  frameId = requestAnimationFrame(loop);
}

function play() {
  ensureLoop();
  lastFrameAt = performance.now();
  isPlaying.value = true;
}

function pause() {
  isPlaying.value = false;
}

function toggle() {
  if (isPlaying.value) pause();
  else play();
}

function setMultiplier(value: number) {
  multiplier.value = value;
}

function setGameTime(seconds: number) {
  gameTime.value = Math.floor(seconds);
}

export function useSpaceTime() {
  return {
    gameTime: readonly(gameTime),
    isPlaying: readonly(isPlaying),
    multiplier: readonly(multiplier),
    play,
    pause,
    toggle,
    setMultiplier,
    setGameTime,
  };
}
