const jwt = require('jsonwebtoken');

class JWTService {
  constructor(payload, expire = '365 days') {
    this.expiresIn = expire;
    this.secret = process.env.JWT_SECRET;
    this.payload = payload;
  }

  create() {
    return jwt.sign(this.payload.toObject(), this.secret, { expiresIn: this.expiresIn });
  }

  static getToken(req) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }

  // eslint-disable-next-line consistent-return
  static async verifyToken(req, res, next) {
    const token = JWTService.getToken(req);

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } else {
      return res.status(400).json({ status: 'No token provided' });
    }
  }
}

module.exports = JWTService;
