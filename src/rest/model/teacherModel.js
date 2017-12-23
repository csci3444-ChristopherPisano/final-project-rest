var mongoose = require('mongoose'); // NOTE ilker this is ODM (Object Data Modeller) used to model and access mongodb
var Schema = mongoose.Schema;

var teacherModel = new Schema({
    teacherId: { type: String, index: true, unique: true },
    name: String,
    lastname: { type: String, trim: true, lowercase: false },
    title: { type: String, trim: true, lowercase: true, enum: ['doctor', 'dr.', 'professor', 'teacher'] },
    age: { type: Number, required: true, min: 10, max: 1000 },
    isFullTime: { type: Boolean, default: true },
    updatedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Teacher", teacherModel);