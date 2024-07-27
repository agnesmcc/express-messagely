const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function (req, res, next) {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }
    let authenticated = await User.authenticate(username, password);
    if (!authenticated) {
      throw new ExpressError("Invalid username/password", 400);
    }
    await User.updateLoginTimestamp(username);
    let token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async function (req, res, next) {
  try {
    let { username, password, first_name, last_name, phone } = req.body;
    if (!username || !password || !first_name || !last_name || !phone) {
      throw new ExpressError("Missing required data", 400);
    }
    let user = await User.register({ username, password, first_name, last_name, phone });
    await User.updateLoginTimestamp(username);
    let token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
})

module.exports = router;
