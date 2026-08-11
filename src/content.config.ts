import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const upstreamSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    homepage: z.url(),
    documentation: z.url(),
    source: z.url().optional(),
  })
  .strict();

const commonFields = {
  aliases: z.array(z.string()).default([]),
  capabilities: z.array(z.string()).min(1),
  lifecycle: z.enum(['experimental', 'preview', 'stable', 'deprecated']),
  owner: z.string().min(1),
  upstream: upstreamSchema,
};

const containerSchema = z
  .object({
    ...commonFields,
    type: z.literal('container'),
    container: z
      .object({
        category: z.enum(['base-image', 'runtime', 'datastore', 'application']),
        image: z.string().min(1),
        versions: z.array(z.string()).min(1),
        architectures: z.array(z.enum(['amd64', 'arm64'])).min(1),
        protocols: z.array(z.string()).default([]),
        stateful: z.boolean(),
      })
      .strict(),
  })
  .strict();

const chartSchema = z
  .object({
    ...commonFields,
    type: z.literal('chart'),
    chart: z
      .object({
        name: z.string().min(1),
        repository: z.string().regex(/^(?:https?|oci):\/\//),
        versions: z.array(z.string()).min(1),
        containers: z.array(z.string()).min(1),
      })
      .strict(),
  })
  .strict();

const caasSchema = z.discriminatedUnion('type', [containerSchema, chartSchema]);

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        description: z.string().min(1),
        caas: caasSchema.optional(),
      }),
    }),
  }),
};
