const router = require('express').Router();
const jwtVerify = require('../middleware/jwtVerify');
const User = require('../models/User');
const Account = require('../models/Account');
const Image = require('../models/Image');

router.post('/create', jwtVerify ,async (req, res)=> {
    const account = new Account({
        nickname: req.body.nickname,
        userId: req.user.userId,
        description: req.body.description,
        gender: req.body.gender,
        dob: new Date(req.body.dob),
        interestedIn: req.body.interestedIn,
        matchAgeMax: parseInt(req.body.ageMax),
        matchAgeMin: parseInt(req.body.ageMin)
    });

    const savedAccount = await account.save();
    res.json({
        message: 'Great, account information is saved',
        accountInfo: {
            accountId: savedAccount._id,
            userId: savedAccount.userId,
        }
    });
});

router.post('/upload', jwtVerify, async (req, res)=> {

    const image = new Image({
        downloadUrl: req.body.downloadUrl,
        caption: req.body.caption,
        userId: req.user.userId
    });

    try {
        const usrAccount = await Account.findOne({userId: req.user.userId});
        const savedImage = await image.save();
        usrAccount.images.push(savedImage);
        const accountUpdate = await usrAccount.save();

        res.json({
            message: "Image saved successfully",
            update: accountUpdate
        });
    } catch (error) {
        res.json({
            message: 'Error while saving the new image',
            error
        });
    }


})

module.exports = router;