export const OUTBOX_WORKER_INTERVAL_MS = 5_000;
export const OUTBOX_BATCH_SIZE = 50;
// After this many failed publish attempts an event is marked `failed` and no longer retried.
// Attempts are spent only on real publish errors: while the broker is unreachable the worker skips its tick.
export const OUTBOX_MAX_ATTEMPTS = 5;

// amqp-connection-manager queues messages in memory while disconnected and waits for a reconnect;
// with a timeout a publish stuck by a broker outage becomes a normal error (attempts + 1) instead of a hang.
export const OUTBOX_PUBLISH_TIMEOUT_MS = 10_000;
