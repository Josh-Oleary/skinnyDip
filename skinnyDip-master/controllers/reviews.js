const Review = require('../models/review');
const Swimhole = require('../models/swimhole');

module.exports.createReview = async (req,res) => {
    const swimhole = await Swimhole.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    swimhole.reviews.push(review);
    await review.save();
    await swimhole.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/swimholes/${swimhole._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Swimhole.findByIdAndUpdate(id, {$pull: {reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/swimholes/${id}`);
}