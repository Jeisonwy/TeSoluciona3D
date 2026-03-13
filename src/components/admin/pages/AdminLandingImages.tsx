import React, { useEffect, useMemo, useState } from "react";

const API = "https://www.tesoluciona3d.com/api";

type LandingImage = {
  id: number;
  image_url: string;
  url?: string;
  created_at: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

function normalizeImageUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `https://www.tesoluciona3d.com${url}`;
  return `https://www.tesoluciona3d.com/${url}`;
}

export default function AdminLandingImages() {
  const [images, setImages] = useState<LandingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return "";
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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

  async function fetchLandingImages() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/get_landing_images.php`);
      const data: ApiResponse<LandingImage[]> = await res.json();
      if (!data.success)
        throw new Error(data.message || "No se pudieron obtener las imágenes");
      setImages(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar imágenes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLandingImages();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setError("Debes seleccionar una imagen");
      return;
    }
    try {
      setUploading(true);
      setError("");
      setSuccess("");
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("url", redirectUrl.trim());
      const res = await fetch(`${API}/upload_landing_image.php`, {
        method: "POST",
        body: formData,
      });
      const data: ApiResponse<LandingImage> = await res.json();
      if (!data.success)
        throw new Error(data.message || "No se pudo subir la imagen");
      setSelectedFile(null);
      setRedirectUrl("");
      setSuccess("Imagen subida correctamente");
      await fetchLandingImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      setError("");
      setSuccess("");
      const formData = new FormData();
      formData.append("id", String(id));
      const res = await fetch(`${API}/delete_landing_image.php`, {
        method: "POST",
        body: formData,
      });
      const data: ApiResponse<{ id: number; image_url: string }> =
        await res.json();
      if (!data.success)
        throw new Error(data.message || "No se pudo eliminar la imagen");
      setSuccess("Imagen eliminada correctamente");
      setConfirmId(null);
      await fetchLandingImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar imagen");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap');

        .ali-root {
          min-height: 100vh;
          background: #060608;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          padding: 48px 28px 80px;
          position: relative;
          overflow-x: hidden;
        }

        /* ── BG ── */
        .ali-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .ali-orb1 {
          position: fixed; pointer-events: none; z-index: 0; border-radius: 50%;
          width: 600px; height: 600px; top: -180px; left: -180px;
          filter: blur(110px);
          background: radial-gradient(circle, rgba(255,106,0,0.15) 0%, transparent 70%);
        }
        .ali-orb2 {
          position: fixed; pointer-events: none; z-index: 0; border-radius: 50%;
          width: 500px; height: 500px; bottom: -140px; right: -100px;
          filter: blur(100px);
          background: radial-gradient(circle, rgba(238,9,121,0.11) 0%, transparent 70%);
        }
        .ali-orb3 {
          position: fixed; pointer-events: none; z-index: 0; border-radius: 50%;
          width: 400px; height: 400px; top: 40%; right: 20%;
          filter: blur(90px);
          background: radial-gradient(circle, rgba(155,89,182,0.07) 0%, transparent 70%);
        }
        .ali-scan {
          position: fixed; left: 0; height: 2px; width: 100%; z-index: 0; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,106,0,0.5), transparent);
          animation: ali-scan 5s ease-in-out infinite;
        }
        @keyframes ali-scan {
          0%   { top: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .ali-particle {
          position: fixed; border-radius: 50%; background: #ff6a00; pointer-events: none; z-index: 0;
          animation: ali-float ease-in-out infinite;
        }
        @keyframes ali-float {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-22px) scale(1.2); }
        }

        /* ── INNER ── */
        .ali-inner { position: relative; z-index: 10; max-width: 1280px; margin: 0 auto; }

        /* Header */
        .ali-header { margin-bottom: 40px; }
        .ali-header-row { display: flex; align-items: center; gap: 14px; margin-bottom: 6px; }
        .ali-hex {
          width: 44px; height: 44px; flex-shrink: 0;
          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
          background: linear-gradient(135deg, rgba(255,106,0,0.22), rgba(238,9,121,0.12));
          border: 1px solid rgba(255,106,0,0.4);
          display: flex; align-items: center; justify-content: center;
          animation: ali-glow 3s ease-in-out infinite;
        }
        @keyframes ali-glow {
          0%,100% { box-shadow: 0 0 16px rgba(255,106,0,0.2); }
          50%      { box-shadow: 0 0 40px rgba(255,106,0,0.5); }
        }
        .ali-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 30px; letter-spacing: 0.1em; line-height: 1;
          background: linear-gradient(135deg, #fff, rgba(255,255,255,0.55));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ali-subtitle {
          font-size: 12px; font-weight: 300; letter-spacing: 0.06em;
          color: rgba(255,255,255,0.35); margin-left: 58px;
        }

        /* Layout */
        .ali-layout {
          display: grid;
          grid-template-columns: 360px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .ali-layout { grid-template-columns: 1fr; }
        }

        /* Cards */
        .ali-card {
          position: relative;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(14px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 30px 90px rgba(0,0,0,0.6);
          overflow: hidden;
        }
        .ali-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,106,0,0.45), transparent);
        }
        .ali-corner { position: absolute; width: 13px; height: 13px; }
        .ali-c-tl { top: 11px; left: 11px; border-top: 2px solid rgba(255,106,0,0.35); border-left: 2px solid rgba(255,106,0,0.35); }
        .ali-c-tr { top: 11px; right: 11px; border-top: 2px solid rgba(255,106,0,0.35); border-right: 2px solid rgba(255,106,0,0.35); }
        .ali-c-bl { bottom: 11px; left: 11px; border-bottom: 2px solid rgba(255,106,0,0.35); border-left: 2px solid rgba(255,106,0,0.35); }
        .ali-c-br { bottom: 11px; right: 11px; border-bottom: 2px solid rgba(255,106,0,0.35); border-right: 2px solid rgba(255,106,0,0.35); }

        /* Section label */
        .ali-section-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(255,106,0,0.7); margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .ali-section-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(255,106,0,0.2), transparent);
        }

        /* Inputs */
        .ali-label { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; color: rgba(255,255,255,0.4); margin-bottom: 8px; display: block; }
        .ali-file-zone {
          position: relative;
          border: 1.5px dashed rgba(255,255,255,0.11);
          border-radius: 12px; padding: 28px 20px;
          text-align: center; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: rgba(255,255,255,0.02);
        }

        .ali-text-input {
  width: 100%;
  box-sizing: border-box;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 10px;
  padding: 11px 14px;
  color: #fff;
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}
.ali-text-input::placeholder {
  color: rgba(255,255,255,0.22);
}
.ali-text-input:focus {
  border-color: rgba(255,106,0,0.5);
  background: rgba(255,106,0,0.04);
  box-shadow: 0 0 0 3px rgba(255,106,0,0.08);
}
        
        .ali-file-zone:hover {
          border-color: rgba(255,106,0,0.4);
          background: rgba(255,106,0,0.03);
        }
        .ali-file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
        .ali-file-icon { color: rgba(255,106,0,0.55); margin: 0 auto 10px; }
        .ali-file-text { font-size: 13px; color: rgba(255,255,255,0.35); }
        .ali-file-text span { color: #ff6a00; }
        .ali-preview-img {
          width: 100%; object-fit: cover; border-radius: 10px; max-height: 180px;
          border: 1px solid rgba(255,255,255,0.08); margin-top: 14px;
        }

        /* Buttons */
        .ali-btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #ff6a00, #ee0979);
          color: #fff; font-family: 'Barlow', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          border: none; border-radius: 11px; padding: 13px 20px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          transition: filter 0.2s, transform 0.2s;
        }
        .ali-btn-primary:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-1px); }
        .ali-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .ali-btn-ghost {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6); border-radius: 9px;
          padding: 8px 16px; font-family: 'Barlow', sans-serif;
          font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
        }
        .ali-btn-ghost:hover { background: rgba(255,255,255,0.09); color: #fff; }

        .ali-btn-del {
          width: 100%;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
          color: #f87171; font-family: 'Barlow', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: 9px; padding: 9px 14px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: all 0.2s;
        }
        .ali-btn-del:hover:not(:disabled) {
          background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.45);
        }
        .ali-btn-del:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Spinner */
        .ali-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: ali-spin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes ali-spin { to { transform: rotate(360deg); } }

        /* Alerts */
        .ali-alert {
          display: flex; align-items: flex-start; gap: 10px;
          border-radius: 11px; padding: 12px 14px; font-size: 13px; margin-top: 14px;
        }
        .ali-alert-err { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5; }
        .ali-alert-ok  { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25); color: #86efac; }

        /* Grid gallery */
        .ali-grid-images {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        /* Image card */
        .ali-img-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
          position: relative;
        }
        .ali-img-card:hover { border-color: rgba(255,106,0,0.3); transform: translateY(-2px); }
        .ali-img-card img { width: 100%; height: 160px; object-fit: cover; display: block; }
        .ali-img-card-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .ali-img-id {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,106,0,0.1); border: 1px solid rgba(255,106,0,0.22);
          color: rgba(255,106,0,0.85); font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 3px 9px; border-radius: 4px;
        }
        .ali-img-url {
          font-size: 10px; color: rgba(255,255,255,0.22);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ali-img-date {
          font-size: 10px; color: rgba(255,255,255,0.2);
          letter-spacing: 0.04em;
        }
        .ali-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          margin: 6px 0;
        }

        /* Empty / Loading state */
        .ali-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px 20px; text-align: center; gap: 12px;
        }
        .ali-empty-icon { color: rgba(255,255,255,0.1); margin-bottom: 4px; }
        .ali-empty-text { font-size: 13px; color: rgba(255,255,255,0.3); }

        /* Skeleton */
        .ali-skel {
          border-radius: 14px; overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          height: 220px;
          animation: ali-shimmer 1.6s ease-in-out infinite;
        }
        @keyframes ali-shimmer {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 0.8; }
        }

        /* Gallery header */
        .ali-gallery-header {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          margin-bottom: 20px;
        }
        .ali-count {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,106,0,0.1); border: 1px solid rgba(255,106,0,0.25);
          border-radius: 6px; padding: 5px 12px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em; color: rgba(255,106,0,0.9);
        }

        /* Confirm overlay */
        .ali-confirm-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(6,6,8,0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: ali-fade-in 0.2s ease;
        }
        @keyframes ali-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .ali-confirm-box {
          position: relative;
          background: rgba(10,10,14,0.98);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px; padding: 32px 32px 28px;
          max-width: 380px; width: 100%;
          box-shadow: 0 0 0 1px rgba(239,68,68,0.1), 0 40px 100px rgba(0,0,0,0.8);
          animation: ali-modal-in 0.25s cubic-bezier(0.23,1,0.32,1);
          text-align: center;
        }
        @keyframes ali-modal-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ali-confirm-box::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent);
          border-radius: 20px 20px 0 0;
        }
        .ali-confirm-icon {
          width: 52px; height: 52px; border-radius: 50%; margin: 0 auto 16px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
          display: flex; align-items: center; justify-content: center; color: #f87171;
        }
        .ali-confirm-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.06em; margin-bottom: 8px; }
        .ali-confirm-text { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 24px; line-height: 1.6; }
        .ali-confirm-actions { display: flex; gap: 10px; }
        .ali-btn-cancel {
          flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6); border-radius: 10px; padding: 11px;
          font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .ali-btn-cancel:hover { background: rgba(255,255,255,0.09); color: #fff; }
        .ali-btn-confirm-del {
          flex: 1; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35);
          color: #f87171; border-radius: 10px; padding: 11px;
          font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 7px;
        }
        .ali-btn-confirm-del:hover { background: rgba(239,68,68,0.25); }
        .ali-btn-confirm-del:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* Background */}
      <div className="ali-grid" />
      <div className="ali-orb1" />
      <div className="ali-orb2" />
      <div className="ali-orb3" />
      <div className="ali-scan" />
      {particles.map((p) => (
        <span
          key={p.id}
          className="ali-particle"
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

      <section className="ali-root">
        <div className="ali-inner">
          {/* Header */}
          <div className="ali-header">
            <div className="ali-header-row">
              <div className="ali-hex">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff6a00"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <div className="ali-title">Imágenes del Landing</div>
            </div>
            <div className="ali-subtitle">
              Administra las imágenes del carrusel principal · Tesoluciona3D
            </div>
          </div>

          <div className="ali-layout">
            {/* ── Upload card ── */}
            <div className="ali-card">
              <span className="ali-corner ali-c-tl" />
              <span className="ali-corner ali-c-tr" />
              <span className="ali-corner ali-c-bl" />
              <span className="ali-corner ali-c-br" />

              <div className="ali-section-label">Subir imagen</div>

              <form
                onSubmit={handleUpload}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div>
                  <label className="ali-label">Selecciona un archivo</label>
                  <div className="ali-file-zone">
                    <input
                      type="file"
                      accept="image/*"
                      className="ali-file-input"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] ?? null)
                      }
                    />
                    {!previewUrl ? (
                      <>
                        <svg
                          className="ali-file-icon"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="3" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                        <p className="ali-file-text">
                          <span>Selecciona</span> o arrastra aquí
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.2)",
                            marginTop: 4,
                          }}
                        >
                          PNG · JPG · WEBP
                        </p>
                      </>
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="ali-preview-img"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="ali-label">URL de redirección</label>
                  <input
                    type="text"
                    className="ali-text-input"
                    placeholder="Ej. /products o https://www.tesoluciona3d.com/products"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="ali-btn-primary"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? (
                    <>
                      <div className="ali-spinner" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      Subir imagen
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="ali-alert ali-alert-err">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="ali-alert ali-alert-ok">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {success}
                </div>
              )}
            </div>

            {/* ── Gallery card ── */}
            <div className="ali-card">
              <span className="ali-corner ali-c-tl" />
              <span className="ali-corner ali-c-tr" />
              <span className="ali-corner ali-c-bl" />
              <span className="ali-corner ali-c-br" />

              <div className="ali-gallery-header">
                <div
                  className="ali-section-label"
                  style={{ margin: 0, flex: 1 }}
                >
                  Imágenes actuales
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {!loading && (
                    <span className="ali-count">
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "#ff6a00",
                          display: "inline-block",
                        }}
                      />
                      {images.length}
                    </span>
                  )}
                  <button
                    type="button"
                    className="ali-btn-ghost"
                    onClick={fetchLandingImages}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 4v6h6M23 20v-6h-6" />
                      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                    </svg>
                    Recargar
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="ali-grid-images">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="ali-skel" />
                  ))}
                </div>
              ) : images.length === 0 ? (
                <div className="ali-empty">
                  <svg
                    className="ali-empty-icon"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <p className="ali-empty-text">
                    No hay imágenes en el landing todavía.
                  </p>
                </div>
              ) : (
                <div className="ali-grid-images">
                  {images.map((image) => (
                    <article key={image.id} className="ali-img-card">
                      <img
                        src={normalizeImageUrl(image.image_url)}
                        alt={`Landing ${image.id}`}
                      />
                      <div className="ali-img-card-body">
                        <span className="ali-img-id">
                          <span
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: "#ff6a00",
                              display: "inline-block",
                            }}
                          />
                          #{image.id}
                        </span>
                        <p className="ali-img-url">{image.image_url}</p>
                        <p className="ali-img-url">
                          {image.url
                            ? `Redirige a: ${image.url}`
                            : "Sin redirección"}
                        </p>
                        <p className="ali-img-date">{image.created_at}</p>
                        <div className="ali-divider" />
                        <button
                          type="button"
                          className="ali-btn-del"
                          onClick={() => setConfirmId(image.id)}
                          disabled={deletingId === image.id}
                        >
                          {deletingId === image.id ? (
                            <>
                              <div
                                className="ali-spinner"
                                style={{ borderTopColor: "#f87171" }}
                              />
                              Eliminando...
                            </>
                          ) : (
                            <>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4h6v2" />
                              </svg>
                              Eliminar
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Confirm delete modal */}
      {confirmId !== null && (
        <div className="ali-confirm-overlay" onClick={() => setConfirmId(null)}>
          <div className="ali-confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="ali-confirm-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>
            <div className="ali-confirm-title">Eliminar imagen</div>
            <p className="ali-confirm-text">
              ¿Seguro que deseas eliminar la imagen{" "}
              <strong style={{ color: "rgba(255,255,255,0.7)" }}>
                #{confirmId}
              </strong>{" "}
              del landing? Esta acción no se puede deshacer.
            </p>
            <div className="ali-confirm-actions">
              <button
                className="ali-btn-cancel"
                onClick={() => setConfirmId(null)}
              >
                Cancelar
              </button>
              <button
                className="ali-btn-confirm-del"
                disabled={deletingId === confirmId}
                onClick={() => handleDelete(confirmId!)}
              >
                {deletingId === confirmId ? (
                  <>
                    <div
                      className="ali-spinner"
                      style={{ borderTopColor: "#f87171" }}
                    />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                    </svg>
                    Sí, eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
