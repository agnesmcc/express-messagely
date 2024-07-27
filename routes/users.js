const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const ExpressError = require("../expressError");
const { authenticateJWT } = require("../middleware/auth");


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get("/", authenticateJWT, async function (req, res, next) {
  try {
    if (!req.user) throw new ExpressError("Unauthorized", 401);
    let users = await User.all();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username", authenticateJWT, async function (req, res, next) {
  try {
    if (!req.user) throw new ExpressError("Unauthorized", 401);
    if (req.user.username !== req.params.username) throw new ExpressError("Unauthorized", 401);
    let user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/to", authenticateJWT, async function (req, res, next) {
  try {
    if (!req.user) throw new ExpressError("Unauthorized", 401);
    if (req.user.username !== req.params.username) throw new ExpressError("Unauthorized", 401);
    let m = await User.messagesTo(req.params.username);
    return res.json({ messages: m });
  } catch (err) {
    return next(err);
  }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/from", authenticateJWT, async function (req, res, next) {
  try {
    if (!req.user) throw new ExpressError("Unauthorized", 401);
    if (req.user.username !== req.params.username) throw new ExpressError("Unauthorized", 401);
    let m = await User.messagesFrom(req.params.username);
    return res.json({ messages: m });
  } catch (err) {
    return next(err);
  }
})

module.exports = router
