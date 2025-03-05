const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password needs to be at least 8 characters long."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.hash(user.password, 10).then((hash) => {
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

const User = model("User", userSchema);

module.exports = User;
