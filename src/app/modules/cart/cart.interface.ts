export interface IAddCartItemPayload {
  mealId: string;
  variantOptionId?: string | null;
  variantOptionIds?: string[];
  quantity?: number;
}

export interface IUpdateCartItemPayload {
  quantity: number;
}
