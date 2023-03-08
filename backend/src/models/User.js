const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWTService = require('../services/JWTService');

const SALT_FACTOR = 10;

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    username: { type: String, default: null },
    password: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', function preSave(next) {
  const user = this;
  if (user.password === null) return next();

  // only hash the password if it has been modified (or is new)
  if (user.isModified('password') || user.isNew) {
    return bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
      if (err) return next(err);
      // hash the password using our new salt
      return bcrypt.hash(user.password, salt, (hasherr, hash) => {
        if (hasherr) return next(hasherr);
        user.password = hash;
        return next();
      });
    });
  }
  return next();
});

UserSchema.index({ username: 1 });

UserSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.createToken = function () {
  const jwt = new JWTService(this);
  return jwt.create();
};

// export UserSchema as a model
module.exports = mongoose.model('User', UserSchema);
