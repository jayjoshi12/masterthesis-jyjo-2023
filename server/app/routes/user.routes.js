const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {

  // These are test api's, we will update these according to roles
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get(
    "/api/test/users",
    controller.getUsers
  );

  app.delete(
    "/api/test/deleteUser/:id",
    controller.deleteUser
  );
  app.get(
    "/api/test/getUser/:id",
    controller.getUser
  );
  app.post(
    "/api/test/updateUser/:id",
    controller.updateUser
  );
};
