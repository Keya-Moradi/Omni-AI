export type Project = {
  title: string;
  status: 'Active' | 'In Progress' | 'Paused' | 'Exploring';
  summary: string;
  stack: string[];
  links?: { label: string; href: string }[];
};

const projects: Project[] = [
  {
    title: 'Signal Desk',
    status: 'In Progress',
    summary: 'A minimal status dashboard that tracks focus, energy, and weekly goals in one clean view.',
    stack: ['Astro', 'TypeScript', 'Tailwind', 'MDX'],
    links: [{ label: 'Preview', href: '/projects' }],
  },
  {
    title: 'Tiny Patterns',
    status: 'Active',
    summary: 'A living library of small UI and DX snippets for calm, fast product teams.',
    stack: ['Astro', 'Content Collections', 'Markdown'],
    links: [{ label: 'GitHub', href: 'https://github.com/' }],
  },
  {
    title: 'Open Notes',
    status: 'Exploring',
    summary: 'Short essays and process notes on building digital tools with intention.',
    stack: ['MDX', 'TypeScript', 'Static-first'],
  },
];

export default projects;
