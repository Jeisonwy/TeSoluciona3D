import React from "react";
import type { Product, ProductImage } from "../../../types/product";

type Props = {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const formatCOP = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getProductImage = (product: Product) => {
    return product.image_url || product.images?.[0]?.image_url || "";
  };

  return (
    <>
      <style>{`

      .ap-thumb-empty {
        display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: rgba(255,255,255,0.45);
  background: rgba(255,255,255,0.04);
}
        .ap-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .ap-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          white-space: nowrap;
        }

        .ap-table th {
          padding: 18px 24px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          border-bottom: 1px solid rgba(255, 106, 0, 0.3);
          background: rgba(0, 0, 0, 0.2);
        }

        .ap-table td {
          padding: 16px 24px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: all 0.2s ease;
          vertical-align: middle;
        }

        .ap-table tbody tr {
          transition: background 0.2s ease;
        }

        .ap-table tbody tr:hover {
          background: rgba(255, 106, 0, 0.04);
        }

        .ap-table tbody tr:hover td {
          color: #fff;
        }

        .ap-td-id {
          font-family: monospace;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3) !important;
        }

        .ap-td-name {
          font-weight: 600;
          color: #fff !important;
        }

        .ap-product-cell {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 240px;
        }

        .ap-thumb {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
        }

        .ap-product-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .ap-product-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.38);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 240px;
        }

        .ap-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .ap-status.activo {
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .ap-status.inactivo {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .ap-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .ap-status.activo .ap-status-dot {
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
        }

        .ap-status.inactivo .ap-status-dot {
          background: #f87171;
        }

        .ap-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ap-btn {
          background: transparent;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ap-btn-view {
          color: rgba(255, 106, 0, 0.9);
          border: 1px solid rgba(255, 106, 0, 0.3);
        }

        .ap-btn-view:hover {
          background: rgba(255, 106, 0, 0.1);
          color: #ff6a00;
          border-color: rgba(255, 106, 0, 0.6);
          box-shadow: 0 0 12px rgba(255, 106, 0, 0.2);
        }

        .ap-btn-edit {
          color: #7dd3fc;
          border: 1px solid rgba(125, 211, 252, 0.3);
        }

        .ap-btn-edit:hover {
          background: rgba(125, 211, 252, 0.08);
          border-color: rgba(125, 211, 252, 0.55);
          box-shadow: 0 0 12px rgba(125, 211, 252, 0.15);
        }

        .ap-btn-delete {
          color: #f87171;
          border: 1px solid rgba(248, 113, 113, 0.3);
        }

        .ap-btn-delete:hover {
          background: rgba(248, 113, 113, 0.08);
          border-color: rgba(248, 113, 113, 0.55);
          box-shadow: 0 0 12px rgba(248, 113, 113, 0.15);
        }

        .ap-empty {
          padding: 28px;
          text-align: center;
          color: rgba(255,255,255,0.4);
          font-size: 14px;
        }
      `}</style>

      <div className="ap-table-wrapper">
        <table className="ap-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="ap-empty">No hay productos registrados.</div>
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const isActive = p.status === "Activo";

                return (
                  <tr key={p.id}>
                    <td className="ap-td-id">#{p.id}</td>

                    <td>
                      <div className="ap-product-cell">
                        {getProductImage(p) ? (
                          <img
                            src={getProductImage(p)}
                            alt={p.productName}
                            className="ap-thumb"
                          />
                        ) : (
                          <div className="ap-thumb ap-thumb-empty">
                            Sin imagen
                          </div>
                        )}
                        <div className="ap-product-meta">
                          <div className="ap-td-name">{p.productName}</div>
                          <div className="ap-product-sub">{p.category}</div>
                        </div>
                      </div>
                    </td>

                    <td>{formatCOP(Number(p.cost) || 0)}</td>
                    <td>{p.category || "—"}</td>

                    <td>
                      <span
                        className={`ap-status ${isActive ? "activo" : "inactivo"}`}
                      >
                        <span className="ap-status-dot" />
                        {p.status}
                      </span>
                    </td>

                    <td>
                      <div className="ap-actions">
                        <button
                          type="button"
                          className="ap-btn ap-btn-view"
                          onClick={() => onView(p)}
                        >
                          Ver
                        </button>

                        <button
                          type="button"
                          className="ap-btn ap-btn-edit"
                          onClick={() => onEdit(p)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="ap-btn ap-btn-delete"
                          onClick={() => onDelete(p)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
