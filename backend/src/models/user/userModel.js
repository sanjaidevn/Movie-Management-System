//region Imports
import mongoose from 'mongoose'
import { formatToIST } from '../../utils/commonFunctions.js'
//endregion Imports


//region Schema
const userSchema = new mongoose.Schema(
    {
        'User-Id': {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
            default: () => new mongoose.Types.ObjectId() ?? '',
        },

        Name: {
            type: String,
            required: true,
            default: '',
        },

        'Email-Address': {
            type: String,
            required: true,
            default: '',
            unique: true,
        },

        'Hashed-Password': {
            type: String,
            required: true,
            default: '',
        },

        Role: {
            type: String,
            required: true,
            default: 'user',
            index: true,
        },

        'Is-Deleted': {
            type: Number,
            required: true,
            default: 0,
            index: true,
        },

        'Created-At': {
            type: String,
            required: true,
            default: () => formatToIST?.({}),
            index: true,
        },

        'Updated-At': {
            type: String,
            required: true,
            default: () => formatToIST?.({}),
        },
    },
    {
        timestamps: false, // we manage Created-At and Updated-At manually
    }
)
//endregion Schema

//region Model
const UserModel = mongoose?.models?.User ?? mongoose?.model?.('User', userSchema)
//endregion Model

export { UserModel }
