import { Dish } from "./dish.type";

export type GroupedItems = {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_description: string;
  restaurant_cover_image_url: string;
  restaurant_logo_url: string;
  items: Dish[];
  subtotal: number;
};
