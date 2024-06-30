const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        userName: String,
        userLastName: String,
        userEmail: String,
        password: String,
        image: String,
        story: String,
        userGender: String,
        userDate: String,
        update_at: {
            type: Date,
            default: Date.now()
        }

    },
    {
        collection: "User"
    }
)

module.exports = mongoose.model('User', UserSchema)