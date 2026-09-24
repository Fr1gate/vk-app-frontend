import { api } from "@/api";
import type { TechnologiesResponse, Technology } from "@/api/generated/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { flattenDeep } from "lodash-es";

export const useResearchStore = defineStore("researchStore", () => {
  const researchData = ref<TechnologiesResponse | null>(null);
  const isLoading = ref<boolean>(false);
  const loadedInitially = ref<boolean>(false);

  function loadData() {
    isLoading.value = true;

    return api.technologies.technologiesList().then(({ data }) => {
      researchData.value = data;
      isLoading.value = false;
      loadedInitially.value = true;
    });
  }

  function formTree() {
    // one row = one branch
    // technology has to be after its requirements. Arrows cannot go backwards

    if (!researchData.value) return;

    // {branch_id: {pointer: tech}}
    const techTree: Record<string, Record<number, Technology>> = {};
    const placedTechsPointers: Record<string, number> = {};
    const techIdOnTechMap: Record<string, Technology> = {};
    researchData.value.technologies.forEach((tech) => {
      techIdOnTechMap[tech.id] = tech;
    });

    // init techTree structure
    for (const branch of researchData.value.branches) {
      techTree[branch.id] = {};
    }

    for (const currentTech of researchData.value.technologies) {
      placeTech(currentTech.id);
    }

    function placeTech(techId: string): number {
      if (placedTechsPointers[techId]) return placedTechsPointers[techId];

      const tech = techIdOnTechMap[techId]!;

      if (!tech.prerequisites) {
        //first tech in branch, no prerequisites
        placedTechsPointers[tech.id] = 1;
        techTree[tech.branch_id]![1] = tech;
        return 1;
      } else {
        let maxPointer = 1;
        for (const dep of flattenDeep(tech.prerequisites)) {
          // check if dep is placed
          if (placedTechsPointers[dep]) {
            maxPointer = Math.max(placedTechsPointers[dep], maxPointer);
          } else {
            const pointer = placeTech(dep);
            maxPointer = Math.max(pointer, maxPointer);
          }
        }

        const resolvedPointer = maxPointer + 1;
        placedTechsPointers[tech.id] = resolvedPointer;
        techTree[tech.branch_id]![resolvedPointer] = tech;
        return resolvedPointer;
      }
    }

    return techTree;
  }

  return {
    loadData,
    formTree,
    researchData,
  };
});
