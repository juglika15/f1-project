export interface LangTypes {
  en: string;
  ka: string;
}

export interface Product {
  id: number;
  name_en: string;
  name_ka: string;
  price: number;
  description_en: string;
  description_ka: string;
  images: string[];
  category: string;
  stock: number;
  sizes: string[];
  colors: string[];
  user_id: string;
  stripe_product_id: string;
  stripe_price_id: string;
  team: string;
  type: string;
}

export interface ProductFormErrors {
  productName?: string | string[];
  productPrice?: string | string[];
  productDescription?: string | string[];
  productImages?: string | string[];
  productSizes?: string | string[];
  productColors?: string | string[];
  productTeam?: string | string[];
  productCategory?: string | string[];
  productStock?: string | string[];
  productType?: string | string[];
}
