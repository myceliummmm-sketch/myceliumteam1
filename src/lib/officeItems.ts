export interface OfficeItem {
  id: string;
  name: string;
  emoji: string;
  health: number;
  points: number;
  size: number;
}

export const OFFICE_ITEMS: OfficeItem[] = [
  { id: 'monitor', name: 'Monitor', emoji: '🖥️', health: 5, points: 100, size: 80 },
  { id: 'keyboard', name: 'Keyboard', emoji: '⌨️', health: 3, points: 50, size: 70 },
  { id: 'mouse', name: 'Mouse', emoji: '🖱️', health: 2, points: 30, size: 50 },
  { id: 'coffee', name: 'Coffee Mug', emoji: '☕', health: 2, points: 40, size: 60 },
  { id: 'phone', name: 'Phone', emoji: '📱', health: 3, points: 60, size: 55 },
  { id: 'plant', name: 'Plant', emoji: '🪴', health: 2, points: 35, size: 65 },
  { id: 'stapler', name: 'Stapler', emoji: '📎', health: 3, points: 45, size: 50 },
  { id: 'printer', name: 'Printer', emoji: '🖨️', health: 6, points: 120, size: 85 },
];

export const POWER_UPS = [
  { id: 'coffee_rush', name: 'Coffee Rush', emoji: '☕', duration: 10000, effect: '2x Speed' },
  { id: 'rage_mode', name: 'Rage Mode', emoji: '💢', duration: 8000, effect: 'One-shot everything' },
];

export const ACHIEVEMENTS = [
  { id: 'destroyer', name: 'Office Destroyer', requirement: 100, points: 500 },
  { id: 'combo_master', name: 'Combo Master', requirement: 10, points: 300 },
  { id: 'high_score', name: 'Digital Demolition', requirement: 10000, points: 1000 },
];
