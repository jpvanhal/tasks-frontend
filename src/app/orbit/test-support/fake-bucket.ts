import Orbit, { Bucket, BucketSettings } from '@orbit/core';
import { Dict } from '@orbit/utils';

/**
 * A simple implementation of a Bucket that saves values to an in-memory
 * object. Not practical, since Buckets are intended to persist values from
 * memory, but useful for testing.
 */
export class FakeBucket extends Bucket {
  data: Dict<any>;

  constructor(settings: BucketSettings = {}) {
    super(settings);
    this.data = {};
  }

  getItem(key: string): Promise<any> {
    return Orbit.Promise.resolve(this.data[key]);
  }

  setItem(key: string, value: any): Promise<void> {
    this.data[key] = value;
    return Orbit.Promise.resolve();
  }

  removeItem(key: string): Promise<void> {
    delete this.data[key];
    return Orbit.Promise.resolve();
  }
}
