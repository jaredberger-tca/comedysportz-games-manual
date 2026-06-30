// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'ComedySportz Games Manual',
			sidebar: [
				{
					label: 'Games Manual',
					items: [
						{ label: 'Home', slug: '' },
						{ label: 'Browse Games', slug: 'browse-games' },
					],
				},
			],
		}),
	],
});