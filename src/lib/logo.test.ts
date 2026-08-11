import { describe, expect, test } from 'bun:test';
import { resolveLogo } from './logo';

describe('logo resolution', () => {
  test('returns undefined when an entry has no logo', () => {
    expect(resolveLogo({}, 'missing')).toBeUndefined();
  });

  test('prefers SVG when multiple supported formats exist', () => {
    const modules = {
      '../content/docs/services/redis/logo.png': '/redis.png',
      '../content/docs/services/redis/logo.svg': '/redis.svg',
    };

    expect(resolveLogo(modules, 'redis')).toBe('/redis.svg');
  });
});
