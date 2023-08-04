const path = require('path');

//For uploading files
exports.uploadFiles = async (req, res) => {
    const files = req.files;
    if(Array.isArray(files) && files.length > 0){
        res.json(files);
    }
    else{
        throw new Error('No files uploaded');
    }
};

//For downloading files
exports.fetchFile = async (req, res) => {
    if(!req.body.filename){
        res.status(404).send({ message: "Filename is not provided" });
        return;
    }
    else
    {
        filepath = path.join(__dirname, '..', '..','uploads', req.body.filename);
        res.send(filepath)
    }
}