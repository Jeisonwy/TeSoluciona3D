import { useState, useMemo } from "react";

const API = "https://tesoluciona3d.com/api";
const TOKEN = import.meta.env.VITE_ADMIN_UPLOAD_TOKEN;

export default function AdminCreateProduct() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Activo");
  const [discount, setDiscount] = useState(0);
  const [timeToDelivery, setTimeToDelivery] = useState("");
  const [textLabel, setTextLabel] = useState("");
  const [color, setColor] = useState("#ff0000");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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

  const handleImage = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formImage = new FormData();
      formImage.append("image", image!);
      formImage.append("type", "products");
      formImage.append("token", token);
      const imgRes = await fetch(`${API}/upload_image.php`, {
        method: "POST",
        body: formImage,
      });
      const imgData = await imgRes.json();
      if (!imgData.success) {
        alert(imgData.message);
        setSubmitting(false);
        return;
      }

      const formProduct = new FormData();
      formProduct.append("productName", productName);
      formProduct.append("description", description);
      formProduct.append("cost", cost);
      formProduct.append("category", category);
      formProduct.append("status", status);
      formProduct.append("discount", discount.toString());
      formProduct.append("timeToDelivery", timeToDelivery);
      formProduct.append("TextLabel", textLabel);
      formProduct.append("color", color);
      const productRes = await fetch(`${API}/create_product.php`, {
        method: "POST",
        body: formProduct,
      });
      const productData = await productRes.json();

      await fetch(`${API}/add_product_image.php`, {
        method: "POST",
        body: new URLSearchParams({
          product_id: productData.id,
          image_url: imgData.url,
        }),
      });

      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error creando producto");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap');

        .acp-root {
          min-height: 100vh;
          background: #060608;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 48px 20px 80px;
          position: relative;
          overflow: hidden;
        }

        /* BG */
        .acp-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .acp-orb1 {
          position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
          width: 600px; height: 600px; top: -200px; left: -200px;
          filter: blur(110px);
          background: radial-gradient(circle, rgba(255,106,0,0.16) 0%, transparent 70%);
        }
        .acp-orb2 {
          position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
          width: 500px; height: 500px; bottom: -150px; right: -100px;
          filter: blur(100px);
          background: radial-gradient(circle, rgba(238,9,121,0.12) 0%, transparent 70%);
        }
        .acp-scan {
          position: fixed; left: 0; height: 2px; width: 100%; z-index: 0; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,106,0,0.55), transparent);
          animation: acp-scan 5s ease-in-out infinite;
        }
        @keyframes acp-scan {
          0%   { top: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .acp-particle {
          position: fixed; border-radius: 50%; background: #ff6a00; pointer-events: none; z-index: 0;
          animation: acp-float ease-in-out infinite;
        }
        @keyframes acp-float {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-22px) scale(1.2); }
        }

        /* Card */
        .acp-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 720px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 44px 48px 48px;
          backdrop-filter: blur(14px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 40px 120px rgba(0,0,0,0.7);
        }
        .acp-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,106,0,0.5), transparent);
          border-radius: 24px 24px 0 0;
        }

        /* Corner brackets */
        .acp-corner { position: absolute; width: 16px; height: 16px; }
        .acp-c-tl { top: 14px; left: 14px; border-top: 2px solid rgba(255,106,0,0.4); border-left: 2px solid rgba(255,106,0,0.4); }
        .acp-c-tr { top: 14px; right: 14px; border-top: 2px solid rgba(255,106,0,0.4); border-right: 2px solid rgba(255,106,0,0.4); }
        .acp-c-bl { bottom: 14px; left: 14px; border-bottom: 2px solid rgba(255,106,0,0.4); border-left: 2px solid rgba(255,106,0,0.4); }
        .acp-c-br { bottom: 14px; right: 14px; border-bottom: 2px solid rgba(255,106,0,0.4); border-right: 2px solid rgba(255,106,0,0.4); }

        /* Header */
        .acp-header { display: flex; align-items: center; gap: 14px; margin-bottom: 36px; }
        .acp-hex {
          width: 46px; height: 46px; flex-shrink: 0;
          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
          background: linear-gradient(135deg, rgba(255,106,0,0.25), rgba(238,9,121,0.15));
          border: 1px solid rgba(255,106,0,0.4);
          display: flex; align-items: center; justify-content: center;
          animation: acp-glow 3s ease-in-out infinite;
        }
        @keyframes acp-glow {
          0%,100% { box-shadow: 0 0 16px rgba(255,106,0,0.2); }
          50%      { box-shadow: 0 0 40px rgba(255,106,0,0.5); }
        }
        .acp-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px; letter-spacing: 0.1em; line-height: 1;
          background: linear-gradient(135deg, #fff, rgba(255,255,255,0.6));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .acp-subtitle {
          font-size: 11px; font-weight: 400; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
          margin-top: 3px;
        }

        /* Divider */
        .acp-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          margin: 28px 0;
        }

        /* Section label */
        .acp-section-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.28em;
          text-transform: uppercase; color: rgba(255,106,0,0.7);
          margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .acp-section-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(255,106,0,0.2), transparent);
        }

        /* Inputs */
        .acp-field { display: flex; flex-direction: column; gap: 6px; }
        .acp-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
          color: rgba(255,255,255,0.45);
        }
        .acp-input, .acp-textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 11px 14px;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .acp-input::placeholder, .acp-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .acp-input:focus, .acp-textarea:focus {
          border-color: rgba(255,106,0,0.5);
          background: rgba(255,106,0,0.04);
          box-shadow: 0 0 0 3px rgba(255,106,0,0.08);
        }
        .acp-textarea { resize: vertical; min-height: 90px; }

        /* Color picker wrapper */
        .acp-color-wrap {
          position: relative;
          display: flex; align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 8px 14px;
          gap: 10px;
          transition: border-color 0.2s;
          cursor: pointer;
        }
        .acp-color-wrap:focus-within {
          border-color: rgba(255,106,0,0.5);
          box-shadow: 0 0 0 3px rgba(255,106,0,0.08);
        }
        .acp-color-swatch {
          width: 28px; height: 28px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.15);
          flex-shrink: 0;
        }
        .acp-color-input {
          position: absolute; inset: 0; opacity: 0;
          cursor: pointer; width: 100%;
        }
        .acp-color-text { font-size: 13px; color: rgba(255,255,255,0.5); letter-spacing: 0.05em; }

        /* File upload */
        .acp-file-zone {
          position: relative;
          border: 1.5px dashed rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 28px 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: rgba(255,255,255,0.02);
        }
        .acp-file-zone:hover {
          border-color: rgba(255,106,0,0.4);
          background: rgba(255,106,0,0.03);
        }
        .acp-file-input {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%;
        }
        .acp-file-icon { color: rgba(255,106,0,0.6); margin: 0 auto 10px; }
        .acp-file-text { font-size: 13px; color: rgba(255,255,255,0.4); }
        .acp-file-text span { color: #ff6a00; }
        .acp-preview {
          width: 100%; max-height: 200px; object-fit: cover;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          margin-top: 12px;
        }

        /* Token */
        .acp-token-wrap {
          position: relative;
          display: flex; align-items: center;
        }
        .acp-token-icon {
          position: absolute; left: 13px;
          color: rgba(255,106,0,0.5);
          pointer-events: none;
        }
        .acp-token-wrap .acp-input { padding-left: 38px; }

        /* Submit */
        .acp-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff6a00, #ee0979);
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          border: none; border-radius: 12px;
          padding: 15px 24px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          transition: filter 0.2s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .acp-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .acp-btn:hover { filter: brightness(1.12); transform: translateY(-2px); }
        .acp-btn:hover::before { opacity: 1; }
        .acp-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .acp-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: acp-spin 0.7s linear infinite;
        }
        @keyframes acp-spin { to { transform: rotate(360deg); } }

        /* Success toast */
        .acp-toast {
          position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
          z-index: 1000;
          background: rgba(10,10,12,0.95);
          border: 1px solid rgba(255,106,0,0.4);
          border-radius: 12px;
          padding: 14px 28px;
          display: flex; align-items: center; gap: 10px;
          font-size: 14px; font-weight: 500;
          color: #fff;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,106,0,0.1);
          animation: acp-toast-in 0.3s ease;
        }
        @keyframes acp-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Grid helpers */
        .acp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .acp-space { display: flex; flex-direction: column; gap: 16px; }

        @media (max-width: 600px) {
          .acp-card { padding: 28px 20px 36px; }
          .acp-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Background */}
      <div className="acp-grid" />
      <div className="acp-orb1" />
      <div className="acp-orb2" />
      <div className="acp-scan" />
      {particles.map((p) => (
        <span
          key={p.id}
          className="acp-particle"
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

      <div className="acp-root">
        <div className="acp-card">
          {/* Corner brackets */}
          <span className="acp-corner acp-c-tl" />
          <span className="acp-corner acp-c-tr" />
          <span className="acp-corner acp-c-bl" />
          <span className="acp-corner acp-c-br" />

          {/* Header */}
          <div className="acp-header">
            <div className="acp-hex">
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
              <div className="acp-title">Crear Producto</div>
              <div className="acp-subtitle">
                Panel de administración · Tesoluciona3D
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="acp-space">
            {/* Información básica */}
            <div>
              <div className="acp-section-label">Información del producto</div>
              <div className="acp-space">
                <div className="acp-field">
                  <label className="acp-label">Nombre del producto</label>
                  <input
                    className="acp-input"
                    placeholder="Ej. Figura personalizada PLA"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div className="acp-field">
                  <label className="acp-label">Descripción</label>
                  <textarea
                    className="acp-textarea"
                    placeholder="Describe materiales, dimensiones, uso..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="acp-grid-2">
                  <div className="acp-field">
                    <label className="acp-label">Precio (COP)</label>
                    <input
                      type="number"
                      className="acp-input"
                      placeholder="0"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>
                  <div className="acp-field">
                    <label className="acp-label">Categoría</label>
                    <input
                      className="acp-input"
                      placeholder="Ej. Figuras"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="acp-divider" />

            {/* Detalles */}
            <div>
              <div className="acp-section-label">Detalles y etiquetas</div>
              <div className="acp-space">
                <div className="acp-grid-2">
                  <div className="acp-field">
                    <label className="acp-label">Tiempo de entrega</label>
                    <input
                      className="acp-input"
                      placeholder="Ej. 3-5 días"
                      value={timeToDelivery}
                      onChange={(e) => setTimeToDelivery(e.target.value)}
                    />
                  </div>
                  <div className="acp-field">
                    <label className="acp-label">Etiqueta de texto</label>
                    <input
                      className="acp-input"
                      placeholder="Ej. Nuevo"
                      value={textLabel}
                      onChange={(e) => setTextLabel(e.target.value)}
                    />
                  </div>
                </div>
                <div className="acp-grid-2">
                  <div className="acp-field">
                    <label className="acp-label">Descuento (%)</label>
                    <input
                      type="number"
                      className="acp-input"
                      placeholder="0"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                  </div>
                  <div className="acp-field">
                    <label className="acp-label">Color de etiqueta</label>
                    <div className="acp-color-wrap">
                      <div
                        className="acp-color-swatch"
                        style={{ background: color }}
                      />
                      <span className="acp-color-text">
                        {color.toUpperCase()}
                      </span>
                      <input
                        type="color"
                        className="acp-color-input"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="acp-divider" />

            {/* Imagen */}
            <div>
              <div className="acp-section-label">Imagen del producto</div>
              <div className="acp-file-zone">
                <input
                  type="file"
                  accept="image/*"
                  className="acp-file-input"
                  onChange={(e) => handleImage(e.target.files![0])}
                />
                {!preview ? (
                  <>
                    <svg
                      className="acp-file-icon"
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
                    <p className="acp-file-text">
                      <span>Selecciona</span> o arrastra una imagen aquí
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
                  <img src={preview} className="acp-preview" />
                )}
              </div>
            </div>

            <div className="acp-divider" />

            {/* Token */}
            <div>
              <div className="acp-section-label">Autenticación</div>
              <div className="acp-field">
                <label className="acp-label">Token de administrador</label>
                <div className="acp-token-wrap">
                  <svg
                    className="acp-token-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    type="password"
                    className="acp-input"
                    placeholder="••••••••••••"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="acp-btn"
              disabled={submitting}
              style={{ marginTop: 8 }}
            >
              {submitting ? (
                <>
                  <div className="acp-spinner" /> Creando producto...
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
                  Crear producto
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Toast */}
      {done && (
        <div className="acp-toast">
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
          Producto creado correctamente
        </div>
      )}
    </>
  );
}
