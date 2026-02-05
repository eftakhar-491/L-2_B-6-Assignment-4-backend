export type DecimalInput = number | string;

export interface ICategoryInput {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
}

export interface IMealImageInput {
  src: string;
  publicId?: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface IMealVariantOptionInput {
  title: string;
  priceDelta?: DecimalInput;
  isDefault?: boolean;
}

export interface IMealVariantInput {
  name: string;
  isRequired?: boolean;
  options?: IMealVariantOptionInput[];
}

export interface IDietaryPreferenceInput {
  id?: string;
  name?: string;
  slug?: string;
}

export interface ICreateMealPayload {
  title: string;
  slug?: string;
  description?: string;
  shortDesc?: string;
  price: DecimalInput;
  currency?: string;
  stock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  categoryIds?: string[];
  categories?: ICategoryInput[];
  dietaryPreferenceIds?: string[];
  dietaryPreferences?: IDietaryPreferenceInput[];
  images?: IMealImageInput[];
  variants?: IMealVariantInput[];
}

export interface IUpdateMealPayload {
  title?: string;
  slug?: string;
  description?: string;
  shortDesc?: string;
  price?: DecimalInput;
  currency?: string;
  stock?: number | null;
  isActive?: boolean;
  isFeatured?: boolean;
  categoryIds?: string[];
  categories?: ICategoryInput[];
  dietaryPreferenceIds?: string[];
  dietaryPreferences?: IDietaryPreferenceInput[];
  images?: IMealImageInput[];
  variants?: IMealVariantInput[];
}

export type OrderStatus =
  | "placed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type ProviderOrderStatus =
  | "preparing"
  | "ready"
  | "delivered";

export interface IUpdateOrderStatusPayload {
  status: ProviderOrderStatus;
}
