/**
 * Task 1: JavaScript Fundamentals - ATM Banking System & E-Commerce Checkout System
 */

// ============================================================================
// CHALLENGE 1: ATM BANKING SYSTEM
// ============================================================================
class AtmSystem {
  constructor(initialPin = "1234", initialBalance = 1000) {
    this.pin = initialPin;
    this.balance = Number(initialBalance);
    this.failedAttempts = 0;
    this.isLocked = false;
  }

  // Private Helper: Validate PIN & Lock Check
  #validateAuth(enteredPin) {
    if (this.isLocked) {
      return { success: false, message: "❌ Account is locked due to 3 failed PIN attempts. Contact bank support." };
    }

    if (enteredPin !== this.pin) {
      this.failedAttempts += 1;
      if (this.failedAttempts >= 3) {
        this.isLocked = true;
        return { success: false, message: "❌ Account locked! 3 incorrect PIN attempts reached." };
      }
      return { success: false, message: `❌ Incorrect PIN. Remaining attempts: ${3 - this.failedAttempts}` };
    }

    this.failedAttempts = 0; // Reset on successful auth
    return { success: true };
  }

  // Operation 1: Withdraw Money
  withdraw(enteredPin, amount) {
    const auth = this.#validateAuth(enteredPin);
    if (!auth.success) return auth.message;

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return "❌ Invalid withdrawal amount. Must be greater than zero.";
    }

    if (numAmount > this.balance) {
      return `❌ Insufficient balance! Current balance: $${this.balance.toFixed(2)}`;
    }

    this.balance -= numAmount;
    return `✅ Successfully withdrew $${numAmount.toFixed(2)}. Remaining balance: $${this.balance.toFixed(2)}`;
  }

  // Operation 2: Deposit Money
  deposit(enteredPin, amount) {
    const auth = this.#validateAuth(enteredPin);
    if (!auth.success) return auth.message;

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return "❌ Invalid deposit amount. Deposit must be greater than zero.";
    }

    this.balance += numAmount;
    return `✅ Successfully deposited $${numAmount.toFixed(2)}. New balance: $${this.balance.toFixed(2)}`;
  }

  // Operation 3: Check Current Balance
  checkBalance(enteredPin) {
    const auth = this.#validateAuth(enteredPin);
    if (!auth.success) return auth.message;

    return `ℹ️ Account Balance: $${this.balance.toFixed(2)}`;
  }

  // Operation 4: Change PIN
  changePin(currentPin, newPin) {
    const auth = this.#validateAuth(currentPin);
    if (!auth.success) return auth.message;

    if (!/^\d{4}$/.test(newPin)) {
      return "❌ Invalid PIN! New PIN must consist of exactly 4 numeric digits.";
    }

    this.pin = newPin;
    return "✅ PIN changed successfully!";
  }
}

// ============================================================================
// CHALLENGE 2: E-COMMERCE CHECKOUT SYSTEM
// ============================================================================
class CheckoutSystem {
  static calculateBill(customerName, category, price, quantity, couponCode = "", paymentMethod = "credit_card") {
    const unitPrice = Number(price);
    const qty = Number(quantity);

    if (isNaN(unitPrice) || unitPrice <= 0 || isNaN(qty) || qty <= 0) {
      return { success: false, message: "Invalid product price or quantity." };
    }

    const subtotal = unitPrice * qty;

    // Category Discounts
    let categoryDiscountRate = 0;
    const cat = category.toLowerCase();
    if (cat === "electronics") categoryDiscountRate = 0.10; // 10%
    else if (cat === "clothing") categoryDiscountRate = 0.15; // 15%
    else if (cat === "books") categoryDiscountRate = 0.05;    // 5%

    const categoryDiscountAmount = subtotal * categoryDiscountRate;

    // Coupon Code Discounts
    let couponDiscountRate = 0;
    const code = couponCode.trim().toUpperCase();
    if (code === "SAVE10") couponDiscountRate = 0.10;
    else if (code === "SUPER20") couponDiscountRate = 0.20;

    const couponDiscountAmount = (subtotal - categoryDiscountAmount) * couponDiscountRate;
    const totalDiscount = categoryDiscountAmount + couponDiscountAmount;

    const discountedSubtotal = subtotal - totalDiscount;

    // Taxes (14% VAT)
    const vatRate = 0.14;
    const taxAmount = discountedSubtotal * vatRate;

    // Payment Method Processing Fee / Discount
    let paymentFee = 0;
    if (paymentMethod === "cash_on_delivery") {
      paymentFee = 5.00; // $5 COD fee
    }

    const finalTotal = discountedSubtotal + taxAmount + paymentFee;

    return {
      success: true,
      customerName,
      category,
      price: unitPrice,
      quantity: qty,
      subtotal,
      categoryDiscountAmount,
      couponDiscountAmount,
      totalDiscount,
      taxAmount,
      paymentFee,
      finalTotal
    };
  }
}

// Standalone execution test
if (require.main === module) {
  console.log("--- ATM SYSTEM DEMO ---");
  const atm = new AtmSystem("1234", 500);
  console.log(atm.checkBalance("1234"));
  console.log(atm.withdraw("1234", 100));
  console.log(atm.deposit("1234", 250));
  console.log(atm.changePin("1234", "9999"));
  console.log(atm.checkBalance("9999"));

  console.log("\n--- CHECKOUT SYSTEM DEMO ---");
  const bill = CheckoutSystem.calculateBill("John Doe", "electronics", 100, 2, "SAVE10", "credit_card");
  console.log(bill);
}

module.exports = { AtmSystem, CheckoutSystem };
