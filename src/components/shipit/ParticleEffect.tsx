import { motion } from 'framer-motion';
import { confettiAnimation, confettiTransition } from '@/lib/animations';

interface ParticleEffectProps {
  type: 'confetti' | 'sparkles' | 'fire';
  count?: number;
}

const colors = {
  confetti: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'],
  sparkles: ['hsl(var(--primary))', 'hsl(var(--primary) / 0.7)', 'hsl(var(--primary) / 0.5)'],
  fire: ['hsl(var(--destructive))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))']
};

export function ParticleEffect({ type, count = 50 }: ParticleEffectProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[type][Math.floor(Math.random() * colors[type].length)],
    left: `${Math.random() * 100}%`,
    size: Math.random() * 10 + 5
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          custom={particle.id}
          initial="initial"
          animate="animate"
          variants={confettiAnimation}
          transition={confettiTransition(particle.id)}
          style={{
            position: 'absolute',
            left: particle.left,
            top: -20,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: type === 'sparkles' ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  );
}
