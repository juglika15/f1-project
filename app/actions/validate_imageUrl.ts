"use server";

interface ValidationResponse {
  message: string;
}

const validateImageURL = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/validate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data: ValidationResponse = await response.json();

    if (response.ok) {
      console.log("Image is valid:", data.message);
      return true;
    } else {
      console.log("Validation failed:", data.message);
      return false;
    }
  } catch (error) {
    console.log("Error validating image:", error);
    return false;
  }
};

export default validateImageURL;
