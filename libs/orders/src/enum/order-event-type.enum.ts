export enum OrderEventType {
  ORDER_INITIATED = "order.initiated",
  ORDER_CREATED = "order.created",
  ORDER_PREPARING_STARTED = "order.preparing.started",
  ORDER_PICKUP_STARTED = "order.pickup.started",
  ORDER_OUT_FOR_DELIVERY = "order.out.for.delivery",
  ORDER_NEARBY = "order.nearby",
  ORDER_DELIVERED = "order.delivered",

  //

  PAYMENT_PROCESSED = "payment.processed",
  NOTIFICATION = "order.status.updated",
  //   PAYMENT_FAILED = "payment.failed",
  //   PAYMENT_CREATED = "payment.created",
}
