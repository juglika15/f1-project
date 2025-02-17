// require("dotenv").config();
// const fs = require("fs");
// const csv = require("csv-parser");
// const Stripe = require("stripe");
// const { createClient } = require("@supabase/supabase-js");

// const stripe = Stripe(
//   "sk_test_51QiIpQISmwG2lpF2gPctRnvaxhYVAFKlbCh7Jg1lRnlwmC1q612MwsCSc1f8OVxNUD8rCzC8fhsKJIFkPwSMbCC900u3gRqwJk"
// );
// const supabase = createClient(
//   "https://mincpqoaeqklbiwyayuw.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbmNwcW9hZXFrbGJpd3lheXV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDg3MjQ1NCwiZXhwIjoyMDUwNDQ4NDU0fQ.Tm8dhLJxAVhF08O56Ex2G7vn4O4xlXGj7lrdGeqbaro"
// );

// async function processCSV(filePath) {
//   const products = [];

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on("data", (row) => {
//       products.push(row);
//     })
//     .on("end", async () => {
//       console.log(
//         `✅ Found ${products.length} products. Uploading to Stripe...`
//       );
//       for (let product of products) {
//         await addProductToStripeAndSupabase(product);
//       }
//       console.log("🎉 All products added successfully!");
//     });
// }

// async function addProductToStripeAndSupabase(product) {
//   try {
//     const stripeProduct = await stripe.products.create({
//       name: product.name_en,
//       description: product.description_en,
//       images: JSON.parse(product.images),
//     });

//     const stripePrice = await stripe.prices.create({
//       unit_amount: parseFloat(product.price),
//       currency: "usd",
//       product: stripeProduct.id,
//     });

//     console.log(`🚀 Stripe Product Created: ${stripeProduct.id}`);

//     const { error } = await supabase.from("merchandise").insert([
//       {
//         name_en: product.name_en,
//         name_ka: product.name_ka,
//         description_en: product.description_en,
//         description_ka: product.description_ka,
//         images: JSON.parse(product.images),
//         price: product.price,
//         stock: product.stock,
//         stripe_product_id: stripeProduct.id,
//         stripe_price_id: stripePrice.id,
//         user_id: product.user_id,
//         team: product.team,
//         type: product.type,
//         sizes: JSON.parse(product.sizes),
//         colors: JSON.parse(product.colors),
//         category: product.category,
//         page: product.page,
//       },
//     ]);

//     if (error) throw error.message;
//     console.log(`✅ Added to Supabase: ${product.name_en}`);
//   } catch (error) {
//     console.error("❌ Error adding product:", error);
//   }
// }

// processCSV("/Users/lashajugeli/Downloads/1234.csv");
