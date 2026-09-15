import {
  Boxes,
  Building2,
  Factory,
  FlaskConical,
  GraduationCap,
  Pickaxe,
  Rocket,
  Shield,
  Telescope,
  Warehouse,
  Wrench,
  Zap,
  type LucideIcon,
} from "@lucide/vue";

export type BuildingKind =
  | "ACADEMY"
  | "ADMIN"
  | "SHIPYARD"
  | "PROCESSOR"
  | "STORAGE"
  | "EXTRACTOR"
  | "LAUNCH_PLATFORM"
  | "MODULES_FACTORY"
  | "OBSERVATORY"
  | "DEFENSE"
  | "POWER"
  | "LAB";

const KIND_ICONS: Record<BuildingKind, LucideIcon> = {
  ADMIN: Building2,
  PROCESSOR: Factory,
  EXTRACTOR: Pickaxe,
  POWER: Zap,
  STORAGE: Warehouse,
  SHIPYARD: Wrench,
  LAUNCH_PLATFORM: Rocket,
  MODULES_FACTORY: Boxes,
  OBSERVATORY: Telescope,
  LAB: FlaskConical,
  ACADEMY: GraduationCap,
  DEFENSE: Shield,
};

const DEFAULT_KIND_ICON = Building2;

export function getBuildingIconComponent(kind: string): LucideIcon {
  return KIND_ICONS[kind as BuildingKind] ?? DEFAULT_KIND_ICON;
}
