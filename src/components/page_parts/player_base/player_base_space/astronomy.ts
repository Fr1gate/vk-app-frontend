import { PLANETS, type PlanetDefinition, type PlanetId } from "./planets";

const SECONDS_PER_DAY = 86_400;
const J2000_UNIX = 946_728_000;
const DEG_TO_RAD = Math.PI / 180;

export interface PlanetOrbitalState {
  longitudeDeg: number;
  radiusAu: number;
}

function solveEccentricAnomaly(meanAnomaly: number, eccentricity: number): number {
  let eccentricAnomaly = meanAnomaly;
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const delta =
      (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
      (1 - eccentricity * Math.cos(eccentricAnomaly));
    eccentricAnomaly -= delta;
    if (Math.abs(delta) < 1e-12) break;
  }
  return eccentricAnomaly;
}

function findPlanet(planetId: PlanetId): PlanetDefinition {
  const planet = PLANETS.find((item) => item.id === planetId);
  if (!planet) throw new Error(`Unknown planet: ${planetId}`);
  return planet;
}

export function getPlanetOrbitalState(planetId: PlanetId, dateSeconds: number): PlanetOrbitalState {
  const planet = findPlanet(planetId);
  const daysSinceJ2000 = (dateSeconds - J2000_UNIX) / SECONDS_PER_DAY;
  const meanAnomaly = (planet.meanAnomalyJ2000 + (360 * daysSinceJ2000) / planet.orbitalPeriod) * DEG_TO_RAD;

  const eccentricAnomaly = solveEccentricAnomaly(meanAnomaly, planet.eccentricity);
  const trueAnomaly =
    2 *
    Math.atan2(
      Math.sqrt(1 + planet.eccentricity) * Math.sin(eccentricAnomaly / 2),
      Math.sqrt(1 - planet.eccentricity) * Math.cos(eccentricAnomaly / 2),
    );

  const trueAnomalyDeg = (trueAnomaly * 180) / Math.PI;
  const longitudeDeg = (((trueAnomalyDeg + planet.longitudeOfPerihelion) % 360) + 360) % 360;
  const radiusAu = planet.semiMajorAxis * (1 - planet.eccentricity * Math.cos(eccentricAnomaly));

  return { longitudeDeg, radiusAu };
}
