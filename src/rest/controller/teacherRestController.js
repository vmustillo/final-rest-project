var mongoose = require('mongoose');

var TeacherRestController = function(TeacherModel) {
    /**
     * Fulfills GET on an  echo service to check REST service is UP
     * It returns "echo REST GET returned input msg:" + req.params.msg
     * http://localhost:8016/api/v1/teachers/echo/:msg     GET
     * 
       curl -i http://localhost:8016/teachers/echo/hohoho
     * @param {*} req 
     * @param {*} res 
     */
    var echoMsg = function(req, res) {
        res.status(200);
        res.send("echo REST GET returned input msg:" + req.params.msg);
    };

    /**
     * Fulfills GET REST requests. Returns collection of all teaachers in mongodb using the TeacherModel of mongoose that was injected via constructor function
     * http://localhost:8016/api/v1/teachers     GET
     * 
       curl -i http://localhost:8016/api/v1/teachers
     * 
     * @param {*} req Request
     * @param {*} res Response
     */
    var find = function(req, res) {
        TeacherModel.find(function(error, teachers) {
            if (error) {
                res.status(500);
                res.send("Internal server error");
            } else {
                res.status(200);
                res.send(teachers);
            }
        });
    };

    /**
     * Fulfills GET for and id in url REST requests.
     * 
     * http://localhost:8016/api/v1/teachers/:id                         GET
     * 
     * curl -i http://localhost:8016/api/v1/teachers/5a1464bf3322b34128b20c8c
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findById = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404);
                    res.send("Not found Teacher for id:" + req.params.id);
                } else {
                    res.status(200);
                    res.send(teacher);
                }
            });
        } else {
            res.status(400); // 400 means "Bad Request" (incorrect input)
            res.send("Check inputs of request. InCorrect inputs. Expected _id value in url of GET request. req.params.id:" + req.params.id);
        }
    };

    /**
     * Fulfills POST REST requests. Directly saves teacher object
     * http://localhost:8016/students             POST
     * 
       curl -X POST -H "Content-Type: application/json" -i -d  '{"teacherId": 0, "name":"vin", "lastname":"mustillo", "title":"assistant", "age":21, "isFullTime":true}' http://localhost:8016/api/v1/teachers
     * 
     * In postman, select POST as method, click Body, click raw, select "JSON(application/json)" pulldown, enter below
     * {
     *   teacherId": 4,
     *   "name": "vin",
     *   "lastname": "mustillo",
     *   "title": "Assistant",
     *   "age": 21,
     *   "isFullTime": false
     * }
     * @param {*} request 
     * @param {*} response 
     */
    var save = function(request, response) {
        var teacher = new TeacherModel(request.body);
        console.log("--> LOOK request: %s", request); // JSON.stringify(request)
        console.log("--> LOOK JSON.stringify(request.body): %s", JSON.stringify(request.body));
        console.log("--> LOOK request.body: %s", request.body);
        console.log("--> LOOK teacher: %s", teacher);
        teacher.save(function(error) {
            if (error) {
                response.status(500);
                response.send("Save failed");
            } else {
                response.status(201); // 201 means created
                response.send(teacher);
            }
        });
    };

    /**
     * Fulfills PUT REST requests.
     * http://localhost:8016/api/v1/teachers/:id                       PUT
     * 
       curl -X PUT -H "Content-Type: application/json" -i -d '{"teacherId": 0, "name":"vin",   "lastname":"mustillo", "title":"assistant", "age":21, "isFullTime":false}' http://localhost:8016/api/v1/teachers/5a23f72a1fb00a38f0a814a9
     * 
     * in url enter   http://localhost:8016/api/v1/teachers/5a23e72b0a47f03f787cd618
     *
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdUpdateFullyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means not found
                    res.send("Not found Teacher for id:" + req.params.id);
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

    /**
     * Fulfills PATCH REST requests.
     * http://localhost:8016/api/v1/teachers/:id             PATCH
     * 
       curl -X PATCH -H "Content-Type: application/json" -i -d '{"teacherId": 0, "name":"vin",   "lastname":"mustillo", "title":"assistant", "age":21, "isFullTime":false}' http://localhost:8016/api/v1/teachers/5a23f72a1fb00a38f0a814a9
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdUpdatePartiallyThenSave = function(req, res) {
        if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means not found
                    res.send("Not found Teacher for id:" + req.params.id);
                } else {
                    // if incoming PUT request's body has accidentally _id, remove it from req.body
                    if (req.body._id) {
                        delete req.body._id;
                    }
                    // loop over the attributes in req.body and set them in student object
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

    /**
     * Fulfills DELETE REST requests.
     * 
       curl -X DELETE -i http://localhost:8016/api/v1/teachers/5a23f72a1fb00a38f0a814a9
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdThenRemove = function(req, res) {
        try {
            console.log("findByIdThenRemove req.params.id:%s", req.params.id);
            if (req.params && req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
                // if (req.params && req.params.id) {
                console.log(" again findByIdThenRemove req.params.id:%s", req.params.id);
                TeacherModel.findById(req.params.id, function(error, teacher) {
                    if (error) {
                        console.log("findByIdThenRemove error:" + error);
                        res.status(404); // 404 means not found
                        res.send("Not found Teacher for id:" + req.params.id);
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

    /**
     * Fulfills DELETE REST requests.
     * 
       curl -X DELETE -H "Content-Type: application/json" -i -d '{"_id":"5a2f1ef568f053451051ebdb"}' http://localhost:8016/api/v1/teachers
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdInBodyThenRemove = function(req, res) {
        console.log("findByIdInBodyThenRemove req.body._id:%s", req.body._id);
        if (req.body && req.body._id && mongoose.Types.ObjectId.isValid(req.body._id)) {
            TeacherModel.findById(req.body._id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means "not found""
                    res.send("Not found Teacher for id:" + req.body._id);
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

    // expose public functions via returned object below from this module
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

module.exports = TeacherRestController;