<template>
  <div class="buildings">
    <div class="buildings__carousel">
      <button
        class="buildings__arrow-button"
        :class="{
          'buildings__arrow-button_hidden': !canPrev,
        }"
        @click="goToPrev"
      >
        <ChevronLeft color="var(--theme-accent)" />
      </button>
      <div class="embla__viewport" ref="emblaRef">
        <div class="embla__container">
          <div class="embla__slide" v-for="building in buildings" :key="building.id">
            <PlayerBaseBuildingsCard :building="building" />
          </div>
        </div>
      </div>
      <PlayerBaseBuildNew :available-buildings="availableBuildings" />
      <button
        class="buildings__arrow-button"
        :class="{
          'buildings__arrow-button_hidden': !canNext,
        }"
        @click="goToNext"
      >
        <ChevronRight color="var(--theme-accent)" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useEmblaCarousel from "embla-carousel-vue";
import type { EmblaOptionsType } from "embla-carousel";
import type { BuildingAvailable, BaseBuilding } from "@/api/generated/types";
import PlayerBaseBuildNew from "./PlayerBaseBuildingsNew.vue";
import PlayerBaseBuildingsCard from "./PlayerBaseBuildingsCard.vue";
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

interface Props {
  buildings: BaseBuilding[];
  availableBuildings: BuildingAvailable[];
}

const { buildings, availableBuildings } = defineProps<Props>();

const showCarousel = computed(() => buildings.length > 3);

const carouselOptions = computed<EmblaOptionsType>(() => ({
  slidesToScroll: 1,
  align: "start",
  watchDrag: showCarousel.value,
}));

const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions);

const goToPrev = () => emblaApi.value?.scrollPrev();
const goToNext = () => emblaApi.value?.scrollNext();

const canPrev = ref(false);
const canNext = ref(false);

function updateArrows() {
  canPrev.value = emblaApi.value?.canScrollPrev() ?? false;
  canNext.value = emblaApi.value?.canScrollNext() ?? false;
}

watch(emblaApi, (api) => {
  if (!api) return;
  updateArrows();
  api.on("select", updateArrows);
  api.on("reInit", updateArrows);
  api.on("resize", updateArrows);
});

watch([canPrev, canNext], () => nextTick(fitViewportWidth));

function fitViewportWidth() {
  const viewport = emblaRef.value;
  const slide = viewport?.querySelector<HTMLElement>(".embla__slide");
  if (!viewport || !slide) return;

  viewport.style.width = "";
  const available = viewport.clientWidth;
  const gap = parseFloat(getComputedStyle(slide).marginRight) || 0;
  const pitch = slide.offsetWidth + gap;
  if (pitch <= 0) return;

  const visible = Math.max(1, Math.min(buildings.length, Math.floor((available + gap) / pitch)));
  viewport.style.width = `${visible * pitch - gap}px`;
}

onMounted(() => {
  fitViewportWidth();
  window.addEventListener("resize", fitViewportWidth);
});

onUnmounted(() => window.removeEventListener("resize", fitViewportWidth));

watch(
  () => buildings.length,
  () => nextTick(fitViewportWidth),
);
</script>

<style lang="scss" scoped>
.buildings {
  display: flex;
  justify-content: center;
  width: 100vw;
  overflow: hidden;
  padding-inline: 0.25rem;
  padding-bottom: 0.25rem;

  &__carousel {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 0.5rem;
  }

  &__arrow-button {
    box-sizing: border-box;
    flex-shrink: 0;
    width: 2.75rem;
    height: 2.75rem;
    background: var(--theme-nav-fill);
    border: 1px solid var(--theme-stroke);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    &_hidden {
      opacity: 0;
    }
  }
}

.embla__viewport {
  overflow: hidden;
}

.embla__container {
  display: flex;
  touch-action: pan-y pinch-zoom;
}

.embla__slide {
  display: flex;
  min-width: 0;
  flex: 0 0 12.25rem;
  margin-right: 0.5rem;

  &:last-child {
    margin-right: 0;
  }
}

@media (min-height: 450px) {
  .embla__slide {
    flex: 0 0 9.5rem;
    margin-right: 1rem;
  }
}
</style>
