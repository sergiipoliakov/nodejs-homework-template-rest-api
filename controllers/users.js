const jwt = require('jsonwebtoken');
const jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');
const Users = require('../model/users');
const EmailService = require('../services/email');
const { HttpCode } = require('../helper/constants');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const reg = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email);

  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email is ready use',
    });
  }
  try {
    const newUser = await Users.create(req.body);
    const { id, name, email, avatar, verifyTokenEmail, subscription } = newUser;

    try {
      const emailService = new EmailService(process.env.NODE_ENV);
      await emailService.sendVerifyEmail(verifyTokenEmail, email, name);
    } catch (e) {
      //loger
      console.log('newUserCreate', e.message);
    }
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id,
        email,
        subscription,
        avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  const isValidPassword = await user?.validPassword(password);
  if (!user || !isValidPassword || !user.verify) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'Unauthorized',
      code: HttpCode.UNAUTHORIZED,
      message: 'Invalid credentials',
    });
  }
  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
  await Users.updateToken(user.id, token);
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: {
      token,
      user: { email: user.email, subscription: user.subscription },
    },
  });
};

const current = async (req, res, next) => {
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: {
      user: { email: req.user.email, subscription: req.user.subscription },
    },
  });
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const updateAvatar = async (req, res, next) => {
  const { id } = req.user;
  const avatarUrl = await saveAvatarUsers(req);
  await Users.updateAvatar(id, avatarUrl);
  return res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { avatarUrl } });
};

const saveAvatarUsers = async req => {
  const FOLDER_AVATARS = process.env.FOLDER_AVATARS;
  // req.file
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`;
  const img = await jimp.read(pathFile);

  await img
    .autocrop()
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);

  try {
    await fs.rename(
      pathFile,
      path.join(process.cwd(), 'public', FOLDER_AVATARS, newNameAvatar),
    );
  } catch (e) {
    console.log(e.message);
  }

  const oldAvatar = req.user.avatar;
  console.log(oldAvatar);

  console.log(`${FOLDER_AVATARS}/`);

  if (oldAvatar.includes(`${FOLDER_AVATARS}/`)) {
    await fs.unlink(path.join(process.cwd(), 'public', oldAvatar));
  }
  return path.join(FOLDER_AVATARS, newNameAvatar);
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyTokenEmail(
      req.params.verificationToken,
    );
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { message: 'Verification successFull' },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'Your verification token is not valid. Contact to administrator',
    });
  } catch (error) {
    next(error);
  }
};

const repeatEmailVerify = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      const { name, verifyTokenEmail, email } = user;

      const emailService = new EmailService(process.env.NODE_ENV);
      await emailService.sendVerifyEmail(verifyTokenEmail, email, name);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { message: 'Verification email resubmitted' },
      });
    }
    return res.status(HttpCode.NOF_FOUND).json({
      status: 'error',
      code: HttpCode.NOF_FOUND,
      message: 'User not found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  reg,
  login,
  logout,
  current,
  updateAvatar,
  verify,
  repeatEmailVerify,
};
