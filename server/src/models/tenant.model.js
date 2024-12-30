import mongoose, { Schema } from "mongoose";

const tenantSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    address: {
        type: String,
        required: true,
        trim: true,
    },

    mobile: {
        type: String,
        required: true,
        trim: true,
    },

}, { timestamps: true });

export const Tenant = mongoose.model("Tenant", tenantSchema);