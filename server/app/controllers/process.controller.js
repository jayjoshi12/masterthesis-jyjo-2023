const mongoose  = require("mongoose");
const db = require("../models");
const User = db.user;
const Process = db.process;
const apiKey = '52b2b6f4935f1b5fee95a750f8ea8157-52d193a0-a61b7b72';
const domain = 'sandbox740698b8ad674becb48d782204af0b22.mailgun.org';
const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});

//sendEmail
sendEmail = async (req, title, message) => {
    const users = await User.find({ username: { $in: req.body.informedPerson } });
    console.log(users)
    users.forEach(recipient => {
        var data = {
            from: 'Excursion Mangement <excursionmangement@gmail.com>',
            to: recipient.email,
            subject: title,
            text: message
        };
        
        mailgun.messages().send(data, function (error, body) {
            if(error) {
                console.log(error);
            }
            console.log(body);
        });
    });
}

// Create and Save a new Process
exports.createProcess = async (req, res) => {
    const process = new Process({
        processName: req.body.processName,
        informedPerson: req.body.informedPerson,
        owner: req.body.owner,
        steps: req.body.steps
    });
    const user = await User.findById(req.body.owner);
    sendEmail(req, "New Process Created", "A new process named "+process.processName+" has been created by "+ user.username);
    
    process.save((err) => {
    if (err) {
        res.status(500).send({ message: err });
        return;
    }
    res.send({ message: "Process registered successfully!" });
    })
    

        
};

// Retrieve all Processes from the database.
exports.fetchProcesses = async (req, res) => {
    try {
        const processes = await Process.find({owner: req.params.ownerId}).populate('owner');
        if (!processes) {
            res.status(404).send({ message: "Processes not found!" });
            return;
        }
        res.send(processes);
    } catch (error) {
        throw error;
    }
};

// Find a single Process with an id
exports.fetchProcess = async (req, res) => {
    const process = await Process.findById(req.params.id).populate('owner');
    if (!process) {
        res.status(404).send({ message: "Process not found!" });
        return;
    }
    res.send(process);
};

// Delete a Process with the specified id in the request
exports.deleteProcess = async (req, res) => {
    const process = await Process.findById(req.params.id);
    if (!process) {
        res.status(404).send({ message: "Process not found!" });
        return;
    }
    await Process.findByIdAndDelete(req.params.id);
    res.send({ message: "Process deleted successfully!" });
};

// Update a Process by the id in the request
exports.updateProcess = async (req, res) => {
    const process = await Process.findById(req.params.id);
    if (!process) {
        res.status(404).send({ message: "Process not found!" });
        return;
    }
    console.log(req.body.informedPerson)
    process.processName = req.body.processName;
    process.informedPerson = req.body.informedPerson;
    process.owner = req.body.owner;
    process.steps = req.body.steps;
    await process.save();
    const user = await User.findById(req.body.owner)
    sendEmail(req, "Process Updated", "Process named "+process.processName+" has been updated by "+ user.username);
    res.send({ message: "Process updated successfully!" });
}

// fetching processes that contain steps for a specific user
exports.fetchSteps = async (req, res) => {
    const processes = await Process.aggregate([
        { $match: { 'steps.stepOwner' : req.params.username } },
        {$project: {
            steps: {$filter: {
                input: '$steps',
                as: 'step',
                cond: {$eq: ['$$step.stepOwner', req.params.username]}
            }},
            processName: 1,
        }}
    ]);
    if (!processes) {
        res.status(404).send({ message: "Process not found!" });
        return;
    }
    await Promise.all([...processes.map( async (process) => {
        const temp_process = await Process.findById(process._id);
        process.steps.forEach((step) => {
            if(step.stepId == 0) {
                step.editable = true;
            } else{
                if(temp_process.steps[step.stepId - 1].stepCompleted && !step.stepCompleted) {
                    step.editable = true;
                } else {
                    step.editable = false;
                }
            }
        });
    })]
    )
    
    res.send(processes);
    
}

// updating process that contain step for a specific user
exports.completeStep = async (req, res) => {
    const process = await Process.findById(req.body.process);
    if (!process) {
        res.status(404).send({ message: "Process not found!" });
        return;
    }
    process.steps.forEach((step) => {
        if (step._id == req.body.stepId) {
            step.stepDescription = req.body.description;
            step.stepExceptionsAndAssociatedRisks = req.body.exceptionsAndAssociatedRisks;
            step.stepOptimization = req.body.optimization;
            step.stepCompleted = req.body.stepCompleted;
            if(req.body.stepFiles) {
                step.stepFiles = req.body.stepFiles;
            }
        }
    });
    await process.save();
    res.send({ message: "Step completed successfully!" });
}
// updating process that contain step for a specific user
exports.addNote = async (req, res) => {
    const process = await Process.findById(req.body.processId);
    if (!process) {
        res.status(404).send({ message: "Process not found!" });
        return;
    }
    process.steps.forEach((step) => {
        if(step._id == req.body.stepId){
            step.stepContributors.forEach((contributor) => {
                if (contributor.name == req.body.contributorName) {
                    contributor.notes.push(req.body.note);
                }
            });
        }
    });

    await process.save();
    
    res.send({ message: "Note added successfully!" });
}
// updating process that contain step for a specific user
exports.checkedStep = async (req, res) => {
    const process = await Process.findById(req.body.processId);
    if (!process) {
        res.status(404).send({ message: "Process not found!" });
        return;
    }
    process.steps.forEach((step) => {
        if(step._id == req.body.stepId){
            step.stepContributors.forEach((contributor) => {
                if (contributor.name == req.body.contributorName) {
                    contributor.checked = true;
                }
            });
        }
    });

    await process.save();
    
    res.send({ message: "Step checked successfully!" });
}

// get contributionSteps
exports.fetchContributionSteps = async (req, res) => {
    console.log(req.params.username)
    const processes = await Process.aggregate([
        {$match: { 'steps.stepContributors.name' : req.params.username }}
    ]);
    if (!processes) {
        res.status(404).send({ message: "Process not found!" });
        return;
    }
    const filteredData = processes.map(process => ({
        ...process,
        steps: process.steps.filter(step => step.stepContributors.some(contributor => contributor.name === req.params.username))
    }));
    res.send(filteredData);
}