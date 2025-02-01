// pages/api/validate-image.ts
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

interface RequestBody {
  imageUrl: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { imageUrl }: RequestBody = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  try {
    // Fetch the image from the provided URL
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    // Check the content type to ensure it's an image
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image")) {
      return res
        .status(400)
        .json({ message: "URL does not point to a valid image" });
    }

    // Optionally, you can check the image size or other properties
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return res.status(400).json({ message: "Image is too large" });
    }

    // If everything is valid, return success
    return res.status(200).json({ message: "Image is valid" });
  } catch (error) {
    console.error("Error validating image:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
