const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log("Token loaded:", !!process.env.PRINTIFY_API_TOKEN);
console.log("Shop ID:", process.env.PRINTIFY_SHOP_ID);

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

function printifyHeaders() {
  return {
    Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
    "User-Agent": "VEYRO-Store/1.0"
  };
}

// Public product feed
app.get("/api/products", async (_req, res) => {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!token || !shopId) {
    return res.json({
      source: "demo",
      products: demoProducts
    });
  }

  try {
    const response = await fetch(
      `https://api.printify.com/v1/shops/${encodeURIComponent(
        shopId
      )}/products.json?page=1&limit=50`,
      {
        headers: printifyHeaders()
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Printify error:", response.status, errorText);

      return res.status(502).json({
        error: "Products are temporarily unavailable."
      });
    }

    const payload = await response.json();

    const products = (payload.data || []).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description || "",
      image:
        p.images?.find((img) => img.is_default)?.src ||
        p.images?.[0]?.src ||
        "",
      variants: (p.variants || [])
        .filter((v) => v.is_enabled)
        .map((v) => ({
          id: v.id,
          title: v.title,
          price: v.price,
          is_available: v.is_available
        }))
    }));

    res.json({
      source: "printify",
      products
    });
  } catch (error) {
    console.error("Printify connection error:", error);

    res.status(502).json({
      error: "Could not connect to the product service."
    });
  }
});

app.post("/api/checkout-demo", (req, res) => {
  const { items, email } = req.body || {};

  if (!Array.isArray(items) || !items.length || !email) {
    return res.status(400).json({
      error: "Please provide a valid basket and email."
    });
  }

  res.json({
    mode: "demo",
    message:
      "Demo checkout complete. No payment was taken and no Printify order was created."
  });
});

app.get("/api/status", (_req, res) => {
  res.json({
    brand: "VEYRO",
    status: "Backend running"
  });
});

app.listen(PORT, () => {
  console.log(`VEYRO is running at http://localhost:${PORT}`);
});

const demoProducts = [
  {
    id: "demo-hoodie",
    title: "VEYRO Essential Hoodie",
    description:
      "A clean everyday layer with a relaxed streetwear fit.",
    image: "",
    variants: [
      { id: "s", title: "S", price: 4200, is_available: true },
      { id: "m", title: "M", price: 4200, is_available: true },
      { id: "l", title: "L", price: 4200, is_available: true },
      { id: "xl", title: "XL", price: 4200, is_available: true }
    ]
  },
  {
    id: "demo-tee",
    title: "VEYRO Core T-Shirt",
    description: "Minimal branding. Easy everyday styling.",
    image: "",
    variants: [
      { id: "s", title: "S", price: 2200, is_available: true },
      { id: "m", title: "M", price: 2200, is_available: true },
      { id: "l", title: "L", price: 2200, is_available: true },
      { id: "xl", title: "XL", price: 2200, is_available: true }
    ]
  }
];