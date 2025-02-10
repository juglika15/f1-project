import { Locale } from "@/i18n/routing";
import { MerchandiseResponse, Product, Query } from "@/types/api";
import { createClient } from "@/utils/supabase/server";
import { PostgrestResponse } from "@supabase/supabase-js";

export async function getMerchandise(
  query: Query,
  locale: Locale
): Promise<MerchandiseResponse> {
  const supabase = await createClient();

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 12;
  const search = query.search?.trim() || "";

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

  if (search) {
    merchQuery = merchQuery.ilike(`name_${locale}`, `%${search}%`);
  }

  if (query.team) {
    const teams = query.team.split(",");
    merchQuery = merchQuery.in("team", teams);
  }

  if (query.category) {
    const categories = query.category.split(",");
    merchQuery = merchQuery.in("category", categories);
  }

  if (query.size) {
    const sizes = query.size.split(",");
    merchQuery = merchQuery.overlaps("sizes", sizes);
  }

  if (query.color) {
    const colors = query.color.split(",");
    merchQuery = merchQuery.overlaps("colors", colors);
  }

  if (query.type) {
    const types = query.type.split(",");
    merchQuery = merchQuery.in("type", types);
  }

  if (query.stock && query.stock !== "all") {
    if (query.stock === "in") {
      merchQuery = merchQuery.gt("stock", 0);
    } else if (query.stock === "out") {
      merchQuery = merchQuery.eq("stock", 0);
    }
  }

  merchQuery = merchQuery.order(sortField, { ascending });

  const { data, error, count }: PostgrestResponse<Product> = await merchQuery;

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
