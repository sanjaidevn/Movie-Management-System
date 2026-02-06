//region Imports
import mongoose from 'mongoose'
import { formatToIST } from '../../utils/commonFunctions.js'
//endregion Imports

//region Schema
const movieSchema = new mongoose.Schema(
    {
        'Movie-Id': {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
            default: () => new mongoose.Types.ObjectId() ?? '',
        },

        Title: {
            type: String,
            required: true,
            default: '',
            index: true,
        },

        Language: {
            type: String,
            required: true,
            default: '',
            index: true,
        },

        Genres: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            default: [""],
            index: true,
        },

        'Release-Year': {
            type: Number,
            required: false,
            default: null,
            index: true,
        },

        'Is-Deleted': {
            type: Number,
            required: true,
            default: 0,
            enum: [0, 1],
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
        timestamps: false,
    }
)
//endregion Schema

//region Indexes
// Duplicate prevention option 1 (Title + Release-Year + Language)
movieSchema?.index?.({ Title: 1, 'Release-Year': 1, Language: 1, 'Is-Deleted': 1 }, { unique: true })
//endregion Indexes

//region Model
const MovieModel = mongoose?.models?.Movie ?? mongoose?.model?.('Movie', movieSchema)
//endregion Model

export { MovieModel }
