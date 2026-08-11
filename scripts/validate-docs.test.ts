import { afterEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const temporaryDirectories: string[] = [];
const headings = `
## Use this when

Test.

## Observability

Test.

## Limits

Test.

## Support

Test.
`;

const containerDocument = `---
caas:
  type: container
---
${headings}
## Quick start

Test.

## Configuration

Test.
`;

const chartDocument = (containers: string[]) => `---
caas:
  type: chart
  chart:
    containers: [${containers.join(', ')}]
---
${headings}
## Installation

Test.

## Values

Test.
`;

function runValidator(entries: Record<string, string>) {
  const directory = mkdtempSync(join(tmpdir(), 'caas-docs-validator-'));
  temporaryDirectories.push(directory);

  for (const [slug, content] of Object.entries(entries)) {
    const entryDirectory = join(directory, slug);
    mkdirSync(entryDirectory);
    writeFileSync(join(entryDirectory, 'index.md'), content);
  }

  return Bun.spawnSync({
    cmd: [process.execPath, 'scripts/validate-docs.ts'],
    cwd: process.cwd(),
    env: {
      ...process.env,
      CAAS_DOCS_ENTRY_GLOB: `${directory}/*/index.md`,
    },
    stdout: 'pipe',
    stderr: 'pipe',
  });
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('chart container relationships', () => {
  test('accepts references to existing containers', () => {
    const result = runValidator({
      redis: containerDocument,
      'redis-chart': chartDocument(['redis']),
    });

    expect(result.exitCode).toBe(0);
  });

  test('rejects missing containers', () => {
    const result = runValidator({
      'redis-chart': chartDocument(['redis']),
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr.toString()).toContain(
      'chart references missing container "redis"',
    );
  });

  test('rejects charts without containers', () => {
    const result = runValidator({
      'empty-chart': chartDocument([]),
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr.toString()).toContain(
      'charts must reference at least one container',
    );
  });

  test('rejects references to another chart', () => {
    const result = runValidator({
      redis: containerDocument,
      'redis-chart': chartDocument(['redis']),
      'platform-chart': chartDocument(['redis-chart']),
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr.toString()).toContain(
      'chart reference "redis-chart" is not a container',
    );
  });
});
