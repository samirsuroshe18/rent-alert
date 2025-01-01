import dotenv from "dotenv";
dotenv.config()
import asyncHandler from '../utils/asynchandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate SHA256 hash
const generateHash = (string) => {
    return crypto.createHash('sha256').update(string).digest('hex');
};

// Helper function to encode payload
const encodePayload = (payload, endpoint) => {
    try {
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        // Include the endpoint in the hash calculation
        const hashString = base64Payload + endpoint + process.env.SALT_KEY;
        const hash = generateHash(hashString) + "###" + process.env.KEY_INDEX;
        
        console.log('Base64 Payload:', base64Payload);
        console.log('Hash String:', hashString);
        console.log('Final Hash:', hash);
        
        return { payload: base64Payload, hash };
    } catch (error) {
        console.error('Encode Payload Error:', error);
        throw error;
    }
};

const initiatePayment = asyncHandler(async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount) {
            throw new ApiError(400, "Amount is required");
        }

        const merchantTransactionId = uuidv4();
        console.log('Merchant Transaction ID:', merchantTransactionId);
        
        const payload = {
            merchantId: process.env.MERCHANT_ID,
            merchantTransactionId: "1234567890",
            merchantUserId: "1234", // Added merchantUserId
            amount: amount * 100,
            redirectUrl: "http://localhost:8000/api/v1/phonepe/callback",
            redirectMode: "POST",
            callbackUrl: "http://localhost:8000/api/v1/phonepe/webhook",
            mobileNumber: "9999999999",
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        console.log('Request Payload:', payload);

        const { payload: encodedPayload, hash } = encodePayload(payload, "/pg/v1/pay");

        console.log('Encoded Request:', {
            request: encodedPayload,
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': hash
            }
        });

        const response = await axios.post(
            `${process.env.PHONEPE_HOST}/pg/v1/pay`,
            { request: encodedPayload }, // this is the payload data
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-VERIFY': hash
                }
            }
        );        

        console.log('PhonePe Response:', response.data);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    ...response.data,
                    merchantTransactionId,
                },
                "Payment initiated successfully"
            )
        );
    } catch (error) {
        console.error('Payment Error Details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.message || error.message
        );
    }
});

const checkStatus = asyncHandler(async (req, res) => {
    try {
        const { merchantTransactionId } = req.body;

        if (!merchantTransactionId) {
            throw new ApiError(400, "merchantTransactionId is required");
        }

        const payload = {
            merchantId: process.env.MERCHANT_ID,
            merchantTransactionId: merchantTransactionId
        };

        const { payload: encodedPayload, hash } = encodePayload(
            payload,
            `/pg/v1/status/${merchantTransactionId}`
        );

        const response = await axios.get(
            `${process.env.PHONEPE_HOST}/pg/v1/status/${merchantTransactionId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': hash,
                    'X-MERCHANT-ID': process.env.MERCHANT_ID
                }
            }
        );

        return res.status(200).json(
            new ApiResponse(200, response.data, "Payment status checked successfully")
        );
    } catch (error) {
        console.error('Status Check Error:', error.response?.data || error);
        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.message || "Status check failed"
        );
    }
});

const callback = asyncHandler(async (req, res) => {
    try {
        console.log('Callback Received:', req.body);
        const { transaction } = req.body;
        res.redirect('http://localhost:5174/payment-status?status=' + transaction.status);
    } catch (error) {
        console.error('Callback Error:', error);
        res.redirect('http://localhost:5174/payment-status?status=error');
    }
});

const webhook = asyncHandler(async (req, res) => {
    try {
        console.log('Webhook Received:', req.body);
        const payload = req.body;
        res.json({ status: 'OK' });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ status: 'ERROR' });
    }
});

export {
    initiatePayment,
    checkStatus,
    callback,
    webhook
};