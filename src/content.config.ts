import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const serviceSchema = z.object({
  kind: z.enum(['base-image', 'runtime', 'datastore']),
  aliases: z.array(z.string()).default([]),
  capabilities: z.array(z.string()).min(1),
  protocols: z.array(z.string()).default([]),
  architectures: z.array(z.enum(['amd64', 'arm64'])).min(1),
  supportedVersions: z.array(z.string()).min(1),
  stateful: z.boolean(),
  lifecycle: z.enum(['experimental', 'preview', 'stable', 'deprecated']),
  owner: z.string().min(1),
  containerImage: z.string().min(1),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        description: z.string().min(1),
        service: serviceSchema.optional(),
      }),
    }),
  }),
};
