const portraits = import.meta.glob("/src/assets/buildings/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const DEFAULT_PORTRAIT = "/src/assets/buildings/bld_default.webp";

export function getBuildingPortrait(buildingId: string): string {
  return (
    portraits[`/src/assets/buildings/${buildingId}.webp`] ??
    portraits[DEFAULT_PORTRAIT] ??
    ""
  );
}
