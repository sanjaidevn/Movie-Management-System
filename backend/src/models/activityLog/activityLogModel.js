//region Imports
import mongoose from 'mongoose'
import { formatToIST } from '../../utils/commonFunctions.js'
//endregion Imports


//region Schema
const activityLogSchema = new mongoose.Schema(
    {
        'Log-Id': {
            type: mongoose?.Schema?.Types?.ObjectId,
            required: true,
            unique: true,
            default: () => new mongoose.Types.ObjectId() ?? '',
        },

        'Activity-Type': {
            type: String,
            required: true,
            default: '',
            index: true,
        },

        Method: {
            type: String,
            required: true,
            default: '',
            index: true,
        },

        Url: {
            type: String,
            required: true,
            default: '',
            index: true,
        },

        'Status-Code': {
            type: Number,
            required: true,
            default: 0,
            index: true,
        },

        Ip: {
            type: String,
            required: true,
            default: '',
        },

        'User-Agent': {
            type: String,
            required: true,
            default: '',
        },

        'User-Id': {
            type: String,
            required: false,
            default: '',
            index: true,
        },

        'User-Email': {
            type: String,
            required: false,
            default: '',
            index: true,
        },

        Role: {
            type: String,
            required: false,
            default: '',
            index: true,
        },

        'Request-Body': {
            type: Object,
            required: false,
            default: {},
        },

        Query: {
            type: Object,
            required: false,
            default: {},
        },

        Params: {
            type: Object,
            required: false,
            default: {},
        },

        'Response-Body': {
            type: Object,
            required: false,
            default: {},
        },

        'Duration-Ms': {
            type: Number,
            required: false,
            default: 0,
        },

        'Created-At': {
            type: String,
            required: true,
            default: () => formatToIST?.({}),
        },
    },
    {
        timestamps: false,
    }
)
//endregion Schema

//region Indexes
activityLogSchema?.index?.({ 'Created-At': -1 })
//endregion Indexes

//region Model
const ActivityLogModel =
    mongoose?.models?.ActivityLog ?? mongoose?.model?.('ActivityLog', activityLogSchema)
//endregion Model

export { ActivityLogModel }
