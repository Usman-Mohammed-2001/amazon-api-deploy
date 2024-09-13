const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_KEY);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success",
  });
});

app.post("/payment/create", async (req, res) => {
  try {
    const { total } = req.body;
    const amount = parseFloat(total);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Total must be a number greater than 0",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency: "USD",
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on PORT: http://localhost:5000");
});
