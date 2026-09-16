/**
 * Task 2: Online Store Order Processing System (Functions & Arrays)
 * 
 * Demonstrates:
 * - Array iteration and filtering
 * - Conditional logic and status validation
 * - Revenue aggregation and order metrics tracking
 */

function processOrders(orders, revenueTarget = Infinity, maxInvalidThreshold = Infinity) {
  let totalRevenue = 0;
  let successfulOrders = 0;
  let skippedOrders = 0;
  let invalidOrdersCount = 0;
  const processedLog = [];

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    // Check Stop Condition 1: Revenue target reached
    if (totalRevenue >= revenueTarget) {
      processedLog.push(`⏹️ Stopping processing: Target revenue of $${revenueTarget} reached.`);
      break;
    }

    // Check Stop Condition 2: Max invalid/cancelled orders threshold exceeded
    if (invalidOrdersCount >= maxInvalidThreshold) {
      processedLog.push(`⛔ Stopping processing: Invalid/Cancelled orders limit (${maxInvalidThreshold}) reached.`);
      break;
    }

    // Rule 1: Skip if status is cancelled/invalid OR stock unavailable
    if (order.status !== "valid" || !order.stockAvailable) {
      skippedOrders++;
      if (order.status === "cancelled" || order.status === "invalid") {
        invalidOrdersCount++;
      }
      processedLog.push(`⚠️ Order #${order.id} skipped (Status: '${order.status}', Stock: ${order.stockAvailable ? 'Available' : 'Out of Stock'})`);
      continue;
    }

    // Rule 2: Process valid order with available stock
    totalRevenue += Number(order.amount);
    successfulOrders++;
    processedLog.push(`✅ Order #${order.id} processed successfully: +$${Number(order.amount).toFixed(2)} (Total Revenue: $${totalRevenue.toFixed(2)})`);
  }

  return {
    totalRevenue,
    successfulOrders,
    skippedOrders,
    invalidOrdersCount,
    processedLog
  };
}

// Sample Dataset & Demonstration
const sampleOrders = [
  { id: 101, status: "valid", stockAvailable: true, amount: 150 },
  { id: 102, status: "cancelled", stockAvailable: true, amount: 80 },
  { id: 103, status: "valid", stockAvailable: false, amount: 200 },
  { id: 104, status: "valid", stockAvailable: true, amount: 350 },
  { id: 105, status: "invalid", stockAvailable: true, amount: 50 },
  { id: 106, status: "valid", stockAvailable: true, amount: 120 }
];

if (require.main === module) {
  console.log("--- ONLINE STORE ORDER PROCESSING DEMO ---");
  const result = processOrders(sampleOrders, 500, 2);
  console.log("Log Output:");
  result.processedLog.forEach(log => console.log(log));
  console.log("\nSummary Metrics:", {
    totalRevenue: `$${result.totalRevenue.toFixed(2)}`,
    successfulOrders: result.successfulOrders,
    skippedOrders: result.skippedOrders
  });
}

module.exports = { processOrders };
