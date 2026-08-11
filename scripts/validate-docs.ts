import { globSync, readFileSync } from 'node:fs';
import { load } from 'js-yaml';

const commonHeadings = ['Use this when', 'Observability', 'Limits', 'Support'];

const typeHeadings = {
  container: ['Quick start', 'Configuration'],
  chart: ['Installation', 'Values'],
} as const;

type Frontmatter = {
  caas?: {
    type?: string;
    chart?: { containers?: unknown };
  };
};

type Document = {
  path: string;
  slug: string;
  frontmatter: Frontmatter;
};

const entryGlob =
  process.env.CAAS_DOCS_ENTRY_GLOB ?? 'src/content/docs/services/*/index.md';
const paths = globSync(entryGlob).sort();
const errors: string[] = [];
const documents: Document[] = [];

if (paths.length === 0) {
  errors.push('No CaaS entry documents found.');
}

for (const path of paths) {
  const content = readFileSync(path, 'utf8');
  const slug = path.split('/').at(-2)!;

  if (!content.startsWith('---\n')) {
    errors.push(`${path}: frontmatter must be the first document block.`);
    continue;
  }

  const frontmatterEnd = content.indexOf('\n---\n', 4);
  if (frontmatterEnd === -1) {
    errors.push(`${path}: frontmatter must end with a --- delimiter.`);
    continue;
  }

  const body = content.slice(frontmatterEnd + 5);
  let frontmatter: Frontmatter;
  try {
    frontmatter = load(content.slice(4, frontmatterEnd)) as Frontmatter;
  } catch (error) {
    errors.push(`${path}: invalid YAML frontmatter (${String(error)}).`);
    continue;
  }

  if (!frontmatter?.caas) {
    errors.push(`${path}: missing the caas frontmatter object.`);
    continue;
  }

  if (/^#\s+/m.test(body)) {
    errors.push(`${path}: do not add an H1; Starlight renders the title.`);
  }

  const type = frontmatter.caas.type;
  if (type !== 'container' && type !== 'chart') {
    errors.push(`${path}: caas.type must be container or chart.`);
    continue;
  }

  for (const heading of [...commonHeadings, ...typeHeadings[type]]) {
    if (!body.includes(`## ${heading}\n`)) {
      errors.push(`${path}: missing required heading "## ${heading}".`);
    }
  }

  documents.push({ path, slug, frontmatter });
}

const entriesBySlug = new Map(
  documents.map((document) => [document.slug, document]),
);

for (const document of documents) {
  const caas = document.frontmatter.caas!;
  if (caas.type !== 'chart') continue;

  const references = caas.chart?.containers;
  if (!Array.isArray(references) || references.length === 0) {
    errors.push(
      `${document.path}: charts must reference at least one container.`,
    );
    continue;
  }

  const uniqueReferences = new Set(references);
  if (uniqueReferences.size !== references.length) {
    errors.push(`${document.path}: chart container references must be unique.`);
  }

  for (const reference of uniqueReferences) {
    if (typeof reference !== 'string') {
      errors.push(
        `${document.path}: chart container references must be slugs.`,
      );
      continue;
    }

    const target = entriesBySlug.get(reference);
    if (!target) {
      errors.push(
        `${document.path}: chart references missing container "${reference}".`,
      );
    } else if (target.frontmatter.caas?.type !== 'container') {
      errors.push(
        `${document.path}: chart reference "${reference}" is not a container.`,
      );
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${paths.length} CaaS entry documents.`);
