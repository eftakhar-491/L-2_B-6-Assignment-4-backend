export interface IAddCartItemPayload {
  mealId: string;
  variantOptionId?: string | null;
  quantity?: number;
}

export interface IUpdateCartItemPayload {
  quantity: number;
}
