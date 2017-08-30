import { InjectionToken } from '@angular/core';
import Coordinator, { Strategy } from '@orbit/coordinator';
import { Bucket } from '@orbit/core';
import { KeyMap, Schema, Source } from '@orbit/data';
import Store from '@orbit/store';

export const BUCKET = new InjectionToken<Bucket>('Bucket');
export const COORDINATOR = new InjectionToken<Coordinator>('Coordinator');
export const KEY_MAP = new InjectionToken<KeyMap>('KeyMap');
export const SCHEMA = new InjectionToken<Schema>('Schema');
export const SOURCE = new InjectionToken<Source>('Source');
export const STORE = new InjectionToken<Store>('Store');
export const STRATEGY = new InjectionToken<Strategy>('Strategy');
