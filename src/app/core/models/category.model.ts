export interface Category {
  idcategoria: number;
  categoria: string;
  imagenes: CategoryImage[];
}

export interface CategoryImage {
  id: number;
  imagen: string;
  idcategoria: number;
}