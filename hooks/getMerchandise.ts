import { Locale } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { PostgrestResponse } from "@supabase/supabase-js";

export interface Merchandise {
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
  thumbnails: string[];
}

export interface MerchandiseResponse {
  merchandise: Merchandise[];
  totalPages: number;
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

export async function getMerchandise(
  query: Query,
  locale: Locale
): Promise<MerchandiseResponse> {
  const supabase = await createClient();

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 15;
  const search = query.search?.trim() || "";

  // Parse sortBy parameter; only allow sorting by the current locale’s name or by price
  const [rawSortField, rawSortOrder = "desc"] = query.sortBy
    ? query.sortBy.split("-")
    : ["id", "desc"];
  const sortField =
    rawSortField === `name_${locale}` || rawSortField === "price"
      ? rawSortField
      : "id";
  const ascending = rawSortOrder.toLowerCase() === "asc";

  const from = (page - 1) * limit;
  const to = page * limit - 1;

  let merchQuery = supabase
    .from("merchandise")
    .select("*", { count: "exact" })
    .range(from, to);

  // Apply search filter
  if (search) {
    merchQuery = merchQuery.ilike(`name_${locale}`, `%${search}%`);
  }

  // Apply team filter
  if (query.team) {
    const teams = query.team.split(",");
    merchQuery = merchQuery.in("team", teams);
  }

  // Apply category filter
  if (query.category) {
    const categories = query.category.split(",");
    merchQuery = merchQuery.in("category", categories);
  }

  // Apply size filter (using the "contains" operator on array columns)
  if (query.size) {
    const sizes = query.size.split(",");
    merchQuery = merchQuery.overlaps("sizes", sizes);
  }

  // Apply color filter (using the "contains" operator on array columns)
  if (query.color) {
    const colors = query.color.split(",");
    merchQuery = merchQuery.overlaps("colors", colors);
  }

  // Apply type filter
  if (query.type) {
    const types = query.type.split(",");
    merchQuery = merchQuery.in("type", types);
  }

  // Apply stock filter
  if (query.stock && query.stock !== "all") {
    if (query.stock === "in") {
      merchQuery = merchQuery.gt("stock", 0);
    } else if (query.stock === "out") {
      merchQuery = merchQuery.eq("stock", 0);
    }
  }

  merchQuery = merchQuery.order(sortField, { ascending });

  const { data, error, count }: PostgrestResponse<Merchandise> =
    await merchQuery;

  const totalPages = count ? Math.ceil(count / limit) : 1;

  if (error) {
    console.error("Supabase query error:", error);
    return { merchandise: [], totalPages };
  }
  return {
    merchandise: data || [],
    totalPages,
  };
}
