import React, { useEffect, useMemo, useState } from "react";
import ProductTable from "../components/ProductTable";
import type { Product, ProductImage } from "../../../types/product";
const API = "https://www.tesoluciona3d.com/api";

function formatCost(value: string | number) {
  if (value === null || value === undefined) return "—";

  const raw = String(value).trim();
  if (!raw) return "—";

  const normalized = raw.replace(/\./g, "").replace(/,/g, "");
  const numericValue = Number(normalized);

  if (!Number.isNaN(numericValue) && normalized !== "") {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(numericValue);
  }

  return raw;
}

export default function AdminProducts() {
  const [isPromotion, setIsPromotion] = useState(false);
  const [eventType, setEventType] = useState("");
  const [showMainPromo, setShowMainPromo] = useState("0");

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Activo");
  const [discount, setDiscount] = useState<number | "">(0);
  const [timeToDelivery, setTimeToDelivery] = useState("");
  const [textLabel, setTextLabel] = useState("");
  const [color, setColor] = useState("#ff0000");
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [doneMessage, setDoneMessage] = useState("");

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.2 + 0.8,
        dur: Math.random() * 8 + 5,
        delay: Math.random() * 4,
        op: Math.random() * 0.4 + 0.08,
      })),
    [],
  );

  function normalizeImageUrl(url?: string) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${window.location.origin}${url}`;
  }

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/get_products.php`);
      const data = await res.json();

      const normalized = Array.isArray(data.data)
        ? data.data.map((p: Product) => ({
            ...p,
            discount: Number(p.discount) || 0,
            event_type: p.event_type || "",
            show_main_promo:
              p.show_main_promo === true ||
              p.show_main_promo === 1 ||
              String(p.show_main_promo) === "1"
                ? 1
                : 0,
            image_url: normalizeImageUrl(p.image_url),
            images: Array.isArray(p.images)
              ? p.images.map((img) => ({
                  ...img,
                  image_url: normalizeImageUrl(img.image_url),
                }))
              : [],
          }))
        : [];

      setProducts(normalized);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetail = async (productId: string) => {
    const res = await fetch(`${API}/get_product.php?id=${productId}`);
    const data = await res.json();

    if (!data.success || !data.data) {
      throw new Error(
        data.message || "No se pudo cargar el detalle del producto",
      );
    }

    return {
      ...data.data,
      discount: Number(data.data.discount) || 0,
      event_type: data.data.event_type || "",
      show_main_promo:
        data.data.show_main_promo === true ||
        data.data.show_main_promo === 1 ||
        data.data.show_main_promo === "1"
          ? 1
          : 0,
      image_url: normalizeImageUrl(data.data.image_url),
      images: Array.isArray(data.data.images)
        ? data.data.images.map((img: ProductImage) => ({
            ...img,
            image_url: normalizeImageUrl(img.image_url),
          }))
        : [],
    } as Product;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setIsPromotion(false);
    setEventType("");
    setShowMainPromo("0");
    setProductName("");
    setDescription("");
    setCost("");
    setCategory("");
    setStatus("Activo");
    setDiscount(0);
    setTimeToDelivery("");
    setTextLabel("");
    setColor("#ff0000");
    setImages([]);
    setPreview([]);
    setExistingImages([]);
    setEditingProductId(null);
    setFormMode("create");
  };

  const openCreateModal = () => {
    resetForm();
    setFormMode("create");
    setIsFormModalOpen(true);
  };

  const openEditModal = async (product: Product) => {
    try {
      const fullProduct = await fetchProductDetail(product.id);

      setFormMode("edit");
      setEditingProductId(fullProduct.id);
      setProductName(fullProduct.productName || "");
      setDescription(fullProduct.description || "");
      setCost(String(fullProduct.cost ?? ""));
      setCategory(fullProduct.category || "");
      setStatus(fullProduct.status || "Activo");
      setDiscount(fullProduct.discount ?? 0);
      setTimeToDelivery(fullProduct.timeToDelivery || "");
      setTextLabel(fullProduct.TextLabel || "");
      setColor(fullProduct.color || "#ff0000");
      setImages([]);
      setPreview([]);
      setExistingImages(fullProduct.images || []);
      setIsFormModalOpen(true);

      setEventType(fullProduct.event_type || "");
      setShowMainPromo(
        String(
          fullProduct.show_main_promo === true ||
            fullProduct.show_main_promo === 1 ||
            String(fullProduct.show_main_promo) === "1"
            ? 1
            : 0,
        ),
      );

      setIsPromotion(
        Number(fullProduct.discount || 0) > 0 ||
          Boolean(fullProduct.event_type?.trim()) ||
          String(fullProduct.show_main_promo) === "1",
      );
    } catch (error: any) {
      console.error(error);
      alert(error.message || "No se pudo abrir el producto para editar");
    }
  };

  const handleImages = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const uploadAndAttachImages = async (productId: string | number) => {
    const uploadedUrls: string[] = [];

    for (const image of images) {
      const formImage = new FormData();
      formImage.append("image", image);
      formImage.append("type", "products");

      const imgRes = await fetch(`${API}/upload_image.php`, {
        method: "POST",
        body: formImage,
        credentials: "include",
      });

      const imgData = await imgRes.json();

      if (!imgData.success) {
        throw new Error(imgData.message || "Error subiendo imagen");
      }

      uploadedUrls.push(imgData.url);
    }

    for (const url of uploadedUrls) {
      const attachRes = await fetch(`${API}/add_product_image.php`, {
        method: "POST",
        body: new URLSearchParams({
          product_id: String(productId),
          image_url: url,
        }),
        credentials: "include",
      });

      const attachData = await attachRes.json().catch(() => null);

      if (attachData && attachData.success === false) {
        throw new Error(attachData.message || "Error asociando imagen");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const normalizedDiscount = isPromotion ? Number(discount || 0) : 0;
    const normalizedEventType = isPromotion ? eventType.trim() : "";
    const normalizedShowMainPromo = isPromotion ? showMainPromo : "0";
    try {
      if (formMode === "create") {
        const formProduct = new FormData();
        formProduct.append("productName", productName);
        formProduct.append("description", description);
        formProduct.append("cost", cost.toString());
        formProduct.append("category", category);
        formProduct.append("status", status);
        formProduct.append("discount", String(normalizedDiscount));
        formProduct.append("event_type", normalizedEventType);
        formProduct.append("show_main_promo", normalizedShowMainPromo);
        formProduct.append("timeToDelivery", timeToDelivery);
        formProduct.append("TextLabel", textLabel);
        formProduct.append("color", color);

        const productRes = await fetch(`${API}/create_product.php`, {
          method: "POST",
          body: formProduct,
          credentials: "include",
        });

        const productData = await productRes.json();

        const createdId =
          productData.id || productData.product_id || productData.insertedId;

        if (!createdId) {
          throw new Error("No se recibió el ID del producto creado");
        }

        if (images.length > 0) {
          await uploadAndAttachImages(createdId);
        }

        setDoneMessage("Producto creado correctamente");
      } else {
        if (!editingProductId) {
          throw new Error("No se encontró el ID del producto a editar");
        }

        const formProduct = new FormData();
        formProduct.append("id", editingProductId);
        formProduct.append("productName", productName);
        formProduct.append("description", description);
        formProduct.append("cost", cost.toString());
        formProduct.append("category", category);
        formProduct.append("status", status);
        formProduct.append("timeToDelivery", timeToDelivery);
        formProduct.append("TextLabel", textLabel);
        formProduct.append("color", color);
        formProduct.append("discount", String(normalizedDiscount));
        formProduct.append("event_type", normalizedEventType);
        formProduct.append("show_main_promo", normalizedShowMainPromo);

        const res = await fetch(`${API}/update_product.php`, {
          method: "POST",
          body: formProduct,
          credentials: "include",
        });
        const updateData = await res.json();

        if (updateData && updateData.success === false) {
          throw new Error(updateData.message || "No se pudo actualizar");
        }

        if (images.length > 0) {
          await uploadAndAttachImages(editingProductId);
        }

        setDoneMessage("Producto actualizado correctamente");
      }

      setIsFormModalOpen(false);
      resetForm();
      fetchProducts();
      setTimeout(() => setDoneMessage(""), 3000);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Ocurrió un error procesando el producto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    const ok = window.confirm(
      `¿Seguro que deseas eliminar "${product.productName}"? Esta acción no se puede deshacer.`,
    );

    if (!ok) return;

    try {
      const formData = new FormData();
      formData.append("id", product.id);

      const res = await fetch(`${API}/delete_product.php`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json().catch(() => null);

      if (data && data.success === false) {
        throw new Error(data.message || "No se pudo eliminar");
      }

      if (selectedProduct?.id === product.id) {
        setSelectedProduct(null);
      }

      setDoneMessage("Producto eliminado correctamente");
      fetchProducts();
      setTimeout(() => setDoneMessage(""), 3000);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Error eliminando producto");
    }
  };

  const handleDeleteImage = async (imageId: string | number) => {
    const ok = window.confirm("¿Seguro que deseas eliminar esta imagen?");
    if (!ok) return;

    try {
      const formData = new FormData();
      formData.append("image_id", String(imageId));

      const res = await fetch(`${API}/delete_product_image.php`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "No se pudo eliminar la imagen");
      }

      setExistingImages((prev) =>
        prev.filter((img) => String(img.id) !== String(imageId)),
      );

      if (selectedProduct?.images?.length) {
        setSelectedProduct({
          ...selectedProduct,
          images: selectedProduct.images.filter(
            (img) => String(img.id) !== String(imageId),
          ),
        });
      }

      setDoneMessage("Imagen eliminada correctamente");
      setTimeout(() => setDoneMessage(""), 3000);
      fetchProducts();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error eliminando imagen");
    }
  };

  const detailImages: ProductImage[] = selectedProduct?.images?.length
    ? selectedProduct.images
    : selectedProduct?.image_url
      ? [
          {
            id: `detail-${selectedProduct.id}`,
            image_url: selectedProduct.image_url,
          },
        ]
      : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap');

        .ap-root {
          min-height: 100vh;
          background: #060608;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          padding: 48px 32px 80px;
          position: relative;
          overflow-x: hidden;
        }
        .ap-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .ap-orb1 {
          position: fixed; pointer-events: none; z-index: 0; border-radius: 50%;
          width: 600px; height: 600px; top: -180px; left: -180px;
          filter: blur(110px);
          background: radial-gradient(circle, rgba(255,106,0,0.15) 0%, transparent 70%);
        }
        .ap-orb2 {
          position: fixed; pointer-events: none; z-index: 0; border-radius: 50%;
          width: 500px; height: 500px; bottom: -140px; right: -100px;
          filter: blur(100px);
          background: radial-gradient(circle, rgba(238,9,121,0.11) 0%, transparent 70%);
        }
        .ap-scan {
          position: fixed; left: 0; height: 2px; width: 100%; z-index: 0; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,106,0,0.5), transparent);
          animation: ap-scan 5s ease-in-out infinite;
        }
        @keyframes ap-scan {
          0%   { top: 0%; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .ap-particle {
          position: fixed; border-radius: 50%; background: #ff6a00; pointer-events: none; z-index: 0;
          animation: ap-float ease-in-out infinite;
        }
        @keyframes ap-float {
          0%,100% { transform: translateY(0) scale(1); }
          50%     { transform: translateY(-22px) scale(1.2); }
        }

        .ap-inner { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; }

        .ap-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 36px; flex-wrap: wrap; gap: 16px;
        }
        .ap-header-left { display: flex; align-items: center; gap: 14px; }
        .ap-header-right { display: flex; align-items: center; gap: 16px; }
        .ap-hex {
          width: 44px; height: 44px; flex-shrink: 0;
          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
          background: linear-gradient(135deg, rgba(255,106,0,0.22), rgba(238,9,121,0.12));
          border: 1px solid rgba(255,106,0,0.4);
          display: flex; align-items: center; justify-content: center;
          animation: ap-glow 3s ease-in-out infinite;
        }
        @keyframes ap-glow {
          0%,100% { box-shadow: 0 0 16px rgba(255,106,0,0.2); }
          50%      { box-shadow: 0 0 40px rgba(255,106,0,0.5); }
        }
        .ap-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 30px; letter-spacing: 0.1em; line-height: 1;
          background: linear-gradient(135deg, #fff, rgba(255,255,255,0.55));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ap-subtitle {
          font-size: 11px; font-weight: 400; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 2px;
        }
        .ap-count {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,106,0,0.1); border: 1px solid rgba(255,106,0,0.25);
          border-radius: 6px; padding: 6px 14px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
          color: rgba(255,106,0,0.9);
        }
        .ap-btn-add {
          background: linear-gradient(135deg, #ff6a00, #ee0979);
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          border: none; border-radius: 8px;
          padding: 10px 20px;
          cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: filter 0.2s, transform 0.2s;
        }
        .ap-btn-add:hover { filter: brightness(1.12); transform: translateY(-2px); }

        .ap-card {
          position: relative;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 30px 90px rgba(0,0,0,0.6);
        }
        .ap-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,106,0,0.45), transparent);
        }
        .ap-corner { position: absolute; width: 14px; height: 14px; }
        .ap-c-tl { top: 12px; left: 12px; border-top: 2px solid rgba(255,106,0,0.35); border-left: 2px solid rgba(255,106,0,0.35); }
        .ap-c-tr { top: 12px; right: 12px; border-top: 2px solid rgba(255,106,0,0.35); border-right: 2px solid rgba(255,106,0,0.35); }
        .ap-c-bl { bottom: 12px; left: 12px; border-bottom: 2px solid rgba(255,106,0,0.35); border-left: 2px solid rgba(255,106,0,0.35); }
        .ap-c-br { bottom: 12px; right: 12px; border-bottom: 2px solid rgba(255,106,0,0.35); border-right: 2px solid rgba(255,106,0,0.35); }

        .ap-loading { display: flex; flex-direction: column; gap: 12px; padding: 32px; }
        .ap-skel {
          height: 44px; border-radius: 8px;
          background: rgba(255,255,255,0.04);
          animation: ap-shimmer 1.6s ease-in-out infinite;
        }
        @keyframes ap-shimmer {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 0.8; }
        }

        .ap-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(6,6,8,0.88);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: ap-fade-in 0.2s ease;
        }
        @keyframes ap-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .ap-modal {
          position: relative;
          width: 100%; max-width: 540px;
          max-height: 90vh; overflow-y: auto;
          background: rgba(10,10,14,0.97);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 22px;
          padding: 0;
          box-shadow: 0 0 0 1px rgba(255,106,0,0.1), 0 40px 120px rgba(0,0,0,0.8);
          animation: ap-modal-in 0.28s cubic-bezier(0.23,1,0.32,1);
        }
        .ap-modal.ap-modal-large { max-width: 720px; }
        @keyframes ap-modal-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ap-modal::before {
          content: '';
          position: sticky; top: 0; display: block; height: 1px; z-index: 20;
          background: linear-gradient(90deg, transparent, rgba(255,106,0,0.5), transparent);
        }

        .ap-close-btn {
          position: absolute; top: 16px; right: 16px; z-index: 30;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; color: rgba(255,255,255,0.6);
        }
        .ap-close-btn:hover {
          background: rgba(255,106,0,0.15); border-color: rgba(255,106,0,0.35);
          color: #ff6a00;
        }

        .ap-modal-img-wrap {
          position: relative; width: 100%; height: 240px; overflow: hidden;
        }
        .ap-modal-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .ap-modal-img-gradient {
          position: absolute; bottom: 0; left: 0; right: 0; height: 120px;
          background: linear-gradient(to top, rgba(10,10,14,0.97), transparent);
        }
        .ap-modal-body { padding: 28px 32px 32px; }
        .ap-modal-category {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase;
          color: #ff6a00; background: rgba(255,106,0,0.1); border: 1px solid rgba(255,106,0,0.25);
          padding: 4px 12px; border-radius: 3px; margin-bottom: 10px;
        }
        .ap-modal-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px; letter-spacing: 0.06em; line-height: 1.1;
          color: #fff; margin-bottom: 14px;
        }
        .ap-modal-desc {
          font-size: 13px; font-weight: 300; line-height: 1.7;
          color: rgba(255,255,255,0.5); margin-bottom: 22px;
        }
        .ap-modal-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px; }
        .ap-modal-stat {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 12px 14px;
        }
        .ap-modal-stat-label {
          font-size: 10px; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 4px;
        }
        .ap-modal-stat-value { font-size: 15px; font-weight: 600; color: #fff; }
        .ap-modal-stat-value.accent {
          background: linear-gradient(135deg, #ff6a00, #ee0979);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ap-status-pill {
          display: inline-flex; align-items: center; gap: 5px; border-radius: 999px; padding: 3px 10px;
          font-size: 11px; font-weight: 600;
        }
        .ap-status-dot { width: 5px; height: 5px; border-radius: 50%; }
        .ap-status-active { background: rgba(34,197,94,0.12); color: #4ade80; }
        .ap-status-active .ap-status-dot { background: #4ade80; box-shadow: 0 0 6px #4ade80; }
        .ap-status-inactive { background: rgba(239,68,68,0.12); color: #f87171; }
        .ap-status-inactive .ap-status-dot { background: #f87171; }
        .ap-label-badge { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 4px; letter-spacing: 0.05em; }
        .ap-modal-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent); margin: 20px 0; }

        .ap-form-header { margin-bottom: 24px; padding-right: 40px; }
        .ap-form-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.1em;
          background: linear-gradient(135deg, #fff, rgba(255,255,255,0.6));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .ap-section-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(255,106,0,0.7); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
        }
        .ap-section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,106,0,0.2), transparent); }
        .ap-field { display: flex; flex-direction: column; gap: 6px; }
        .ap-label { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; color: rgba(255,255,255,0.45); }
        .ap-input, .ap-textarea, .ap-select {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px; padding: 11px 14px; color: #fff; font-family: 'Barlow', sans-serif;
          font-size: 14px; outline: none; transition: all 0.2s; width: 100%; box-sizing: border-box;
        }
        .ap-select option { background: #111; color: #fff; }
        .ap-input::placeholder, .ap-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .ap-input:focus, .ap-textarea:focus, .ap-select:focus {
          border-color: rgba(255,106,0,0.5); background: rgba(255,106,0,0.04); box-shadow: 0 0 0 3px rgba(255,106,0,0.08);
        }
        .ap-textarea { resize: vertical; min-height: 90px; }

        .ap-color-wrap {
          position: relative; display: flex; align-items: center; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09); border-radius: 10px; padding: 8px 14px; gap: 10px;
          transition: border-color 0.2s; cursor: pointer;
        }
        .ap-color-wrap:focus-within { border-color: rgba(255,106,0,0.5); box-shadow: 0 0 0 3px rgba(255,106,0,0.08); }
        .ap-color-swatch { width: 28px; height: 28px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15); flex-shrink: 0; }
        .ap-color-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
        .ap-color-text { font-size: 13px; color: rgba(255,255,255,0.5); letter-spacing: 0.05em; }

        .ap-file-zone {
          position: relative; border: 1.5px dashed rgba(255,255,255,0.12); border-radius: 12px;
          padding: 28px 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.02);
        }
        .ap-file-zone:hover { border-color: rgba(255,106,0,0.4); background: rgba(255,106,0,0.03); }
        .ap-file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
        .ap-file-icon { color: rgba(255,106,0,0.6); margin: 0 auto 10px; }
        .ap-file-text { font-size: 13px; color: rgba(255,255,255,0.4); }
        .ap-file-text span { color: #ff6a00; }

        .ap-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
          margin-top: 14px;
        }
        .ap-preview-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 8px;
        }
        .ap-preview-card img {
          width: 100%;
          height: 96px;
          object-fit: cover;
          border-radius: 8px;
          display: block;
        }
        .ap-preview-caption {
          margin-top: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }



        .ap-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ap-space { display: flex; flex-direction: column; gap: 16px; }

        .ap-btn-submit {
          width: 100%; background: linear-gradient(135deg, #ff6a00, #ee0979); color: #fff;
          font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; border: none; border-radius: 12px; padding: 15px 24px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          transition: filter 0.2s, transform 0.2s; margin-top: 16px;
        }
        .ap-btn-submit:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-2px); }
        .ap-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .ap-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: ap-spin 0.7s linear infinite; }
        @keyframes ap-spin { to { transform: rotate(360deg); } }

        .ap-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          margin-top: 18px;
        }
        .ap-gallery img {
          width: 100%;
          height: 110px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
        }

        .ap-existing-images-note {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
        }

        .ap-btn-delete-image {
          width: 100%;
          margin-top: 8px;
          background: transparent;
          color: #f87171;
          border: 1px solid rgba(248, 113, 113, 0.3);
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ap-btn-delete-image:hover {
          background: rgba(248, 113, 113, 0.08);
          border-color: rgba(248, 113, 113, 0.55);
        }

        .ap-toast {
          position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 1000;
          background: rgba(10,10,12,0.95); border: 1px solid rgba(255,106,0,0.4); border-radius: 12px;
          padding: 14px 28px; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; color: #fff;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,106,0,0.1); animation: ap-toast-in 0.3s ease;
        }
        @keyframes ap-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @media (max-width: 600px) {
          .ap-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ap-grid" />
      <div className="ap-orb1" />
      <div className="ap-orb2" />
      <div className="ap-scan" />
      {particles.map((p) => (
        <span
          key={p.id}
          className="ap-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.op,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className="ap-root">
        <div className="ap-inner">
          <div className="ap-header">
            <div className="ap-header-left">
              <div className="ap-hex">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff6a00"
                  strokeWidth="1.5"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <div className="ap-title">Productos</div>
                <div className="ap-subtitle">
                  Panel de administración · Tesoluciona3D
                </div>
              </div>
            </div>

            <div className="ap-header-right">
              {!loading && (
                <div className="ap-count">
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#ff6a00",
                      display: "inline-block",
                    }}
                  />
                  {products.length} productos
                </div>
              )}
              <button className="ap-btn-add" onClick={openCreateModal}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Agregar Producto
              </button>
            </div>
          </div>

          <div className="ap-card">
            <span className="ap-corner ap-c-tl" />
            <span className="ap-corner ap-c-tr" />
            <span className="ap-corner ap-c-bl" />
            <span className="ap-corner ap-c-br" />

            {loading ? (
              <div className="ap-loading">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="ap-skel"
                    style={{ width: `${80 + Math.random() * 20}%` }}
                  />
                ))}
              </div>
            ) : (
              <ProductTable
                products={products}
                onView={async (product: Product) => {
                  try {
                    const fullProduct = await fetchProductDetail(product.id);
                    setSelectedProduct(fullProduct);
                  } catch (error: any) {
                    console.error(error);
                    alert(
                      error.message ||
                        "No se pudo cargar el detalle del producto",
                    );
                  }
                }}
                onEdit={(product: Product) => openEditModal(product)}
                onDelete={(product: Product) => handleDelete(product)}
              />
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="ap-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="ap-close-btn"
              onClick={() => setSelectedProduct(null)}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {detailImages[0]?.image_url && (
              <div className="ap-modal-img-wrap">
                <img
                  src={detailImages[0].image_url}
                  alt={selectedProduct.productName}
                />
                <div className="ap-modal-img-gradient" />
              </div>
            )}

            <div className="ap-modal-body">
              <div className="ap-modal-category">
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#ff6a00",
                    display: "inline-block",
                  }}
                />
                {selectedProduct.category} · ID: {selectedProduct.id}
              </div>

              <div className="ap-modal-name">{selectedProduct.productName}</div>
              <div className="ap-modal-desc">{selectedProduct.description}</div>

              <div className="ap-modal-stats">
                <div className="ap-modal-stat">
                  <div className="ap-modal-stat-label">Precio</div>
                  <div className="ap-modal-stat-value accent">
                    {formatCost(selectedProduct.cost)}
                  </div>
                </div>

                <div className="ap-modal-stat">
                  <div className="ap-modal-stat-label">Descuento</div>
                  <div className="ap-modal-stat-value accent">
                    {selectedProduct.discount}%
                  </div>
                </div>

                <div className="ap-modal-stat">
                  <div className="ap-modal-stat-label">Tiempo de entrega</div>
                  <div className="ap-modal-stat-value">
                    {selectedProduct.timeToDelivery || "—"}
                  </div>
                </div>

                <div className="ap-modal-stat">
                  <div className="ap-modal-stat-label">Estado</div>
                  <div className="ap-modal-stat-value">
                    <span
                      className={`ap-status-pill ${
                        selectedProduct.status === "Activo"
                          ? "ap-status-active"
                          : "ap-status-inactive"
                      }`}
                    >
                      <span className="ap-status-dot" />
                      {selectedProduct.status}
                    </span>
                  </div>
                </div>

                <div className="ap-modal-stat">
                  <div className="ap-modal-stat-label">Evento promocional</div>
                  <div className="ap-modal-stat-value">
                    {selectedProduct.event_type || "—"}
                  </div>
                </div>

                <div className="ap-modal-stat">
                  <div className="ap-modal-stat-label">Promo principal</div>
                  <div className="ap-modal-stat-value">
                    {String(selectedProduct.show_main_promo) === "1"
                      ? "Sí"
                      : "No"}
                  </div>
                </div>
              </div>

              {detailImages.length > 0 && (
                <>
                  <div className="ap-section-label">Galería</div>
                  <div className="ap-gallery">
                    {detailImages.map((img, index) => (
                      <img
                        key={`${img.image_url}-${index}`}
                        src={img.image_url}
                        alt={`${selectedProduct.productName} ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isFormModalOpen && (
        <div className="ap-overlay" onClick={() => setIsFormModalOpen(false)}>
          <div
            className="ap-modal ap-modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="ap-close-btn"
              onClick={() => setIsFormModalOpen(false)}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="ap-modal-body">
              <div className="ap-form-header">
                <div className="ap-form-title">
                  {formMode === "create"
                    ? "Crear Nuevo Producto"
                    : "Editar Producto"}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="ap-space">
                <div>
                  <div className="ap-section-label">
                    Información del producto
                  </div>
                  <div className="ap-space">
                    <div className="ap-field">
                      <label className="ap-label">Nombre del producto</label>
                      <input
                        className="ap-input"
                        placeholder="Ej. Figura personalizada PLA"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="ap-field">
                      <label className="ap-label">Descripción</label>
                      <textarea
                        className="ap-textarea"
                        placeholder="Describe materiales, dimensiones, uso..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="ap-grid-2">
                      <div className="ap-field">
                        <label className="ap-label">Precio (COP)</label>
                        <input
                          type="text"
                          className="ap-input"
                          placeholder="Ej. 25000, Desde 25.000, A convenir"
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                          required
                        />
                      </div>

                      <div className="ap-field">
                        <label className="ap-label">Categoría</label>
                        <input
                          className="ap-input"
                          placeholder="Ej. Figuras"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ap-modal-divider" />

                <div>
                  <div className="ap-section-label">Promoción</div>
                  <div className="ap-space">
                    <div className="ap-field">
                      <label className="ap-label">
                        ¿Este producto participa en promociones?
                      </label>
                      <select
                        className="ap-select"
                        value={isPromotion ? "1" : "0"}
                        onChange={(e) => {
                          const enabled = e.target.value === "1";
                          setIsPromotion(enabled);

                          if (!enabled) {
                            setDiscount(0);
                            setEventType("");
                            setShowMainPromo("0");
                          }
                        }}
                      >
                        <option value="0">No</option>
                        <option value="1">Sí</option>
                      </select>
                    </div>

                    {isPromotion && (
                      <>
                        <div className="ap-grid-2">
                          <div className="ap-field">
                            <label className="ap-label">Tipo de evento</label>
                            <select
                              className="ap-select"
                              value={eventType}
                              onChange={(e) => setEventType(e.target.value)}
                            >
                              <option value="">Selecciona un evento</option>
                              <option value="Oferta">Oferta</option>
                              <option value="Destacado">Destacado</option>
                              <option value="Temporada">Temporada</option>
                              <option value="Nuevo">Nuevo</option>
                              <option value="San Valentín">San Valentín</option>
                              <option value="Navidad">Navidad</option>
                            </select>
                          </div>

                          <div className="ap-field">
                            <label className="ap-label">
                              Mostrar como promoción principal
                            </label>
                            <select
                              className="ap-select"
                              value={showMainPromo}
                              onChange={(e) => setShowMainPromo(e.target.value)}
                            >
                              <option value="0">No</option>
                              <option value="1">Sí</option>
                            </select>
                          </div>

                          <div className="ap-field">
                            <label className="ap-label">Descuento (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="ap-input"
                              placeholder="0"
                              value={discount}
                              onChange={(e) =>
                                setDiscount(
                                  e.target.value === ""
                                    ? ""
                                    : Math.max(
                                        0,
                                        Math.min(100, Number(e.target.value)),
                                      ),
                                )
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <div className="ap-section-label">Detalles y etiquetas</div>
                  <div className="ap-space">
                    <div className="ap-grid-2">
                      <div className="ap-field">
                        <label className="ap-label">Tiempo de entrega</label>
                        <input
                          className="ap-input"
                          placeholder="Ej. 3-5 días"
                          value={timeToDelivery}
                          onChange={(e) => setTimeToDelivery(e.target.value)}
                        />
                      </div>

                      <div className="ap-field">
                        <label className="ap-label">Etiqueta de texto</label>
                        <input
                          className="ap-input"
                          placeholder="Ej. Nuevo"
                          value={textLabel}
                          onChange={(e) => setTextLabel(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="ap-grid-2">
                      <div className="ap-field">
                        <label className="ap-label">Estado</label>
                        <select
                          className="ap-select"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                      </div>
                    </div>

                    <div className="ap-field">
                      <label className="ap-label">Color de etiqueta</label>
                      <div className="ap-color-wrap">
                        <div
                          className="ap-color-swatch"
                          style={{ background: color }}
                        />
                        <span className="ap-color-text">
                          {color.toUpperCase()}
                        </span>
                        <input
                          type="color"
                          className="ap-color-input"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ap-modal-divider" />

                <div>
                  <div className="ap-section-label">
                    {formMode === "create"
                      ? "Imágenes del producto"
                      : "Imágenes del producto"}
                  </div>

                  {formMode === "edit" && existingImages.length > 0 && (
                    <div className="ap-existing-images-note">
                      Este producto ya tiene {existingImages.length} imagen(es)
                      registradas.
                    </div>
                  )}

                  {formMode === "edit" && existingImages.length > 0 && (
                    <div
                      className="ap-preview-grid"
                      style={{ marginBottom: "16px" }}
                    >
                      {existingImages.map((img) => {
                        const canDelete =
                          typeof img.id === "number" ||
                          (typeof img.id === "string" &&
                            !img.id.startsWith("fallback-"));

                        return (
                          <div key={img.id} className="ap-preview-card">
                            <img src={img.image_url} alt="producto" />
                            {canDelete ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(img.id)}
                                className="ap-btn-delete-image"
                              >
                                Borrar foto
                              </button>
                            ) : (
                              <div
                                style={{
                                  marginTop: 8,
                                  fontSize: 11,
                                  color: "rgba(255,255,255,0.45)",
                                  textAlign: "center",
                                }}
                              >
                                Imagen sin ID
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="ap-file-zone">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="ap-file-input"
                      onChange={(e) => handleImages(e.target.files)}
                    />

                    {preview.length === 0 ? (
                      <>
                        <svg
                          className="ap-file-icon"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="3" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                        <p className="ap-file-text">
                          <span>Selecciona</span> o arrastra una o varias
                          imágenes aquí
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.2)",
                            marginTop: 4,
                          }}
                        >
                          PNG, JPG, WEBP
                        </p>
                      </>
                    ) : (
                      <div className="ap-preview-grid">
                        {preview.map((src, index) => (
                          <div
                            key={`${src}-${index}`}
                            className="ap-preview-card"
                          >
                            <img src={src} alt={`preview-${index}`} />
                            <div className="ap-preview-caption">
                              {images[index]?.name || `Imagen ${index + 1}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="ap-btn-submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="ap-spinner" />
                      {formMode === "create"
                        ? "Creando producto..."
                        : "Actualizando producto..."}
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      {formMode === "create"
                        ? "Crear producto"
                        : "Guardar cambios"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {doneMessage && (
        <div className="ap-toast">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff6a00"
            strokeWidth="2"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {doneMessage}
        </div>
      )}
    </>
  );
}
