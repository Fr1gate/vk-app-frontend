<template>
  <div class="space-map">
    <div ref="canvasHost" class="space-map__canvas"></div>
    <div class="space-map__controls">
      <UISearch :items="searchItems" placeholder="Найти объект" @select="handleSelect" />
      <SpaceTimeControl />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SVG, type Svg, type Text as SvgText } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.panzoom.js";
import { getPlanetOrbitalState } from "./astronomy";
import { PLANETS, SUN, type PlanetId } from "./planets";
import SpaceTimeControl from "./SpaceTimeControl.vue";
import { useSpaceTime } from "./spaceTime";
import UISearch from "@/components/ui/UISearch.vue";
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue";

const AU_TO_PX = 320;
const PLANET_ICON_SIZE = 44;
const SUN_ICON_SIZE = 120;
const PLANET_LABEL_OFFSET = 12;
const SUN_LABEL_OFFSET = 72;

const { gameTime } = useSpaceTime();

const canvasHost = useTemplateRef("canvasHost");
const searchItems = [
  { id: SUN.id, label: SUN.name },
  ...PLANETS.map((planet) => ({ id: planet.id, label: planet.name })),
];

const center = { x: 0, y: 0 };
const planetElements = new Map<PlanetId, { icon: Svg; label: SvgText }>();
const coordinates = new Map<string, { x: number; y: number }>();

let canvas: Svg | null = null;
let sunElement: Svg | null = null;
let sunLabel: SvgText | null = null;
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  const host = canvasHost.value;
  if (!host) return;

  canvas = SVG().addTo(host);
  canvas.panZoom({ zoomMin: 0.05, zoomMax: 4, zoomFactor: 0.1 });

  resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
    updatePositions();
  });
  resizeObserver.observe(host);

  resizeCanvas();
  renderSun();
  renderPlanets();
  updatePositions();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  canvas?.remove();
  canvas = null;
  planetElements.clear();
  coordinates.clear();
});

watch(gameTime, updatePositions);

function resizeCanvas() {
  const host = canvasHost.value;
  if (!host || !canvas) return;

  const { width, height } = host.getBoundingClientRect();
  const mapWidth = Math.max(1, width);
  const mapHeight = Math.max(1, height);

  canvas.size(mapWidth, mapHeight);
  canvas.viewbox(0, 0, mapWidth, mapHeight);

  center.x = mapWidth / 2;
  center.y = mapHeight / 2;

  sunElement?.center(center.x, center.y);
  if (sunLabel) {
    sunLabel.cx(center.x).y(center.y + SUN_LABEL_OFFSET);
  }
}

function renderSun() {
  if (!canvas) return;

  sunElement = canvas
    .nested()
    .svg(`<image href="${SUN.icon}" width="${SUN_ICON_SIZE}" height="${SUN_ICON_SIZE}"/>`)
    .size(SUN_ICON_SIZE, SUN_ICON_SIZE)
    .center(center.x, center.y)
    .addClass("space-map__sun");

  sunLabel = canvas.text(SUN.name).addClass("space-map__label space-map__label_sun");
  sunLabel.cx(center.x).y(center.y + SUN_LABEL_OFFSET);
}

function renderPlanets() {
  if (!canvas) return;

  for (const planet of PLANETS) {
    const icon = canvas
      .nested()
      .svg(`<image href="${planet.icon}" width="${PLANET_ICON_SIZE}" height="${PLANET_ICON_SIZE}"/>`)
      .size(PLANET_ICON_SIZE, PLANET_ICON_SIZE)
      .addClass("space-map__planet");

    const label = canvas.text(planet.name).addClass("space-map__label");

    planetElements.set(planet.id, { icon, label });
  }
}

function updatePositions() {
  if (!canvas) return;

  for (const planet of PLANETS) {
    const elements = planetElements.get(planet.id);
    if (!elements) continue;

    const { x, y } = getPlanetPosition(planet.id, gameTime.value);
    elements.icon.center(x, y);
    elements.label.cx(x).y(y + PLANET_ICON_SIZE / 2 + PLANET_LABEL_OFFSET);
    coordinates.set(planet.id, { x, y });
  }

  coordinates.set(SUN.id, { x: center.x, y: center.y });
}

function getPlanetPosition(planetId: PlanetId, atSeconds: number): { x: number; y: number } {
  const { longitudeDeg, radiusAu } = getPlanetOrbitalState(planetId, atSeconds);
  const radians = (longitudeDeg * Math.PI) / 180;
  const radius = radiusAu * AU_TO_PX;

  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y - radius * Math.sin(radians),
  };
}

function handleSelect(id: string) {
  const target = coordinates.get(id);
  if (!target || !canvas || !canvasHost.value) return;

  const { width, height } = canvasHost.value.getBoundingClientRect();
  canvas.viewbox(target.x - width / 2, target.y - height / 2, width, height);
}
</script>

<style lang="scss" scoped>
.space-map {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  background: #05070d;

  &__canvas {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(#05070d66, #05070d99),
      url("@/assets/space/milky_way.jpg") center / cover;
    cursor: grab;
  }

  &__controls {
    position: absolute;
    top: 6rem;
    left: 0;
    right: 0;
    z-index: 2;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem;
    pointer-events: none;

    > * {
      pointer-events: auto;
    }
  }

  :deep(.space-map__label) {
    fill: var(--font-primary);
    font-family: var(--font-family);
    font-size: 0.875rem;
    font-weight: 500;
    text-anchor: middle;
    paint-order: stroke;
    stroke: #05070dcc;
    stroke-width: 0.25rem;
    stroke-linejoin: round;
    user-select: none;
    pointer-events: none;
  }

  :deep(.space-map__label_sun) {
    font-size: 1rem;
    font-weight: 600;
  }

  :deep(.space-map__sun),
  :deep(.space-map__planet) {
    overflow: visible;
    pointer-events: none;
  }
}
</style>
