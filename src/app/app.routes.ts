import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "products",
    loadComponent: () =>
      import("./pages/products/products.component").then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: "about",
    loadComponent: () =>
      import("./pages/about/about.component").then((m) => m.AboutComponent),
  },
  {
    path: "contact",
    loadComponent: () =>
      import("./pages/contact/contact.component").then(
        (m) => m.ContactComponent
      ),
  },
  {
    path: "cart",
    loadComponent: () =>
      import("./pages/cart/cart.component").then((m) => m.CartComponent),
    canActivate: [authGuard],
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./pages/register/register.component").then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: "account",
    loadComponent: () =>
      import("./pages/account/account.component").then(
        (m) => m.AccountComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "pedidos",
    loadComponent: () =>
      import("./pages/pedido-list/pedido-list.component").then(
        (m) => m.PedidoListComponent
      ),
    canActivate: [authGuard],
  },
];
