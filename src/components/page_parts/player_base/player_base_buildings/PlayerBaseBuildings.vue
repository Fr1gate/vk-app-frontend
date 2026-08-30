<template>
  <div class="buildings">
    <div class="buildings__carousel">
      <button v-show="showCarousel" class="buildings__arrow-button" @click="goToPrev">
        <ChevronLeft :size="18" color="var(--theme-accent)" />
      </button>
      <div class="embla__viewport" ref="emblaRef">
        <div class="embla__container">
          <div class="embla__slide" v-for="building in buildings" :key="building.name">
            <PlayerBaseBuildingsCard :building="building" />
          </div>
        </div>
      </div>
      <button v-show="showCarousel" class="buildings__arrow-button" @click="goToNext">
        <ChevronRight :size="18" color="var(--theme-accent)" />
      </button>
    </div>
    <PlayerBaseBuildNew :available-buildings="availableBuildings" />
  </div>
</template>

<script lang="ts" setup>
import useEmblaCarousel from "embla-carousel-vue";
import type { EmblaOptionsType } from "embla-carousel";
import type { BuildingAvailable, BaseBuilding } from "@/api/generated/types";
import PlayerBaseBuildNew from "./PlayerBaseBuildingsNew.vue";
import PlayerBaseBuildingsCard from "./PlayerBaseBuildingsCard.vue";
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { computed } from "vue";

interface Props {
  buildings: BaseBuilding[];
  availableBuildings: BuildingAvailable[];
}

const { buildings, availableBuildings } = defineProps<Props>();

const carouselOptions = computed<EmblaOptionsType>(() => ({
  dragFree: true,
  slidesToScroll: 1,
  align: "start",
  watchDrag: showCarousel.value,
}));

const showCarousel = computed(() => {
  return buildings.length > 5;
});

const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions);

const goToPrev = () => emblaApi.value!.scrollPrev();
const goToNext = () => emblaApi.value!.scrollNext();
</script>

<style lang="scss" scoped>
.buildings {
  display: flex;
  justify-content: center;
  width: 100vw;
  overflow: hidden;
  padding-inline: 4px;
  gap: 8px;
  padding-bottom: 4px;

  &__carousel {
    display: flex;

    min-width: 0;
    align-items: center;
    gap: 8px;
  }

  &__arrow-button {
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    background: var(--theme-nav-fill);
    border: 1px solid var(--theme-stroke);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
  }

  --slide-size: 100%;
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
  margin-right: 12px;
  flex-basis: 140px;
  flex-grow: 0;
  flex-shrink: 0;

  &:last-child {
    margin-right: 0;
  }
}
</style>
