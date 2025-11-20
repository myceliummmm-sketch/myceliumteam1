export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  target: string;
  content: string;
  action: string;
}

export const tutorialSteps: TutorialStep[] = [
  {
    id: 0,
    title: "Welcome to Ship It!",
    description: "Meet your team and learn the basics",
    target: "team-panel",
    content: "These are your AI teammates. Each has unique skills that will help you build and ship your project.",
    action: "Got it"
  },
  {
    id: 1,
    title: "Stats & Progress",
    description: "Track your journey",
    target: "stats-panel",
    content: "Watch your XP grow, level up, and manage your energy as you work through the project phases.",
    action: "Next"
  },
  {
    id: 2,
    title: "Current Focus Panel",
    description: "Always know what to do next",
    target: "current-focus-panel",
    content: "This panel shows your current stage goals and the exact next steps to take. No more wondering 'what should I do now?' — just follow the numbered actions!",
    action: "Got it!"
  },
  {
    id: 3,
    title: "Need Help? Just Ask!",
    description: "Your AI team is always ready",
    target: "help-button",
    content: "Feeling stuck? Click the '❓ What should I focus on?' button anytime to get personalized guidance from your team. They'll review your progress and suggest the ONE thing to do next.",
    action: "Perfect!"
  },
  {
    id: 4,
    title: "Chat Terminal",
    description: "Collaborate with your team",
    target: "chat-terminal",
    content: "Type messages here to work with your team. They'll respond, suggest ideas, and help solve problems.",
    action: "Next"
  },
  {
    id: 5,
    title: "Quest Log",
    description: "Your active tasks",
    target: "quest-log",
    content: "Complete tasks to earn XP and progress through phases. Watch out for blockers!",
    action: "Next"
  },
  {
    id: 6,
    title: "Let's Get Started!",
    description: "Time to build something amazing",
    target: "input-bar",
    content: "Tell your team what you want to build, and they'll guide you through the journey from idea to shipped product!",
    action: "Start Building!"
  }
];
