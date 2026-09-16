import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task_21.html',
  styles: [`
    :host { display: block; }
  `]
})
export class ShoppingCartComponent {
  // Products Catalog
  products: Product[] = [
    { id: 1, name: 'Wireless Headphones', price: 99.99 },
    { id: 2, name: 'Mechanical Keyboard', price: 149.50 },
    { id: 3, name: 'Ergonomic Gaming Mouse', price: 59.99 },
    { id: 4, name: 'Ultra-Wide 4K Monitor', price: 499.00 }
  ];

  // 1. Writable Signal for Cart State
  cart = signal<CartItem[]>([]);

  // 2. Computed Signal for Total Items Count
  totalItems = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  // 3. Computed Signal for Total Price
  totalPrice = computed(() => {
    return this.cart().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  constructor() {
    // 4. Effect Signal to log state changes
    effect(() => {
      console.log(`[Signal Effect] Cart updated: ${this.totalItems()} item(s), Total: $${this.totalPrice().toFixed(2)}`);
    });
  }

  // 5. Update Signal - Add product to cart
  addToCart(product: Product): void {
    this.cart.update(currentCart => {
      const existing = currentCart.find(item => item.product.id === product.id);
      if (existing) {
        return currentCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { product, quantity: 1 }];
    });
  }

  // Update Signal - Increase Quantity
  increaseQuantity(productId: number): void {
    this.cart.update(currentCart =>
      currentCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  // Update Signal - Decrease Quantity
  decreaseQuantity(productId: number): void {
    this.cart.update(currentCart =>
      currentCart
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  // Update Signal - Remove Item
  removeFromCart(productId: number): void {
    this.cart.update(currentCart =>
      currentCart.filter(item => item.product.id !== productId)
    );
  }

  // Set Signal - Clear Cart
  clearCart(): void {
    this.cart.set([]);
  }
}
