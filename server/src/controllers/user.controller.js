import asyncHandler from '../utils/asynchandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    const { name, status, amount, address, mobile } = req.body;

    if(!userName?.trim() || !email?.trim() || !password?.trim()){
        throw new ApiError(400, "All fields are required");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Data saved successfully")
    );
});

export {
    registerUser,
};
