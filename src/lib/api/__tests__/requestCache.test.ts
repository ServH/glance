import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { requestCache } from '../requestCache';

describe('Request Cache', () => {
  beforeEach(() => {
    requestCache.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for non-existent key', () => {
    expect(requestCache.get('nonexistent')).toBeNull();
  });

  it('stores and retrieves cached value', () => {
    const testData = { foo: 'bar' };
    requestCache.set('test-key', testData, 60);

    expect(requestCache.get('test-key')).toEqual(testData);
  });

  it('returns null after TTL expires', () => {
    requestCache.set('test-key', 'test-value', 5); // 5 second TTL

    // Before expiry
    expect(requestCache.get('test-key')).toBe('test-value');

    // After expiry
    vi.advanceTimersByTime(6000); // 6 seconds
    expect(requestCache.get('test-key')).toBeNull();
  });

  it('invalidates specific cache entry', () => {
    requestCache.set('key1', 'value1', 60);
    requestCache.set('key2', 'value2', 60);

    requestCache.invalidate('key1');

    expect(requestCache.get('key1')).toBeNull();
    expect(requestCache.get('key2')).toBe('value2');
  });

  it('clears all cache entries', () => {
    requestCache.set('key1', 'value1', 60);
    requestCache.set('key2', 'value2', 60);

    requestCache.clear();

    expect(requestCache.get('key1')).toBeNull();
    expect(requestCache.get('key2')).toBeNull();
  });

  it('handles different data types', () => {
    requestCache.set('string', 'text', 60);
    requestCache.set('number', 42, 60);
    requestCache.set('object', { a: 1 }, 60);
    requestCache.set('array', [1, 2, 3], 60);
    requestCache.set('boolean', true, 60);

    expect(requestCache.get('string')).toBe('text');
    expect(requestCache.get('number')).toBe(42);
    expect(requestCache.get('object')).toEqual({ a: 1 });
    expect(requestCache.get('array')).toEqual([1, 2, 3]);
    expect(requestCache.get('boolean')).toBe(true);
  });

  it('overwrites existing key', () => {
    requestCache.set('key', 'value1', 60);
    requestCache.set('key', 'value2', 60);

    expect(requestCache.get('key')).toBe('value2');
  });

  it('respects TTL when overwriting', () => {
    requestCache.set('key', 'value1', 10);

    // Wait 5 seconds
    vi.advanceTimersByTime(5000);

    // Overwrite with new TTL
    requestCache.set('key', 'value2', 10);

    // Wait another 7 seconds (12 total from first set)
    vi.advanceTimersByTime(7000);

    // Should still be valid (only 7 seconds from second set)
    expect(requestCache.get('key')).toBe('value2');

    // Wait 4 more seconds (11 total from second set)
    vi.advanceTimersByTime(4000);

    // Now should be expired
    expect(requestCache.get('key')).toBeNull();
  });
});
