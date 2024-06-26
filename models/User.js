const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        userName: String,
        userEmail: String,
        userPhone: Number,
        userImage: String,
        userStory: String,
        update_at: {
            type: Date,
            default: Date.now
        }

    },
    {
        collection: "User"
    }
)

module.exports = mongoose.model('User', UserSchema)