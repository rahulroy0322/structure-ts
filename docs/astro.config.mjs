// @ts-check

import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://structure-ts.netlify.app',
  integrations: [
    starlight({
      title: 'Structure Ts',
      components: {
        Footer: './src/components/footer.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/rahulroy0322/structure-ts',
        },
      ],
    }),
  ],
})
