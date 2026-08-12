import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const isGitHubPages = process.env.CAAS_DOCS_TARGET === 'github-pages';

export default defineConfig({
  site: isGitHubPages
    ? 'https://caas-poc.jesber.xyz'
    : 'https://caas-docs.local',
  integrations: [
    starlight({
      title: 'CaaS Docs',
      description: 'Find and consume supported containers and charts.',
      favicon: '/favicon.svg',
      lastUpdated: true,
      editLink: {
        baseUrl: 'https://github.com/arch-err/CaaS-Docs/edit/main/',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/arch-err/CaaS-Docs',
        },
      ],
      sidebar: [
        {
          label: 'CaaS catalog',
          items: [{ autogenerate: { directory: 'services' } }],
        },
        {
          label: 'Contributing',
          items: [{ label: 'Authoring CaaS entries', slug: 'authoring' }],
        },
      ],
      components: {
        PageTitle: './src/components/PageTitle.astro',
      },
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
