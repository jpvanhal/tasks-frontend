import { EventLoggingStrategy } from '@orbit/coordinator';

import { environment } from '../../../environments/environment';

export function createEventLoggingStrategy(): EventLoggingStrategy {
  return new EventLoggingStrategy({ sources: environment.production ? [] : undefined });
}
