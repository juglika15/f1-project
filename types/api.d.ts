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

export interface Query {
  page: string;
  limit: string;
  search: string;
  sortBy: string;
  team?: string;
  category?: string;
  size?: string;
  color?: string;
  type?: string;
  stock?: string;
}

export interface MerchandiseResponse {
  merchandise: Product[];
  totalPages: number;
}

export interface Race {
  id: number;
  name: LangTypes;
  date: string;
  city: LangTypes;
  country: LangTypes;
  circuit: string;
  is_sprint: boolean;
  hospitality: string[];
}

export interface Category {
  id: number;
  name: string;
  value: LangTypes;
}

export interface CartItem {
  id: number;
  user_id: number;
  name_en: string;
  name_ka: string;
  price: number;
  image: string;
  size: string;
  team: string;
  product_id: number;
  count: number;
}

export interface Color {
  id: number;
  name: LangTypes;
  value: string;
  code: string;
}

export interface Sizes {
  id: number;
  clothes: string[];
  shoes: string[];
  headwear: string[];
  accessories: string[];
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  code: string;
}

export interface Type {
  id: number;
  name: string;
  value: LangTypes;
}

export interface UserData {
  is_subscribed: boolean;
  stripe_subscription_id: string;
  start_date: string;
  end_date: string;
}
