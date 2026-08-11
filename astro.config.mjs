import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const isGitHubPages = process.env.CAAS_DOCS_TARGET === 'github-pages';

export default defineConfig({
  site: isGitHubPages
    ? 'https://arch-err.github.io'
    : 'https://caas-docs.local',
  base: isGitHubPages ? '/CaaS-Docs-POC' : undefined,
  integrations: [
    starlight({
      title: 'CaaS Docs',
      description: 'Find and consume supported container services.',
      favicon: '/favicon.svg',
      lastUpdated: true,
      editLink: {
        baseUrl: 'https://github.com/arch-err/CaaS-Docs-POC/edit/main/',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/arch-err/CaaS-Docs-POC',
        },
      ],
      sidebar: [
        {
          label: 'Services',
          items: [{ autogenerate: { directory: 'services' } }],
        },
        {
          label: 'Contributing',
          items: [{ label: 'Authoring services', slug: 'authoring' }],
        },
      ],
      components: {
        PageTitle: './src/components/PageTitle.astro',
      },
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
