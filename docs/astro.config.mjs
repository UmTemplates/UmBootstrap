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
					label: 'Core Concepts',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'core-concepts' },
						{ label: 'Block Grid', slug: 'core-concepts/block-grid' },
						{ label: 'Block List', slug: 'core-concepts/block-list' },
						{ label: 'Element Types & Data Types', slug: 'core-concepts/element-types' },
					],
				},
				{
					label: 'Layouts',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'layouts' },
						{ label: 'Layout 12', slug: 'layouts/layout12' },
						{ label: 'Layout 3|6|3', slug: 'layouts/layout363' },
						{ label: 'Layout 3|9', slug: 'layouts/layout39' },
						{ label: 'Layout 6|6', slug: 'layouts/layout66' },
						{ label: 'Layout 8', slug: 'layouts/layout8' },
					],
				},
				{
					label: 'Features',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'features' },
						{ label: 'Rich Text Editor', slug: 'features/rich-text-editor' },
						{ label: 'Image', slug: 'features/image' },
						{ label: 'Image Slideshow', slug: 'features/image-slideshow' },
						{ label: 'Code', slug: 'features/code' },
						{ label: 'HTML', slug: 'features/html' },
						{ label: 'FAQs', slug: 'features/faqs' },
						{ label: 'Tabs', slug: 'features/tabs' },
						{ label: 'Internal Links - Selected', slug: 'features/internal-links' },
						{ label: 'Internal Links - Children', slug: 'features/internal-links-children' },
						{ label: 'Internal Links - Pagination', slug: 'features/internal-links-pagination' },
						{ label: 'Internal Links - Slideshow', slug: 'features/internal-links-slideshow' },
						{ label: 'Form - Contact Us', slug: 'features/form-contact-us' },
						{ label: 'Page Title & Description', slug: 'features/page-title-description' },
						{ label: 'Navigation - Descendants', slug: 'features/navigation-descendants' },
						{ label: 'Navigation - In Page', slug: 'features/navigation-in-page' },
						{ label: 'Navigation - Table of Contents', slug: 'features/navigation-table-of-contents' },
					],
				},
				{
					label: 'Customisation',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'customisation' },
						{ label: 'SCSS Setup', slug: 'customisation/scss-setup' },
						{ label: 'Bootstrap Theming', slug: 'customisation/bootstrap-theming' },
						{ label: 'Custom Colours', slug: 'customisation/custom-colours' },
						{ label: 'Custom Components', slug: 'customisation/custom-components' },
					],
				},
				{
					label: 'Maintenance',
					collapsed: true,
					items: [
						{
							label: 'Packages',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'maintenance/packages' },
								{ label: 'BlockPreview', slug: 'maintenance/packages/block-preview' },
								{ label: 'Contentment', slug: 'maintenance/packages/contentment' },
								{ label: 'UmbNav', slug: 'maintenance/packages/umbnav' },
								{ label: 'uSync', slug: 'maintenance/packages/usync' },
							],
						},
						{
							label: 'Tools',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'maintenance/tools' },
								{ label: 'Umbraco MCP Server', slug: 'maintenance/tools/umbraco-mcp' },
							],
						},
						{
							label: 'Publishing & Releases',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'maintenance/publishing' },
								{ label: 'GitHub Actions', slug: 'maintenance/publishing/github-actions' },
								{ label: 'NuGet Packaging', slug: 'maintenance/publishing/nuget' },
								{ label: 'Marketplace', slug: 'maintenance/publishing/marketplace' },
								{ label: 'READMEs', slug: 'maintenance/publishing/readmes' },
								{ label: 'Demo Site Deployment', slug: 'maintenance/publishing/demo-site' },
							],
						},
						{ label: 'Troubleshooting', slug: 'maintenance/troubleshooting' },
					],
				},
			],
		}),
	],
});
