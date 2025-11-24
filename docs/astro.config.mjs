// @ts-check

import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Structure Ts',
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
