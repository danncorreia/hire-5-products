export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  cost: number;
  profile: ProductProfile;
}

export interface ProductProfile {
  type?: 'furniture' | 'equipment' | 'stationary' | 'part';
  available?: boolean;
  backlog?: number;
  [key: string]: any;
}
