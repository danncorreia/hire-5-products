import { Product, ProductProfile } from "@models/product.interface";

export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  cost: number;
  profile: ProductProfile;
}

export function makeProduct(product: Partial<Product>): ProductDTO {
  return {
    id: product?.id ?? 0,
    name: product?.name ?? '',
    description: product?.description ?? '',
    cost: product?.cost ?? 0,
    profile: product?.profile ?? {}
  };
}
