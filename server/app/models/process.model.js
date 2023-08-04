const mongoose = require("mongoose");

const Process = mongoose.model(
  "Process",
  new mongoose.Schema({
    processName: {
        type: String,
        required: true
    },
    informedPerson: {
        type: Array,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    steps: [{
        stepId: Number,
        stepName: String,
        stepOwner: String,
        stepDescription: String,
        stepDeadlines: String,
        stepExceptionsAndAssociatedRisks: String,
        stepOptimization: String,
        stepFiles: Array,
        stepContributors: [{
          name: String,
          checked: Boolean,
          notes: Array
        }],
        stepCompleted: Boolean
    }]
  })
);

module.exports = Process;