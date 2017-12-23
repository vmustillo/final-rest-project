var mongoose = require('mongoose'); // NOTE ilker this is ODM (Object Data Modeller) used to model and access mongodb
var Schema = mongoose.Schema;

// NOTE_1 ilker, define "keys" (attribute name : attribute type, ....). NOTE below many option examples
var teacherModel = new Schema({
    teacherId: { type: String, index: true, unique: true }, // NOTE ilker will create an index in mongodb
    name: String,
    lastname: { type: String, trim: true, lowercase: true },
    title: { type: String },
    age: { type: Number, required: true, min: 10, max: 1000 },
    isFullTime: { type: Boolean, default: true },
    updatedOn: { type: Date, default: Date.now } // NOTE ilker by default will have value like "2017-12-03T11:11:16.152Z"
});

// NOTE_2 ilker, create model
module.exports = mongoose.model("Teacher", teacherModel); // NOTE ilker this returns a mongoose "model" and a collection called "students"(by default collection name is plural of model name, like for model name "Student", default collection name will be "students") will be created in mongodb
// NOTE ilker, if collection name is not provided, by default mongoose uses collection name that is lural of model name, like for model name "Student", default collection name will be "students". You can specify model and collection name as;
// module.exports = mongoose.model("Student", studentModel, "students");