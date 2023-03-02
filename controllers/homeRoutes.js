const router = require('express').Router();
const { Profile, User } = require('../models') 
const withAuth = require('../utils/auth')

router.get('/', async (req, res) => {
  try{
    const profileData = await Profile.findAll({
      include: [
        {
          model: User,
          attributes: {exclude:['password']},
        },
      ],
    });

const profiles = profileData.map((profile) => profile.get({ plain: true }));

res.render('homepage', {
  profiles,
  logged_in: req.session.logged_in
});
  } catch(err) {
    res.status(500).json(err);
  }
});  


router.get('/myprofile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findOne( {
      where: {
        id: req.session.user_id,
      },
      attributes: {exclude:['password']},
      include: { model: Profile },
    });
    console.log(userData);
    const users = userData.get({ plain: true });
    res.render('myprofile', {
      users,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/leaderboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findOne( {
      where: {
        id: req.session.user_id,
      },
      attributes: {exclude:['password']},
      include: { model: Profile },
    });
    const users = userData.get({ plain: true });
    res.render('leaderboard', {
      users,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/myprofile');
    return;
  }

  res.render('login');
});

router.get('/aboutus', (req, res) => {
return res.render('aboutus', {});
});  


module.exports = router;