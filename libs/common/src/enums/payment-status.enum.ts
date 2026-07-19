export enum PaymentStatus {
  INITIATED = "INITIATED", // pagamento criado, ainda não confirmado pelo gateway
  PROCESSING = "PROCESSING", // enviado ao M-Pesa, aguardando resposta
  PAID = "PAID", // pagamento confirmado com sucesso
  FAILED = "FAILED", // falhou no gateway ou rejeitado
  CANCELLED = "CANCELLED", // cancelado pelo utilizador
  TIMEOUT = "TIMEOUT", // sem resposta do gateway
}
