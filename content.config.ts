import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    lore: defineCollection({
      type: 'page',
      source: 'lore/**/*.md',
      schema: z.object({
        title: z.string(),
        entryType: z.string(),
        expansion: z.string().optional(),
        era: z.string().optional(),
        region: z.string().optional(),
        summary: z.string().optional(),
        tags: z.array(z.string()).default([]),
      })
    })
  }
})
