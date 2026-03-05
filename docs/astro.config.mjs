// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://umtemplates.github.io',
	base: '/UmBootstrap',
	integrations: [
		starlight({
			title: 'UmBootstrap',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/UmTemplates/UmBootstrap' },
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{ label: 'Home', slug: '' },
				{ label: 'Getting Started', slug: 'getting-started' },
				{
					label: 'Packages',
					items: [
						{ label: 'Overview', slug: 'packages' },
						{ label: 'BlockPreview', slug: 'packages/block-preview' },
						{ label: 'UmbNav', slug: 'packages/umbnav' },
						{ label: 'uSync', slug: 'packages/usync' },
					],
				},
			],
		}),
	],
});
