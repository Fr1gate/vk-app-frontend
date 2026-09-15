import { Box, Droplet, RussianRuble, Wind, type LucideIcon } from "@lucide/vue";

export type ResourceKind = "solid" | "liquid" | "gas" | "abstract";

const KIND_ICONS: Record<ResourceKind, LucideIcon> = {
  solid: Box,
  liquid: Droplet,
  gas: Wind,
  abstract: RussianRuble,
};

/**
 * Цвета иконок по типу ресурса. Зеркалят переменные дизайна:
 * --res-solid / --res-liquid / --res-gas / --res-abstract
 */
const KIND_COLORS: Record<ResourceKind, string> = {
  solid: "#a0a3ad",
  liquid: "#5ba8e8",
  gas: "#62c9b8",
  abstract: "#f5c64a",
};

const DEFAULT_KIND_ICON = Box;
const DEFAULT_KIND_COLOR = "#a0a3ad";

export function getResourceIconComponent(kind: string): LucideIcon {
  return KIND_ICONS[kind as ResourceKind] ?? DEFAULT_KIND_ICON;
}

export function getResourceColor(kind: string): string {
  return KIND_COLORS[kind as ResourceKind] ?? DEFAULT_KIND_COLOR;
}
