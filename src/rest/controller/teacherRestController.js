var mongoose = require('mongoose');

var teacherRestController = function(teacherModel) {

    var echoMsg = function(req, res) {
        res.status(200);
        res.send("echo REST GET returned input msg:" + req.params.msg); // NOTE ilker 'res.send("echo REST GET returned input msg:%s", req.params.msg)' is WRONG. Syntax is 'res.send(status, body)'
    };

    var find = function(req, res) {
        teacherModel.find(function(error, teachers) {
            if (error) {
                res.status(500);
                res.send("Internal server error");
            } else {
                res.status(200);
                res.send(teachers);
            }
        });
    };

    var save = function(request, response) {
        var teacher = new teacherModel(request.body);
        console.log("--> LOOK request: %s", request); // JSON.stringify(request)
        console.log("--> LOOK JSON.stringify(request.body): %s", JSON.stringify(request.body));
        console.log(request.body);
        console.log("--> LOOK teacher: %s", teacher);
        teacher.save(function(error) {
            if (error) {
                console.log(error);
                response.status(500);
                response.send("Save failed");
            } else {
                response.status(201); // 201 means created
                response.send(teacher);
            }
        });
    };
    /**
     * Fulfills GET for and id in url REST requests.
     * It returns the student instance whose _id value is specified in url and passed as req.params._id
     * You can find pick one of the row's _id value from mongodb, in its client mongo, from output of
     * > db.students.find()
     * http://localhost:8016/students/:id                                GET
     * http://localhost:8016/students/5a1464bf3322b34128b20c8c           GET
     * http://localhost:8016/api/v1/students/:id                         GET
     * 
       curl  http://localhost:8016/students/5a1464bf3322b34128b20c8c
       curl -i http://localhost:8016/students/5a1464bf3322b34128b20c8c
       curl -i -X GET http://localhost:8016/students/5a1464bf3322b34128b20c8c
       curl  http://localhost:8016/api/v1/students/5a1464bf3322b34128b20c8c
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findById = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            teacherModel.findById(req.params.id, function(error, student) {
                if (error) {
                    res.status(404); // 404 means not found
                    res.send("Not found Student for id:" + req.params.id);
                } else {
                    res.status(200);
                    res.send(student);
                }
            });
        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of GET request. req.params.id:" + req.params.id);
        }
    };

    var findByIdUpdateFullyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            teacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means not found
                    res.send("Not found teacher for id:" + req.params.id);
                } else {
                    console.log("req.body.updatedOn: %s", req.body.updatedOn);
                    teacher.teacherId = req.body.teacherId;
                    teacher.name = req.body.name;
                    teacher.lastname = req.body.lastname;
                    teacher.grade = req.body.grade;
                    teacher.age = req.body.age;
                    teacher.isFullTime = req.body.isFullTime;
                    teacher.updatedOn = req.body.updatedOn;

                    teacher.save(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Save failed");
                        } else {
                            res.status(201); // 201 means created
                            res.send(teacher);
                        }
                    });
                }
            });
        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of PUT request. req.params.id:" + req.params.id);
        }
    };

    var findByIdUpdatePartiallyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            teacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means not found
                    res.send("Not found teacher for id:" + req.params.id);
                } else {
                    // if incoming PUT request's body has accidentally _id, remove it from req.body
                    if (req.body._id) {
                        delete req.body._id;
                    }
                    // loop over the attributes in req.body and set them in teacher object
                    for (var attrName in req.body) {
                        teacher[attrName] = req.body[attrName];
                    }

                    teacher.save(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Save failed");
                        } else {
                            res.status(201); // 201 means created - in this case means updated
                            res.send(teacher);
                        }
                    })
                }
            });
        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of PATCH request. req.params.id:" + req.params.id);
        }
    };

    var findByIdThenRemove = function(req, res) {
        try {
            console.log("findByIdThenRemove req.params.id:%s", req.params.id);
            // NOTE ilker mongoose.Types.ObjectId.isValid(req.params.id) returns true for any 12 byte string input
            if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
                // if (req.params && req.params.id) {
                console.log(" again findByIdThenRemove req.params.id:%s", req.params.id);
                teacherModel.findById(req.params.id, function(error, teacher) {
                    if (error) {
                        console.log("findByIdThenRemove error:" + error);
                        res.status(404); // 404 means not found
                        res.send("Not found teacher for id:" + req.params.id);
                    } else {
                        teacher.remove(function(error) {
                            if (error) {
                                res.status(500);
                                res.send("Remove failed");
                            } else {
                                res.status(204); // 204 means deleted
                                res.send(teacher);
                            }
                        })
                    }
                });
            } else {
                res.status(400); // 400 means "Bad Request" (incorrect input)
                res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of DELETE request. req.params.id:" + req.params.id);
            }

        } catch (e) {
            res.status(500); // 500 means "Internal Server Error". could also be due to mongodb/js-bson#205 bug that throws CastError, not being able to parse the wrong(short) _id value to objectId
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of DELETE request may be not a valid ObjectId value. req.params.id:" + req.params.id);
        }
    };

    var findByIdInBodyThenRemove = function(req, res) {
        console.log("findByIdInBodyThenRemove req.body._id:%s", req.body._id);
        if (req.body && req.body._id && mongoose.Types.ObjectId.isValid(req.body._id)) {
            teacherModel.findById(req.body._id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means "not found""
                    res.send("Not found teacher for id:" + req.body._id);
                } else {
                    console.log("LAGA%sLUGA", error);
                    teacher.remove(function(error) {
                        if (error) {
                            res.status(500);
                            res.send("Remove failed");
                        } else {
                            res.status(204); // 204 means deleted ("No Content")
                            res.send(teacher);
                        }
                    })
                }
            });

        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id in body of DELETE request");
        }
    };

    return {
        echoMsg: echoMsg,
        find: find,
        findById: findById,
        save: save,
        findByIdUpdateFullyThenSave: findByIdUpdateFullyThenSave,
        findByIdUpdatePartiallyThenSave: findByIdUpdatePartiallyThenSave,
        findByIdThenRemove: findByIdThenRemove,
        findByIdInBodyThenRemove: findByIdInBodyThenRemove
    }
};

module.exports = teacherRestController;