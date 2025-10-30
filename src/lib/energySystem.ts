const MAX_ENERGY = 10;
const ENERGY_REGEN_HOURS = 6;
const MS_PER_HOUR = 1000 * 60 * 60;

export function calculateEnergyRegeneration(
  lastUpdate: Date,
  currentEnergy: number
): { newEnergy: number; energyGained: number } {
  if (currentEnergy >= MAX_ENERGY) {
    return { newEnergy: currentEnergy, energyGained: 0 };
  }

  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / MS_PER_HOUR;
  const energyToAdd = Math.floor(hoursSinceUpdate / ENERGY_REGEN_HOURS);
  
  if (energyToAdd === 0) {
    return { newEnergy: currentEnergy, energyGained: 0 };
  }

  const newEnergy = Math.min(currentEnergy + energyToAdd, MAX_ENERGY);
  const energyGained = newEnergy - currentEnergy;

  return { newEnergy, energyGained };
}

export function getTimeUntilNextEnergy(lastUpdate: Date): {
  hours: number;
  minutes: number;
  totalMinutes: number;
} {
  const now = new Date();
  const msSinceUpdate = now.getTime() - lastUpdate.getTime();
  const msUntilNextEnergy = (ENERGY_REGEN_HOURS * MS_PER_HOUR) - (msSinceUpdate % (ENERGY_REGEN_HOURS * MS_PER_HOUR));
  
  const totalMinutes = Math.ceil(msUntilNextEnergy / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes, totalMinutes };
}

export function getMaxEnergy(): number {
  return MAX_ENERGY;
}
