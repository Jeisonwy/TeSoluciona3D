export type ProductImage = {
  id: string | number;
  image_url: string;
  sort_order?: number;
};

export type Product = {
  id: string;
  productName: string;
  description: string;
  cost: string | number;
  category: string;
  status: string;
  discount: number;
  timeToDelivery: string;
  TextLabel: string;
  color: string;
  event_type?: string;
  show_main_promo?: number | boolean;
  image_url?: string;
  images?: ProductImage[];
};
