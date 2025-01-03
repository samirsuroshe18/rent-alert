import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Checkout } from "../models/checkout.model.js";

const submitCheckout = asyncHandler(async (req, res) => {
    const { name, email, address, city, state, pin, amount, mobile } = req.body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !address?.trim() || !city?.trim() || 
        !state?.trim() || !pin?.trim() || !amount || !mobile?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    // Optional: Additional validation for fields like email, pin, and mobile
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const pinRegex = /^\d{6}$/; // Assuming a 6-digit PIN
    const mobileRegex = /^\d{10}$/; // Assuming a 10-digit mobile number

    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }
    if (!pinRegex.test(pin)) {
        throw new ApiError(400, "Invalid PIN code");
    }
    if (!mobileRegex.test(mobile)) {
        throw new ApiError(400, "Invalid mobile number");
    }

    // Save to database
    const checkoutData = new Checkout({
        name,
        email,
        address,
        city,
        state,
        pin,
        amount,
        mobile,
    });

    const savedCheckout = await checkoutData.save();

    // Return success response
    return res.status(200).json(
        new ApiResponse(200, savedCheckout, "Checkout submitted successfully")
    );
});


export { submitCheckout };