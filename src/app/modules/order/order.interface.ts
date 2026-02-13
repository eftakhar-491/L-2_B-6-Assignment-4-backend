import type { DecimalInput } from "../provider/provider.interface";

export type PaymentMethod = "cash_on_delivery";

export interface IOrderItemInput {
  mealId: string;
  quantity: number;
  variantOptionIds?: string[];
  notes?: string;
}

export interface ICreateOrderPayload {
  providerProfileId: string;
  deliveryAddressId: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  items?: IOrderItemInput[];
}

export interface IOrderItemSummary {
  mealId: string;
  quantity: number;
  unitPrice: DecimalInput;
  subtotal: DecimalInput;
  variantOptionIds: string[];
  notes?: string;
}

export interface ICreateOrderReviewPayload {
  mealId: string;
  rating: number;
  comment?: string;
}
