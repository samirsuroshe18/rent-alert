import asyncHandler from '../utils/asynchandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { Tenant } from '../models/tenant.model.js';
import mongoose from 'mongoose';
import axios from 'axios';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { deleteCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        // when we use save() method then all the fields are neccesary so to avoid that we have to pass an object with property {validatBeforeSave:false}
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something wwnt wrong while generating refresh and access token");
    }
}

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "email is required");
    }

    if (!password) {
        throw new ApiError(400, "password is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "Invalid user credential");
    }

    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credential");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -__v");

    //option object is created beacause we dont want to modified the cookie to front side
    const option = {
        httpOnly: 'true' === process.env.HTTP_ONLY,
        secure: 'true' === process.env.COOKIE_SECURE,
        maxAge: Number(process.env.COOKIE_MAX_AGE),
    }

    return res.status(200).cookie('accessToken', accessToken, option).cookie('refreshToken', refreshToken, option).json(
        new ApiResponse(200, { loggedInUser, accessToken, refreshToken }, "User logged in sucessully")
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user serched successfully")
    );
});

const logoutUser = asyncHandler(async (req, res) => {

    return res.status(200).clearCookie('accessToken').status(200).json(
        new ApiResponse(200, req.user, "User logged out successfully")
    );
});

const addTenant = asyncHandler(async (req, res) => {
    const { name, mobile, address } = req.body;

    // Handle optional file upload
    let profileUrl = null;

    if (req.file) {
        const file = req.file.path;
        const path = await uploadOnCloudinary(file);

        if (!path?.url) {
            throw new ApiError(500, "Failed to upload company logo");
        }

        profileUrl = path.url;
    }

    // Validate required fields
    if (!name?.trim() || !mobile?.trim() || !address?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    // Create tenant
    const user = await Tenant.create({
        name,
        mobile,
        address,
        profile: profileUrl, // Optional profile URL
    });

    const createdTenant = await Tenant.findById(user._id);

    if (!createdTenant) {
        throw new ApiError(500, "Something went wrong");
    }

    return res.status(200).json(
        new ApiResponse(200, createdTenant, "Tenant created successfully")
    );
});

const getTenants = asyncHandler(async (req, res) => {
    const tenants = await Tenant.find({});

    if (!tenants) {
        throw new ApiError(404, "No tenants found");
    }

    return res.status(200).json(
        new ApiResponse(200, tenants, "Tenants fetched successfully")
    );
});

const editTenant = asyncHandler(async (req, res) => {
    console.log("hello");
    const { name, mobile, address, id } = req.body;
    const tenantId = mongoose.Types.ObjectId.createFromHexString(id);

    // Handle optional file upload
    let profileUrl = null;

    if(!name?.trim() || !mobile?.trim() || !address?.trim()){
        throw new ApiError(400, "All fields are required");
    }

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
        throw new ApiError(404, "Tenant not found");
    }

    if(tenant.profile){
        await deleteCloudinary(tenant.profile);
    }

    if (req.file) {
        const file = req.file.path;
        const path = await uploadOnCloudinary(file);

        if (!path?.url) {
            throw new ApiError(500, "Failed to upload company logo");
        }

        profileUrl = path.url;
    }

    tenant.name = name;
    tenant.mobile = mobile;
    tenant.address = address;
    tenant.profile = profileUrl;

    const updatedTenant = await tenant.save();

    return res.status(200).json(
        new ApiResponse(200, updatedTenant, "Tenant updated successfully")
    );
});

const deleteTenant = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const tenantId = mongoose.Types.ObjectId.createFromHexString(id);

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
        throw new ApiError(404, "Tenant not found");
    }

    const isDeleted = await Tenant.deleteOne({ _id: id });

    if(!isDeleted){
        throw new ApiError(500, "Failed to delete tenant");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Tenant deleted successfully")
    );
});

const sendWhatsAppMessage = asyncHandler(async (req, res) => {
    const { mobile } = req.body;

    if(!mobile?.trim()){
        throw new ApiError(400, "Mobile number is required");
    }

    const payload = {
        trigger: "BMS",
        contact: mobile,
        phone_code: "+91",
        parameters: {
          d1: "10L/s"
        }
      }

    try {
        const response = await axios.post(
            process.env.XIRCLS_API,
            payload,
            {
              headers: {
                "Api-Key": process.env.API_KEY,
                "Whatsapp-Project-Key": process.env.WHATSAPP_PROJECT_KEY,
              },
            }
          );

          if(response.status !== 200){
            throw new ApiError(500, "Failed to send WhatsApp message");
          }

        return res.status(200).json(
            new ApiResponse(200, {}, "WhatsApp message sent successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Failed to send WhatsApp message");
    }
});

export {
    addTenant,
    getTenants,
    editTenant,
    deleteTenant,
    sendWhatsAppMessage,
    loginUser,
    getCurrentUser,
    logoutUser,
};
