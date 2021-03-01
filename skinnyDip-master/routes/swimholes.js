const express = require('express');
const router = express.Router();
const swimholes = require('../controllers/swimholes')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateSwimhole } = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(swimholes.index))
    .post(isLoggedIn, upload.array('image'), validateSwimhole, catchAsync(swimholes.createSwimhole))
   
router.route('/new')
    .get(isLoggedIn, swimholes.renderNewForm)

router.route('/:id')
    .get(catchAsync(swimholes.showSwimhole))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateSwimhole, catchAsync(swimholes.updateSwimhole))
    .delete(isLoggedIn, isAuthor, catchAsync(swimholes.deleteSwimhole))


router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(swimholes.renderEditForm))

module.exports = router;