var express = require('express');

var teacherModel = require('../model/teacherModel');
var teacherRestController = require('../controller/teacherRestController')(teacherModel); // NOTE ilker injecting above imported teacherModel into rest controller via its constructor function

var teacherRestRouter = express.Router();

teacherRestRouter.route('') // "/teachers" - the root url is defined by user of this router, main_restServer as "/teachers"
    .get(teacherRestController.find)
    .post(teacherRestController.save)
    .delete(teacherRestController.findByIdInBodyThenRemove);

teacherRestRouter.route('/:id') // "teachers/:id"
    .get(teacherRestController.findById)
    .put(teacherRestController.findByIdUpdateFullyThenSave)
    .patch(teacherRestController.findByIdUpdatePartiallyThenSave)
    .delete(teacherRestController.findByIdThenRemove);

teacherRestRouter.route('/echo/:msg') // "teachers/echo/:msg"
    .get(teacherRestController.echoMsg);

module.exports = teacherRestRouter;