const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema(
    {
        postOwnnerID: String,
        postImg: String,
        postText: String,
        postComment: [{
            commentID: String,
            commentText: String
        }],
        update_at: {
            type: Date,
            default: Date.now()
        }
    },
    {
        collection: 'Posts'
    }
)

module.exports = mongoose.model('Posts', PostsSchema)