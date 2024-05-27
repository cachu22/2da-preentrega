import express from 'express';
const welcomeRouter = express.Router();

welcomeRouter.get('/welcome', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('home', {
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName
    });
});

export default welcomeRouter;