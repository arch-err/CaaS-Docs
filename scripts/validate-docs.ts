const requiredHeadings = [
  'Use this when',
  'Quick start',
  'Configuration',
  'Observability',
  'Limits',
  'Support',
];

const paths = globSync('src/content/docs/services/*/index.md').sort();
const errors: string[] = [];

if (paths.length === 0) {
  errors.push('No service documents found.');
}

for (const path of paths) {
  const content = readFileSync(path, 'utf8');

  if (!content.startsWith('---\n')) {
    errors.push(`${path}: frontmatter must be the first document block.`);
  }

  if (!/^service:\s*$/m.test(content)) {
    errors.push(`${path}: missing the service frontmatter object.`);
  }

  if (/^#\s+/m.test(content)) {
    errors.push(`${path}: do not add an H1; Starlight renders the title.`);
  }

  for (const heading of requiredHeadings) {
    if (!content.includes(`\n## ${heading}\n`)) {
      errors.push(`${path}: missing required heading "## ${heading}".`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${paths.length} service documents.`);
import { globSync, readFileSync } from 'node:fs';
