export async function uploadImage(file) {
  const formImage = new FormData();
  formImage.append("image", file);
  formImage.append("type", "products");
  formImage.append("token", "TU_TOKEN");

  const res = await fetch("/api/upload_image.php", {
    method: "POST",
    body: formImage,
  });

  return res.json();
}

export async function createProduct(product) {
  const formProduct = new FormData();

  formProduct.append("productName", product.productName);
  formProduct.append("description", product.description);
  formProduct.append("cost", product.cost);
  formProduct.append("category", product.category);
  formProduct.append("status", product.status);
  formProduct.append("discount", product.discount);
  formProduct.append("timeToDelivery", product.timeToDelivery);
  formProduct.append("TextLabel", product.TextLabel);
  formProduct.append("color", product.color);

  const res = await fetch("/api/create_product.php", {
    method: "POST",
    body: formProduct,
  });

  return res.json();
}

export async function addProductImage(productId, imageUrl) {
  const res = await fetch("/api/add_product_image.php", {
    method: "POST",
    body: new URLSearchParams({
      product_id: productId,
      image_url: imageUrl,
    }),
  });

  return res.json();
}
