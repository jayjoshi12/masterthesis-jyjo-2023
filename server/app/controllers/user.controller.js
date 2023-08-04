const { user, role }  = require("../models/index");
var bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getUsers = async (req, res) => {
  const users = await user.find().populate('roles');
  if (!users) {
    res.status(500).send({ message: err });
    return;
  }
  res.status(200).send(users);
}

exports.deleteUser = async (req, res) => {
  const deletedUser = await user.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    res.status(500).send({ message: err });
    return;
  }
  res.status(200).send('User deleted successfully');
}

exports.getUser = async (req, res) => {
  const userFound = await user.findById(req.params.id).populate('roles');
  if (!userFound) {
    res.status(500).send({ message: err });
    return;
  }
  res.status(200).send(userFound);
}

exports.updateUser = async (req, res) => {
  const userFound = await user.findById(req.params.id);
  const userRole = await role.find({ name: req.body.roles[0]});
  if (!userFound || !role) {
    res.status(500).send({ message: err });
    return;
  }
  userFound.username = req.body.username;
  userFound.email = req.body.email;
  userFound.roles = userRole[0]._id;
  if(req.body.password === userFound.password)
  {
    userFound.password = req.body.password;
  }
  else{
    userFound.password = bcrypt.hashSync(req.body.password, 8);
  }
  await userFound.save();
  res.status(200).send(userFound);
}
