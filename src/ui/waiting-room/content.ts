export type Member = {
  handle: string;
  roles: string;
  bio: string;
  portrait: string;
};

const art = (name: string) => `/images/waiting-room/${name}.webp`;

export const TEAM: Member[] = [
  {
    handle: '0x_iroh',
    roles: 'Product vision · visual direction · UI',
    bio: 'Wise uncle, trader, investor, vibecoder, farmer.',
    portrait: art('team-iroh'),
  },
  {
    handle: '0x_Takezo',
    roles: 'Story · video · marketing',
    bio: 'Storyteller and marketing lead. Builds study-for-A and runs YouTube channels.',
    portrait: art('team-takezo'),
  },
  {
    handle: 'david_grii',
    roles: 'Front-end · 3D UI',
    bio: 'Full-stack dev across SaaS, health, and stock market. Does not watch anime, yet somehow has an anime pfp.',
    portrait: art('team-david'),
  },
  {
    handle: 'PandaCoderexe',
    roles: 'Back-end · API · UI',
    bio: 'A high schooler with three years of programming behind him. High agency. Runs his own YouTube channel.',
    portrait: art('team-panda'),
  },
  {
    handle: 'tldde',
    roles: 'Systems · market data · Observatorium',
    bio: 'Tall, seasoned dev. Market analytics and systems engineering. Has a cat.',
    portrait: art('team-tldde'),
  },
];

export const xUrl = (handle: string) => `https://x.com/${handle}`;
export const REPO_URL = 'https://github.com/White-Lotus-Labs/iroh-tea-shop';

export const PROJECT = {
  name: "Iroh's Tea Shop",
  studio: 'White Lotus Labs',
  tagline: 'Explore the Bitget stock catalog. Ask Uncle to interpret the evidence.',
  summary:
    'Walk through a 3D tea shop powered by Bitget market data and Qwen AI. Search for tokenized US stocks, inspect real-time equity quotes and analyst estimates, and ask Uncle to explain the evidence.',
  steps: [
    {
      label: 'Counter',
      caption: 'Thesis Desk',
      text: 'Search the Bitget stock catalog. Select an instrument to view its price, company profile, and available research signals.',
    },
    {
      label: 'Host',
      caption: 'Ask Uncle',
      text: 'Ask Uncle about a tokenized US stock. He fetches real-time evidence from Bitget and uses Qwen to explain it clearly.',
    },
    {
      label: 'Shelf',
      caption: 'Market Coverage',
      text: 'View the health of our data. See how many instruments are tracked and which research signals are currently available.',
    },
    {
      label: 'Observatorium',
      caption: 'Wind the orrery',
      text: 'Wind the brass orrery and watch the planets turn. This stop shows no market data.',
    },
  ],
  honesty:
    "Uncle connects directly to Bitget's Model Context Protocol (MCP) for factual market data and uses Qwen to explain it. He never invents prices or financial advice. He only interprets the evidence provided.",
};
