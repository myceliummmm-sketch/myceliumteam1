import { Phase } from '@/types/game';

export function migrateOldPhase(oldPhase: string): Phase {
  const mapping: Record<string, Phase> = {
    'SPARK': 'VISION',
    'EXPLORE': 'RESEARCH',
    'CRAFT': 'PROTOTYPE',
    'FORGE': 'BUILD',
    'POLISH': 'GROW',
    'LAUNCH': 'GROW'
  };
  return (mapping[oldPhase] || 'VISION') as Phase;
}
