export const levelUpAnimation = {
  initial: { scale: 0, opacity: 0, rotate: -180 },
  animate: { 
    scale: 1, 
    opacity: 1, 
    rotate: 0
  },
  exit: { scale: 0, opacity: 0, rotate: 180 }
};

export const levelUpTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20
};

export const confettiAnimation = {
  initial: { y: -100, opacity: 1 },
  animate: (i: number) => ({
    y: window.innerHeight + 100,
    x: Math.sin(i * 0.5) * 200,
    rotate: i * 360,
    opacity: 0
  })
};

export const confettiTransition = (i: number) => ({
  duration: 2 + Math.random() * 2,
  ease: "easeIn" as const
});

export const floatingTextAnimation = {
  initial: { y: 0, opacity: 1 },
  animate: { 
    y: -50, 
    opacity: 0
  }
};

export const floatingTextTransition = {
  duration: 1.5,
  ease: "easeOut" as const
};

export const glowPulseAnimation = {
  animate: {
    boxShadow: [
      "0 0 10px rgba(var(--primary), 0.3)",
      "0 0 20px rgba(var(--primary), 0.8)",
      "0 0 10px rgba(var(--primary), 0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const artifactUnlockAnimation = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: { 
    scale: 1, 
    rotate: 0, 
    opacity: 1 
  },
  transition: {
    type: "spring" as const,
    stiffness: 200,
    damping: 15
  }
};

export const shimmerAnimation = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "linear" as const
  }
};
