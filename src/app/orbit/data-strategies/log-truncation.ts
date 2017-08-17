import { LogTruncationStrategy } from '@orbit/coordinator';

export function createLogTruncationStrategy(): LogTruncationStrategy {
  return new LogTruncationStrategy();
}
