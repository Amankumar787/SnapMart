// backend/testEmail.js

require("dotenv").config();
const { sendOrderConfirmation } = require("./services/email");

const fakeOrder = {
  _id: "TEST123",
  createdAt: new Date(),
  paymentMethod: "UPI",
  items: [
    { name: "Nike Shoes", quantity: 1, price: 2999 },
    { name: "White T-Shirt", quantity: 2, price: 499 },
  ],
  discount: 200,
  shippingCharge: 0,
  totalAmount: 3797,
  shippingAddress: {
    street: "123 MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
  },
};

sendOrderConfirmation({
  email: "test@example.com",
  name: "Rahul",
  order: fakeOrder,
})
  .then(() => console.log("✅ Email sent! Check Mailtrap inbox."))
  .catch((err) => console.error("❌ Failed:", err.message));