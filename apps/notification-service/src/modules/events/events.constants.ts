// Queue of notification-service on the `travel.events` exchange (spec 3.5)
export const NOTIFICATIONS_QUEUE = "travel.notifications";
// Messages the consumer could not process (invalid payload, unexpected error) are dead-lettered here
// instead of being redelivered forever; inspect / replay them in the RabbitMQ UI.
export const NOTIFICATIONS_DLX = "travel.notifications.dlx";
export const NOTIFICATIONS_DLQ = "travel.notifications.dlq";
