'use strict';

const site = require('./site');
const login = require('./login');
const getToken = require('./getToken');
const register = require('./register');
const putComment = require('./putComment');
const getComment = require('./getComment');

module.exports = {
  site,
  login,
  getToken,
  register,
  putComment,
  getComment
};
