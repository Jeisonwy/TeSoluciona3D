import { useState, FormEvent } from "react";
import ImageUploader from "./ImageUploader";

type ProductData = {
  productName: string;
  description: string;
  cost: number;
  category: string;
  status: string;
  discount: number;
  timeToDelivery: string;
  TextLabel: string;
  color: string;
  image: File | null;
};

type Props = {
  onSubmit: (data: ProductData) => void;
};

export default function ProductForm({ onSubmit }: Props) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Activo");
  const [discount, setDiscount] = useState(0);
  const [timeToDelivery, setTimeToDelivery] = useState("");
  const [TextLabel, setTextLabel] = useState("");
  const [color, setColor] = useState("#000000");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      productName,
      description,
      cost,
      category,
      status,
      discount,
      timeToDelivery,
      TextLabel,
      color,
      image,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        placeholder="Nombre producto"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Precio"
        value={cost}
        onChange={(e) => setCost(Number(e.target.value))}
      />

      <input
        placeholder="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>

      <input
        type="number"
        placeholder="Descuento (%)"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
      />

      <input
        placeholder="Tiempo de entrega"
        value={timeToDelivery}
        onChange={(e) => setTimeToDelivery(e.target.value)}
      />

      <input
        placeholder="Etiqueta (HOT / NUEVO)"
        value={TextLabel}
        onChange={(e) => setTextLabel(e.target.value)}
      />

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <ImageUploader onChange={setImage} />

      <button type="submit">Crear producto</button>
    </form>
  );
}
