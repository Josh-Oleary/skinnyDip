const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;
//https://res.cloudinary.com/demo/image/upload/w_300,h_200,c_crop/sample.jpg

const ImageSchema = new Schema ({
        url: String,
        filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
   return this.url.replace('/upload', '/upload/c_scale,w_200')
});

const opts = { toJSON: { virtuals: true } };

const SwimholeSchema = new Schema ({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
        type: String,
        enum: ['Point'],
        required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: String,
    description: String,
    location: String,
    type: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

SwimholeSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/swimholes/${this._id}">${this.title}</a></strong>`
 });

SwimholeSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Swimhole', SwimholeSchema);