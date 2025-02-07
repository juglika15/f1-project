"use server";

import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

export async function editProduct(formData: FormData) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const supabase = await createClient();

  //   let updatedStripeProduct = null;
  let newStripePrice = null;
  const uploadedImageUrls: string[] = [];

  // Get the product ID from formData (assumed to be your Supabase record ID)
  const productId = formData.get("productId") as string;
  if (!productId) throw new Error("Product ID is required.");

  // Fetch the existing product from Supabase to retrieve Stripe IDs and current images
  const { data: existingProduct, error: fetchError } = await supabase
    .from("merchandise")
    .select("*")
    .eq("id", productId)
    .single();
  if (fetchError || !existingProduct) throw new Error("Product not found.");

  // Extract updated fields from formData
  const productName = formData.get("productName") as string;
  const productPrice = Number(formData.get("productPrice")) * 100;
  const productDescription = formData.get("productDescription") as string;
  const productImages = formData.getAll("productImages") as File[] | null;
  const productTeam = formData.get("productTeam") as string;
  const productCategory = formData.get("productCategory") as string;
  const productSizes = formData.getAll("productSizes") as string[];
  const productType = formData.get("productType") as string;
  const productColors = formData.getAll("productColors") as string[];
  const productStock = Number(formData.get("productStock"));

  // Validate inputs similar to your addNewProduct function
  if (!productName) throw new Error("Product name is required.");
  if (!productPrice || isNaN(productPrice) || productPrice <= 0)
    throw new Error("A valid price is required.");
  if (!productDescription) throw new Error("Product description is required.");
  if (!productTeam) throw new Error("Product team is required.");
  if (!productCategory) throw new Error("Product category is required.");
  if (!productSizes || productSizes.length === 0)
    throw new Error("At least one product size is required.");
  if (!productColors || productColors.length === 0)
    throw new Error("At least one product color is required.");
  if (productStock % 1 !== 0) throw new Error("A valid stock is required.");
  if (!productType) throw new Error("Product type is required.");

  // Upload images if new ones are provided; otherwise, use existing image URLs
  try {
    if (productImages && productImages.length > 0) {
      for (const imageFile of productImages) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("f1")
          .upload(`merchandise/${Date.now()}_${imageFile.name}`, imageFile);

        if (uploadError) throw new Error("Failed to upload image to Supabase.");

        const { data: publicUrlData } = supabase.storage
          .from("f1")
          .getPublicUrl(uploadData.path);

        if (!publicUrlData?.publicUrl)
          throw new Error("Failed to retrieve public URL for the image.");

        uploadedImageUrls.push(publicUrlData.publicUrl);
      }
    } else {
      // If no new images provided, fall back to the existing images
      if (existingProduct.images && existingProduct.images.length > 0) {
      } else {
        throw new Error("At least one product image is required.");
      }
    }

    // Update the Stripe product with new details
    await stripe.products.update(existingProduct.stripe_product_id, {
      name: productName,
      description: productDescription,
      // Update image if you have any; using the first image as an example.
      images: uploadedImageUrls.length > 0 ? [uploadedImageUrls[0]] : undefined,
    });

    // If the price has changed, create a new Stripe price
    if (existingProduct.price !== productPrice) {
      newStripePrice = await stripe.prices.create({
        product: existingProduct.stripe_product_id,
        unit_amount: productPrice,
        currency: "usd",
      });
    }
  } catch (error) {
    console.error("Error during Stripe update:", error);
    throw error;
  }

  // A helper to determine language consistency for name and description
  const determineLanguage = (text: string) => {
    const georgianScriptPattern = /[\u10A0-\u10FF]/;
    return georgianScriptPattern.test(text) ? "ka" : "en";
  };
  const languageCode = determineLanguage(productName);
  const descriptionCode = determineLanguage(productDescription);

  if (languageCode !== descriptionCode)
    throw new Error("Name and description must be in the same language.");

  try {
    // Ensure the user is authenticated
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) throw new Error("User not authenticated.");

    // Build the update payload. If a new price was created, update the stripe_price_id.
    const updatePayload = {
      [`name_${languageCode}`]: productName,
      price: productPrice,
      [`description_${languageCode}`]: productDescription,
      team: productTeam,
      category: productCategory,
      sizes: productSizes,
      colors: productColors,
      stock: productStock,
      type: productType,
    };

    if (newStripePrice) {
      updatePayload.stripe_price_id = newStripePrice.id;
    }

    if (uploadedImageUrls.length > 0) {
      updatePayload.images = uploadedImageUrls;
    }

    // Update the Supabase record for the product
    const { data, error } = await supabase
      .from("merchandise")
      .update(updatePayload)
      .eq("id", productId)
      .single();

    if (error) throw new Error("Failed to update product in Supabase.");

    return data;
  } catch (error) {
    console.error("Error updating product in Supabase:", error);
    throw error;
  }
}
