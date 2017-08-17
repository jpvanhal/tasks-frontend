import { RequestStrategy } from '@orbit/coordinator';
import {
  ClientError,
  NetworkError,
  Operation,
  RecordIdentity,
  RemoveRecordOperation,
  ReplaceAttributeOperation,
  ServerError,
  Source,
  Transform,
} from '@orbit/data';
import Store from '@orbit/store';

function isReplaceAttributeOperation(operation: Operation): operation is ReplaceAttributeOperation {
  return operation.op === 'replaceAttribute';
}

function isRemoveRecordOperation(operation: Operation): operation is RemoveRecordOperation {
  return operation.op === 'removeRecord';
}

export function createRemotePushFailStrategy(): RequestStrategy {
  return new RequestStrategy({
    name: 'remote-push-fail',

    source: 'remote',
    on: 'pushFail',

    action(this: RequestStrategy, transform: Transform, e: any): void {
      const remote: Source = this.coordinator.getSource('remote');
      const store: Store = this.coordinator.getSource('store');

      const retry = (timeout = 5000) => {
        setTimeout(() => {
          remote.requestQueue.retry().catch(() => {
            // FIXME: Swallow all rejections. The errors are handled in the pushFail strategy.
            // See: https://github.com/orbitjs/orbit/issues/451
          });
        }, timeout);
      };

      const rollback = () => {
        if (store.transformLog.contains(transform.id)) {
          store.rollback(transform.id, -1);
        }
        ignore();
      };

      const ignore = () => {
        remote.requestQueue.skip();
      }

      const removeRecord = (record: RecordIdentity) => {
        store.update((t) => [t.removeRecord(record)]);
        ignore();
      };

      if (e instanceof NetworkError || e instanceof ServerError) {
        return retry();
      } else if (e instanceof ClientError) {
        const response: Response = (<any>e).response;
        if (response.status === 404) {
          const operation = transform.operations[0];
          if (operation) {
            if (isReplaceAttributeOperation(operation)) {
              return removeRecord(operation.record);
            } else if (isRemoveRecordOperation(operation)) {
              return ignore();
            }
          }
        }
      }
      return rollback();
    },

    blocking: true,
  });
}
