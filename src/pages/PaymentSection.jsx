import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function PaymentSection() {
  const location = useLocation();
  const { courseId } = location.state || {};
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [status, setStatus] = useState({ loading: false, message: "", type: "" });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  console.log(selectedMethod);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMethod) {
      setStatus({ message: "Please select a payment method!", type: "error" });
      return;
    }

    setStatus({ loading: true, message: "", type: "" });

    try {
      // 🌐 Backend API call
      const res = await axios.post(
        `http://localhost:8080/api/payment/add/${user.id}/${courseId}`,
        {
          method: selectedMethod,
          details: paymentDetails,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus({
        loading: false,
        message: "✅ Payment successful!",
        type: "success",
      });

      console.log("Payment Response:", res.data);
    } catch (err) {
      console.error("Payment Error:", err);
      setStatus({
        loading: false,
        message: "❌ Payment failed. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto mt-16 bg-white shadow-2xl rounded-3xl p-8 border border-gray-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Animated Header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-1">Secure Payment</h2>
        <p className="text-gray-500 text-sm">
          Paying for Course ID: <span className="font-semibold text-blue-600">{courseId}</span>
        </p>
      </motion.div>

      {/* Payment Options */}
      <motion.div
        className="space-y-3 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          "UPI",
          "Debit Card",
          "Credit Card",
          "Net Banking",
          "Cash on Delivery",
          "Bank Transfer",
        ].map((method, i) => (
          <motion.label
            key={method}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`flex items-center p-3 border rounded-xl cursor-pointer shadow-sm ${
              selectedMethod === method
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={selectedMethod === method}
              onChange={() => setSelectedMethod(method)}
              className="mr-3 accent-blue-600"
            />
            <span className="text-gray-800 font-medium">{method}</span>
          </motion.label>
        ))}
      </motion.div>

      {/* Dynamic Payment Fields */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedMethod ? 1 : 0 }}
        className="mb-6"
      >
        {selectedMethod === "UPI" && (
          <motion.input
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            type="text"
            name="upiId"
            placeholder="Enter UPI ID (e.g. user@upi)"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        {(selectedMethod === "Debit Card" ||
          selectedMethod === "Credit Card") && (
          <motion.div
            className="space-y-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex space-x-2">
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                onChange={handleChange}
                className="w-1/2 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                onChange={handleChange}
                className="w-1/2 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </motion.div>
        )}

        {selectedMethod === "Net Banking" && (
          <motion.select
            name="bank"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Your Bank</option>
            <option>State Bank of India</option>
            <option>HDFC Bank</option>
            <option>ICICI Bank</option>
            <option>Axis Bank</option>
            <option>Punjab National Bank</option>
          </motion.select>
        )}

        {selectedMethod === "Cash on Delivery" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700"
          >
            You can pay with cash once your course materials are delivered.
          </motion.p>
        )}

        {selectedMethod === "Bank Transfer" && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-gray-700"
          >
            <p>
              Please transfer to: <br />
              <strong>Account Name:</strong> Kitto Shop Pvt Ltd <br />
              <strong>Account No:</strong> 1234567890 <br />
              <strong>IFSC:</strong> SBIN0001234
            </p>
            <input
              type="text"
              name="transactionId"
              placeholder="Enter Transaction ID"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none mt-3 focus:ring-2 focus:ring-blue-400"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Status Message */}
      {status.message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-xl text-center font-semibold ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </motion.div>
      )}

      {/* Pay Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={status.loading}
        onClick={handleSubmit}
        className={`w-full py-3 font-semibold text-white rounded-xl shadow-lg transition-all ${
          status.loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {status.loading ? "Processing..." : "Proceed to Pay"}
      </motion.button>
    </motion.div>
  );
}
