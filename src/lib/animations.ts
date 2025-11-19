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

// Panel collapse/expand animations
export const panelCollapseAnimation = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8
  }
};

export const panelExpandAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30
  }
};

// Stat card hover animation
export const statCardHoverAnimation = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.05, 
    y: -2,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 17
    }
  },
  tap: { scale: 0.98 }
};

// Icon bounce animation for collapse button
export const collapseIconAnimation = {
  rest: { rotate: 0, scale: 1 },
  hover: { 
    scale: 1.1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.9 }
};

// Card reveal animation for new cards
export const cardRevealAnimation = {
  initial: { scale: 0, rotate: -180, opacity: 0, y: 20 },
  animate: { 
    scale: 1, 
    rotate: 0, 
    opacity: 1,
    y: 0
  },
  transition: {
    type: "spring" as const,
    stiffness: 200,
    damping: 15,
    duration: 1
  }
};

// Stage transition animations
export const stageTransitionAnimation = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
  transition: {
    type: "spring" as const,
    stiffness: 200,
    damping: 25
  }
};

export const stageProgressBarAnimation = {
  initial: { width: 0 },
  animate: (progress: number) => ({ 
    width: `${progress}%`,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const
    }
  })
};

export const stageBadgePulse = {
  scale: [1, 1.1, 1],
  transition: {
    duration: 0.5,
    repeat: 2,
    ease: "easeInOut" as const
  }
};
