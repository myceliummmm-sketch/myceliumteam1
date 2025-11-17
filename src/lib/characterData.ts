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
  bio?: string;
  specialties?: string[];
  personality?: string;
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
    bio: 'Three exits. Countless rejections. Ever Green has seen every pitch, every pivot, and every excuse. With decades of VC experience, she knows what separates dreams from unicorns. She\'ll tear apart your deck, question your assumptions, and push you to think bigger. Her "tough love" approach has turned nervous founders into confident CEOs and weak ideas into €2M+ raises. If you want someone to tell you what you want to hear, look elsewhere.',
    specialties: ['Venture Capital', 'Pitch Deck Strategy', 'Market Validation', 'Fundraising', 'Investor Relations'],
    personality: 'Direct, no-nonsense, brutally honest but deeply invested in your success',
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
    bio: 'In a world of endless roadmaps and feature creep, Prisma is the voice of clarity. She\'s killed more features than most teams have shipped—and that\'s her superpower. With a ruthless focus on what actually matters, she cuts through analysis paralysis and gets teams shipping. Her philosophy: done is better than perfect, and two great features beat twelve mediocre ones. Under her guidance, teams reduce scope, increase velocity, and ship products users actually love.',
    specialties: ['Product Strategy', 'Scope Management', 'Feature Prioritization', 'MVP Development', 'Rapid Iteration'],
    personality: 'Decisive, pragmatic, fiercely focused on impact over activity',
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
    bio: 'Former black-hat turned ethical guardian, Toxic has seen the dark side of the web and knows every trick in the book. She thinks like an attacker so you don\'t have to. Every endpoint is a potential entry point. Every input is suspect. Every auth flow has a weakness—until she\'s reviewed it. Her paranoid approach has saved millions in breach costs and kept user data safe. She\'ll make you uncomfortable with hard truths about your security posture, but you\'ll sleep better knowing she\'s audited your code.',
    specialties: ['Penetration Testing', 'Security Audits', 'Threat Modeling', 'Auth Systems', 'Data Protection'],
    personality: 'Paranoid (in a good way), meticulous, protective of users above all',
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
    bio: 'Phoenix doesn\'t just grow products—she resurrects them from the ashes of failed launches. With 47 products scaled past 10K users, she knows the difference between vanity metrics and real growth. She lives for the moment when a tweak to the onboarding flow triples conversion, or a messaging pivot unlocks a new market. Data-driven but creatively fearless, she\'ll A/B test her way to product-market fit while others are still debating which shade of blue to use.',
    specialties: ['Growth Hacking', 'Conversion Optimization', 'User Acquisition', 'Viral Loops', 'Retention Strategy'],
    personality: 'Experimental, data-obsessed, relentlessly optimistic about possibilities',
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
    bio: 'While others chase shiny new frameworks, Tech Priest maintains the systems that keep the lights on. With 99.9% uptime across dozens of production services, he knows that boring infrastructure is reliable infrastructure. He\'ll architect for scale before you need it, optimize queries you didn\'t know were slow, and catch the edge cases that would wake you up at 3am. His infrastructure decisions have saved companies €40K+ in cloud costs while handling 10x traffic growth. He speaks in load balancers and database sharding, and he\'s never lost data.',
    specialties: ['Cloud Architecture', 'Database Optimization', 'CI/CD', 'Scalability', 'DevOps'],
    personality: 'Methodical, reliability-obsessed, deeply pragmatic about tech choices',
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
    bio: 'In Virgil\'s world, design isn\'t decoration—it\'s the difference between premium and commodity. With 374 brands elevated to luxury status under his guidance, he knows that every pixel, every transition, every micro-interaction tells a story. He\'ll challenge "good enough" and push for exceptional. His aesthetic choices aren\'t just pretty—they convert, they elevate brand perception, they justify higher prices. Beauty is his business, and business is booming.',
    specialties: ['Brand Design', 'UI/UX', 'Visual Identity', 'Design Systems', 'Premium Aesthetics'],
    personality: 'Perfectionistic, passionate about craft, believes beautiful design is good business',
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
    bio: 'Zen has watched too many brilliant founders crash and burn from unsustainable pace. Eighty-nine founders later, she\'s mastered the art of sustainable high performance. She\'ll remind you that marathon runners don\'t sprint the whole 26 miles. She\'ll question whether you really need to work weekends or if you\'re just avoiding hard decisions. She tracks velocity like a growth hacker tracks conversion, always asking: "Are you moving fast, or just moving frantically?" Under her guidance, teams ship more by stressing less.',
    specialties: ['Founder Wellness', 'Sustainable Velocity', 'Team Health', 'Productivity Systems', 'Work-Life Integration'],
    personality: 'Calm, wise, protective of long-term sustainability over short-term heroics',
  },
];
