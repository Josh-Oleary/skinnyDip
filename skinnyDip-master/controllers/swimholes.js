const Swimhole = require('../models/swimhole');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary');



module.exports.index = async (req, res) => {
    const swimholes = await Swimhole.find({});
    res.render('./swimholes/index', { swimholes })
}

module.exports.renderNewForm = (req, res) => {
    res.render('swimholes/new')
}

module.exports.createSwimhole = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.swimhole.location,
        limit: 1
    }).send();
    //make swimhole with data in req.body
    const swimhole = new Swimhole(req.body.swimhole);
    //add geometry from geocode api
    swimhole.geometry = geoData.body.features[0].geometry;
    //add cloudinary files
    swimhole.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    //assign swimhole author
    swimhole.author = req.user._id;
    await swimhole.save();
    console.log(swimhole);
    req.flash('success', 'Succesfully made a new swimming hole');
    res.redirect(`/swimholes/${swimhole._id}`);
}

module.exports.showSwimhole = (async (req, res) => {
    const swimhole = await Swimhole.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!swimhole) {
        req.flash('error', 'Swimming hole does not exist')
        return res.redirect('/swimholes');
    }
    res.render('swimholes/show', { swimhole })
})

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const swimhole = await Swimhole.findById(id);
    if (!swimhole) {
        req.flash('error', 'Swimming hole does not exist')
        return res.redirect('/swimholes');
    }
    res.render('swimholes/edit', { swimhole });
}

module.exports.updateSwimhole = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const swimhole = await Swimhole.findByIdAndUpdate(id, { ...req.body.swimhole });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    swimhole.images.push(...imgs)
    await swimhole.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await swimhole.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    res.redirect(`/swimholes/${swimhole._id}`);
}

module.exports.deleteSwimhole = async (req, res) => {
    const { id } = req.params;
    await Swimhole.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted swimming hole');
    res.redirect('/swimholes');
}