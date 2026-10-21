import MercuryIcon from "@/assets/space/planets/MercuryIcon.png";
import VenusIcon from "@/assets/space/planets/VenusIcon.png";
import EarthIcon from "@/assets/space/planets/EarthIcon.png";
import MarsIcon from "@/assets/space/planets/MarsIcon.png";
import JupiterIcon from "@/assets/space/planets/JupiterIcon.png";
import SaturnIcon from "@/assets/space/planets/SaturnIcon.png";
import UranusIcon from "@/assets/space/planets/UranusIcon.png";
import NeptuneIcon from "@/assets/space/planets/NeptuneIcon.png";
import SunIcon from "@/assets/space/planets/SunIcon.png";

export type PlanetId = "Mercury" | "Venus" | "Earth" | "Mars" | "Jupiter" | "Saturn" | "Uranus" | "Neptune";

export interface PlanetDefinition {
  id: PlanetId;
  name: string;
  icon: string;
  semiMajorAxis: number;
  eccentricity: number;
  orbitalPeriod: number;
  meanAnomalyJ2000: number;
  longitudeOfPerihelion: number;
}

export const SUN = { id: "Sun", name: "Солнце", icon: SunIcon };

export const PLANETS: PlanetDefinition[] = [
  {
    id: "Mercury",
    name: "Меркурий",
    icon: MercuryIcon,
    semiMajorAxis: 0.38709927,
    eccentricity: 0.20563593,
    orbitalPeriod: 87.9693,
    meanAnomalyJ2000: 174.7925,
    longitudeOfPerihelion: 77.4578,
  },
  {
    id: "Venus",
    name: "Венера",
    icon: VenusIcon,
    semiMajorAxis: 0.72333566,
    eccentricity: 0.00677672,
    orbitalPeriod: 224.7008,
    meanAnomalyJ2000: 50.3766,
    longitudeOfPerihelion: 131.6025,
  },
  {
    id: "Earth",
    name: "Земля",
    icon: EarthIcon,
    semiMajorAxis: 1.00000261,
    eccentricity: 0.01671123,
    orbitalPeriod: 365.2564,
    meanAnomalyJ2000: 357.5269,
    longitudeOfPerihelion: 102.9377,
  },
  {
    id: "Mars",
    name: "Марс",
    icon: MarsIcon,
    semiMajorAxis: 1.52371034,
    eccentricity: 0.0933941,
    orbitalPeriod: 686.9797,
    meanAnomalyJ2000: 19.3902,
    longitudeOfPerihelion: 336.0564,
  },
  {
    id: "Jupiter",
    name: "Юпитер",
    icon: JupiterIcon,
    semiMajorAxis: 5.202887,
    eccentricity: 0.04838624,
    orbitalPeriod: 4332.8171,
    meanAnomalyJ2000: 19.668,
    longitudeOfPerihelion: 14.7285,
  },
  {
    id: "Saturn",
    name: "Сатурн",
    icon: SaturnIcon,
    semiMajorAxis: 9.53667594,
    eccentricity: 0.05386179,
    orbitalPeriod: 10755.8843,
    meanAnomalyJ2000: 317.3554,
    longitudeOfPerihelion: 92.5989,
  },
  {
    id: "Uranus",
    name: "Уран",
    icon: UranusIcon,
    semiMajorAxis: 19.18916464,
    eccentricity: 0.04725744,
    orbitalPeriod: 30687.4014,
    meanAnomalyJ2000: 142.2838,
    longitudeOfPerihelion: 170.9543,
  },
  {
    id: "Neptune",
    name: "Нептун",
    icon: NeptuneIcon,
    semiMajorAxis: 30.06992276,
    eccentricity: 0.00859048,
    orbitalPeriod: 60189.659,
    meanAnomalyJ2000: 259.9152,
    longitudeOfPerihelion: 44.9648,
  },
];
