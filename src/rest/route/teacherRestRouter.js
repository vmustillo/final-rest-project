var express = require('express');

var TeacherModel = require('../model/teacherModel');
var teacherRestController = require('../controller/teacherRestController')(TeacherModel); // NOTE ilker injecting above imported StudentModel into rest controller via its constructor function

var teacherRestRouter = express.Router();

teacherRestRouter.route('') // "/students" - the root url is defined by user of this router, main_restServer as "/students"
    .get(teacherRestController.find)
    .post(teacherRestController.save)
    .delete(teacherRestController.findByIdInBodyThenRemove);

teacherRestRouter.route('/:id') // "students/:id"
    .get(teacherRestController.findById)
    .put(teacherRestController.findByIdUpdateFullyThenSave)
    .patch(teacherRestController.findByIdUpdatePartiallyThenSave)
    .delete(teacherRestController.findByIdThenRemove);

teacherRestRouter.route('/echo/:msg') // "students/echo/:msg"
    .get(teacherRestController.echoMsg)

module.exports = teacherRestRouter;