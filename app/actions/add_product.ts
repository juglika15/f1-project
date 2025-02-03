"use server";

import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

export async function addNewProduct(formData: FormData) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const supabase = await createClient();

  const uploadedImageUrls = [];
  let addedStripeProduct = null;
  let addedStripePrice = null;

  const productName = formData.get("productName") as string;
  const productPrice = Number(formData.get("productPrice")) * 100;
  const productDescription = formData.get("productDescription") as string;
  const productImages = formData.getAll("productImages") as File[];
  const productTeam = formData.get("productTeam") as string;
  const productSizes = formData.getAll("productSizes") as string[];
  const productColors = formData.getAll("productColors") as string[];

  if (!productName) throw new Error("Product name is required.");
  if (!productPrice || isNaN(productPrice) || productPrice <= 0)
    throw new Error("A valid price is required.");
  if (!productDescription) throw new Error("Product description is required.");
  if (!productImages || productImages.length === 0)
    throw new Error("At least one product image is required.");

  try {
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

    addedStripeProduct = await stripe.products.create({
      name: productName,
      description: productDescription,
      images: [uploadedImageUrls[0]],
    });

    addedStripePrice = await stripe.prices.create({
      product: addedStripeProduct.id,
      unit_amount: productPrice,
      currency: "usd",
    });
  } catch (error) {
    console.error("Error during product setup:", error);
    if (addedStripeProduct) {
      await stripe.products.del(addedStripeProduct.id);
    }
    throw error;
  }

  const determineLanguage = (text: string) => {
    const georgianScriptPattern = /[\u10A0-\u10FF]/;
    return georgianScriptPattern.test(text) ? "ka" : "en";
  };
  const languageCode = determineLanguage(productName);
  const descriptionCode = determineLanguage(productDescription);

  if (languageCode !== descriptionCode)
    throw new Error("name and description must be in the same language.");

  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) throw new Error("User not authenticated.");

    const { data, error } = await supabase
      .from("merchandise")
      .insert({
        [`name_${languageCode}`]: productName,
        price: productPrice,
        [`description_${languageCode}`]: productDescription,
        user_id: userId,
        stripe_product_id: addedStripeProduct.id,
        stripe_price_id: addedStripePrice.id,
        images: uploadedImageUrls,
        team: productTeam,
        sizes: productSizes,
        colors: productColors,
      })
      .single();

    if (error) {
      throw new Error("Failed to add product in Supabase.");
    }

    return data;
  } catch (error) {
    console.error("Error adding product in Supabase:", error);
    if (addedStripePrice) {
      await stripe.products.del(addedStripeProduct.id);
    }
    throw error;
  }
}
