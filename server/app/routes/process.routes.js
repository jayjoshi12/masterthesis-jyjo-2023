const controller1 = require("../controllers/process.controller");
const controller2 = require("../controllers/uploadFiles.controller");
const multer = require('multer');

//For uploading files
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, 'server/uploads')
  },
  filename: (req, file, callBack) => {
      callBack(null, Date.now()+file.originalname)
  }
})
const upload = multer({ storage: storage })

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // APIs for process
  app.post("/api/test/createProcess",controller1.createProcess);
  app.get("/api/test/processes/:ownerId", controller1.fetchProcesses);
  app.get("/api/test/process/:id", controller1.fetchProcess);
  app.put("/api/test/updateProcess/:id", controller1.updateProcess);
  app.delete("/api/test/deleteProcess/:id", controller1.deleteProcess);
  app.get("/api/test/steps/:username", controller1.fetchSteps);
  app.get("/api/test/contributionSteps/:username", controller1.fetchContributionSteps);
  app.post("/api/test/addNote", controller1.addNote);
  app.post("/api/test/checkedStep", controller1.checkedStep);
  app.post("/api/test/completeStep", controller1.completeStep);
  app.post("/api/test/files", upload.array('file'), controller2.uploadFiles);
  app.post("/api/test/file", controller2.fetchFile);
};
