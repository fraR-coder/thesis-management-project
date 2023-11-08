const express = require('express');
const auth = require('./auth/auth.js');
const student = require('./controller/student.js');

const router = express.Router();

/*session routes*/

router.post('/sessions', auth.login);
router.get('/sessions/current', auth.getCurrentSession);
router.delete('/sessions/current', auth.isLoggedIn, auth.logout);

/*other routes down there, use the middleware isloggedin to protect the route (hopefully) */
router.post('/newapplication', student.insertNewApplication);

module.exports = router;