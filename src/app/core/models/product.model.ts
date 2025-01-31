import { Category } from "./category.model";

export interface Product {
  idproducto: number;
  categorias: Category[];
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  imagenes: ProductImage[];
}

export interface ProductImage {
  id: number;
  imagen: string;
  idproducto: number;
}

//No products

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}
