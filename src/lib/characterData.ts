import everGreenImg from '@/assets/advisor-ever-green.png';
import phoenixImg from '@/assets/advisor-phoenix.png';
import prismaImg from '@/assets/advisor-prisma.png';
import techPriestImg from '@/assets/advisor-tech-priest.png';
import toxicImg from '@/assets/advisor-toxic.png';
import virgilImg from '@/assets/advisor-virgil.png';
import zenImg from '@/assets/advisor-zen.png';

export interface CharacterData {
  id: string;
  name: string;
  role: string;
  tagline: string;
  status: string;
  stat: string;
  avatar: string;
  image: string;
  color: 'cyan' | 'pink' | 'green' | 'purple';
  video?: string;
}

export const TEAM_MEMBERS: CharacterData[] = [
  {
    id: 'ever',
    name: 'Ever Green',
    role: 'Venture Strategist',
    tagline: 'Built 3 unicorns. Will call out your BS.',
    status: 'Online (always is)',
    stat: 'ROI: Turns weak pitches → €2M raises',
    avatar: everGreenImg,
    image: everGreenImg,
    color: 'cyan',
    video: '/ever-green-hover.mp4',
  },
  {
    id: 'prisma',
    name: 'Prisma',
    role: 'Product Strategist',
    tagline: 'Ship faster. Overthink less.',
    status: 'Reviewing roadmaps',
    stat: 'ROI: 12 features killed, 2 winners shipped',
    avatar: prismaImg,
    image: prismaImg,
    color: 'cyan',
    video: '/prisma-hover.mp4',
  },
  {
    id: 'toxic',
    name: 'Toxic',
    role: 'Security Lead',
    tagline: 'I\'ll hack you before they do',
    status: 'Finding vulnerabilities',
    stat: 'ROI: Saved users €2.4M from breaches',
    avatar: toxicImg,
    image: toxicImg,
    color: 'pink',
    video: '/toxic-hover.mp4',
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    role: 'Growth Architect',
    tagline: 'Turns 0.8% → 3% conversion',
    status: 'Optimizing campaigns',
    stat: 'ROI: 47 products scaled to 10K+ users',
    avatar: phoenixImg,
    image: phoenixImg,
    color: 'pink',
    video: '/phoenix-hover.mp4',
  },
  {
    id: 'techpriest',
    name: 'Tech Priest',
    role: 'Infrastructure Lead',
    tagline: 'Your architecture is showing',
    status: 'Optimizing systems',
    stat: 'ROI: 99.9% uptime, €40K saved on infra',
    avatar: techPriestImg,
    image: techPriestImg,
    color: 'cyan',
    video: '/tech-priest-hover.mp4',
  },
  {
    id: 'virgil',
    name: 'Virgil',
    role: 'Design Director',
    tagline: 'Make it beautiful or don\'t ship',
    status: 'Perfecting pixels',
    stat: 'ROI: 374 brands elevated to premium tier',
    avatar: virgilImg,
    image: virgilImg,
    color: 'purple',
    video: '/virgil-hover.mp4',
  },
  {
    id: 'zen',
    name: 'Zen',
    role: 'Performance Coach',
    tagline: 'Burn bright, not out',
    status: 'Monitoring velocity',
    stat: 'ROI: 89 founders saved from burnout',
    avatar: zenImg,
    image: zenImg,
    color: 'green',
    video: '/zen-hover.mp4',
  },
];
