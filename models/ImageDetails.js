const mongoose = require('mongoose')

const ImageDetailsSchema = new mongoose.Schema(
    {
        owner: String,
        image: String,
        update_at: {
            type: Date,
            default: Date.now
        }

    },
    {
        collection: "ImageDetails"
    }
)

module.exports = mongoose.model('ImageDetails', ImageDetailsSchema)