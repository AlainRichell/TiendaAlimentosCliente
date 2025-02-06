import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class checkoutGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const navigation = this.router.getCurrentNavigation();
    const isComingFromCart = navigation?.extras.state?.["fromCart"];

    if (!isComingFromCart) {
      this.router.navigate(["/cart"]);
      return false;
    }
    return true;
  }
}
