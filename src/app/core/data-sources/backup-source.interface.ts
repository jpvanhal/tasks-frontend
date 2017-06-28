import { Source, Pullable, Pushable, Resettable, Syncable } from '@orbit/data';

export interface BackupSource extends Source, Pullable, Pushable, Resettable, Syncable {}
