const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema(
    {
        storyOwnerID: String,
        storyImg: String,
        storyText: String,
        update_at: {
            type: Date,
            default: Date.now()
        }
    },
    {
        collection: 'story'
    }
)

module.exports = mongoose.model('Story', StorySchema)