const router = require('express').Router()
const jwtVerify = require('../middleware/jwtVerify')
const User = require('../models/User')
const Account = require('../models/Account')
const Image = require('../models/Image')

//User creates account

router.post('/create', jwtVerify ,async (req, res)=> {
    const account = new Account({
        nickname: req.body.nickname,
        userId: req.user.userId,
        description: req.body.description,
        gender: req.body.gender,
        dob: new Date(req.body.dob),
        interestedIn: req.body.interestedIn,
        matchAgeMax: parseInt(req.body.ageMax),
        matchAgeMin: parseInt(req.body.ageMin),
        country: req.body.country,
        region: req.body.region,
        city: req.body.city
    })

    const savedAccount = await account.save();
    res.json({
        message: 'Great, account information is saved',
        accountInfo: {
            accountId: savedAccount._id,
            userId: savedAccount.userId,
        }
    })
})

//User uploads photographs to their account

router.post('/upload', jwtVerify, async (req, res)=> {

    const image = new Image({
        downloadUrl: req.body.downloadUrl,
        caption: req.body.caption,
        userId: req.user.userId
    });

    try {
        const usrAccount = await Account.findOne({userId: req.user.userId})
        const savedImage = await image.save()
        usrAccount.avatar = savedImage.downloadUrl
        usrAccount.images.push(savedImage)
        const accountUpdate = await usrAccount.save()

        res.json({
            message: "Image saved successfully",
            update: accountUpdate
        })
    } catch (error) {
        res.json({
            message: 'Error while saving the new image',
            error
        })
    }


})

//User retrieves their own account to display information
router.get('/info', jwtVerify, async (req, res)=> {
    try {
        const account = await Account.findOne({userId: req.user.userId}).populate('images').populate('invitations')

        res.json({
            message: 'Account retrieved successfully',
            account: account,
            
        })

    } catch (error) {
        res.json({
            message: "error retrieving users account: ",
            err: error 
        })
    }  


});
//Retrieving the account of a user whose account is currently being viewed 
router.get('/info/:id', jwtVerify, async (req, res)=> {
    try {
        const account = await Account.findOne({_id: req.params.id}).populate('images')
 
        res.json({
            message: 'Account retrieved successfully',
            account: account,

        })

    } catch (error) {
        res.json({
            message: "error retrieving users account: ",
            err: error 
        })
    }  


});
//User updates information in their own account 
router.post('/update/:id', jwtVerify, async (req, res) => {
    const update = req.body.account;
    try {
        const updatedAccount = await Account.findByIdAndUpdate(req.params.id, update)
        res.json({
            message: "Updated Successfully",
            data: updatedAccount
        })
    } catch (error) {
        res.json({
            error: error
        })
    }
})

//Retrieving users that have recently been logged in

router.get('/recent-users', jwtVerify, async (req, res) => { //******THE ALGORITHM IS NOT COMPLETE*/
    try{
        const accounts = await Account.find({})
        res.json({
            message: "Recent accounts retrieved",
            accounts: accounts
        })
    } catch(err) {
        console.log(err);
        res.json({
            message: "Error retrieving recently active accounts",
            error: err
        })
    }
})

module.exports = router