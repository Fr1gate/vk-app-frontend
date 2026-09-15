import { ref, shallowRef, type Ref } from "vue";

export interface StaticDataLoader<T> {
  data: Ref<T | null>;
  isLoading: Ref<boolean>;
  loadData: () => Promise<T | null>;
}

export function useStaticDataLoader<T>(loader: () => Promise<T>): StaticDataLoader<T> {
  const data = shallowRef<T | null>(null);
  const isLoading = ref(false);
  let inflight: Promise<T | null> | null = null;

  async function loadData(): Promise<T | null> {
    if (data.value !== null) return data.value;
    if (inflight) return inflight;

    isLoading.value = true;
    inflight = loader()
      .then((result) => {
        data.value = result;
        return result;
      })
      .catch(() => null)
      .finally(() => {
        isLoading.value = false;
        inflight = null;
      });

    return inflight;
  }

  return { data, isLoading, loadData };
}
