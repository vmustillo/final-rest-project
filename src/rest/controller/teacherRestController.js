var mongoose = require('mongoose');

var TeacherRestController = function(TeacherModel) {
    /**
     * Fulfills GET on an  echo service to check REST service is UP
     * It returns "echo REST GET returned input msg:" + req.params.msg
     * http://localhost:8016/students/echo/:msg     GET
     * http://localhost:8016/students/echo/hohoho   GET
     * 
       curl -i http://localhost:8016/students/echo/hohoho
     * @param {*} req 
     * @param {*} res 
     */
    var echoMsg = function(req, res) {
        res.status(200);
        res.send("echo REST GET returned input msg:" + req.params.msg); // NOTE ilker 'res.send("echo REST GET returned input msg:%s", req.params.msg)' is WRONG. Syntax is 'res.send(status, body)'
    };

    /**
     * Fulfills GET REST requests. Returns collection of all students in mondodb using the StudentModel of mongoose that was injected via constructor function
     * http://localhost:8016/students            GET
     * http://localhost:8016/api/v1/students     GET
     * http://localhost:8016/api/v2/students     GET  - not implemented in app, just shown as example
     * 
       curl -i http://localhost:8016/students
       curl -i http://localhost:8016/api/v1/students
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
            TeacherModel.findById(req.params.id, function(error, teacher) {
                if (error) {
                    res.status(404); // 404 means not found
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
     * Fulfills POST REST requests. Directly saves student object that was passed in req.body.
     * NOTE _id (the primary key that mongodb by default creates an index to speed up finds on) and __v (meaning version) will be added to record by mongodb itself
     * http://localhost:8016/students             POST
     * 
       curl -X POST -H "Content-Type: application/json" -i -d  '{"studentId": 0, "name":"ilker_0", "lastname":"kiris_0", "grade":"freshman ", "age":200, "isFullTime":false}' http://localhost:8016/students
       curl -X POST -H "Content-Type: application/json" -d     '{"studentId": 1, "name":"ilker_1", "lastname":"kiris_1", "grade":"FreshMan",  "age":201, "isFullTime":false}' http://localhost:8016/students
       curl -X POST -H "Content-Type: application/json" --data '{"studentId": 2, "name":"ilker_2", "lastname":"kiris_2", "grade":" freshman", "age":202, "isFullTime":true}'  http://localhost:8016/students
       curl -X POST -H "Content-Type: application/json" -i -d  '{"studentId": 3, "name":"ilker_3", "lastname":"kiris_3", "grade":" freshman", "age":203, "isFullTime":true}'  http://localhost:8016/students
     * 
     * In postman, select POST as method, click Body, click raw, select "JSON(application/json)" pulldown, enter below
     * {
     *   "studentId": 4,
     *   "name": "ilker_4 ",
     *   "lastname": "kiris_4",
     *   "grade": "FreshMan ",
     *   "age": 204,
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

    // id: Number
    // name: String,
    // lastname: String,
    // grade: String,
    // age: Number,
    // isFullTime: { type: Boolean, default: true }
    // updatedOn: Date

    /**
     * Fulfills PUT REST requests. This is NOT partial update, but full update of student record in mongodb for id in the url 
     * 1) Find the student from mongodb by id provided in the url
     * 2) Set student fetched from mongodb to have values of all the attributes expected to be in the body of request
     * 3) Save the replaced student back to mongodb
     * http://localhost:8016/students/:id                       PUT
     * http://localhost:8016/students/5a23e035decd2b6770ab4890  PUT
     * 
       curl -X PUT -H "Content-Type: application/json" -i -d '{"studentId": 0, "name":"ilker_0_update",   "lastname":"kiris_0", "grade":"freshman ", "age":200, "isFullTime":false}' http://localhost:8016/students/5a23f72a1fb00a38f0a814a9
       curl -X PUT -H "Content-Type: application/json" -i -d '{"studentId": 0, "name":"ilker_0_update_2", "lastname":"kiris_0", "grade":"freshman ", "age":200, "isFullTime":false, "updatedOn":"2017-12-03T12:39:06.446Z"}' http://localhost:8016/students/5a23f72a1fb00a38f0a814a9
       curl -X PUT -H "Content-Type: application/json" -i -d '{"studentId": 0, "name":"ilker_0_update_2", "lastname":"kiris_0", "grade":"freshman ", "age":200, "isFullTime":false, "updatedOn":"'"$(date +%Y-%m-%dT%H:%M:%S)"'"}' http://localhost:8016/students/5a23f72a1fb00a38f0a814a9
       curl -X PUT -H "Content-Type: application/json" -i -d '{"studentId": 3, "name":"ilker_3_update",   "lastname":"kiris_3", "grade":"freshman ", "age":200, "isFullTime":false, "updatedOn":"'"$(date +%Y-%m-%dT%H:%M:%S)"'"}' http://localhost:8016/students/5a2f2505c96a552334fdc762
     * 
     * In postman, select PUT as method, click Body, click raw, select "JSON(application/json)" pulldown,
     * in url enter   http://localhost:8016/students/5a23e72b0a47f03f787cd618
     * in "Pre-request Script" tab of postman, enter
     *   postman.setGlobalVariable("myCurrentDate", new Date().toISOString());
     * in "Body" tab of postman, enter
     * {
     *   "studentId": 4,
     *   "name": "ilker_4_update",
     *   "lastname": "kiris_4",
     *   "grade": "FreshMan ",
     *   "age": 204,
     *   "isFullTime": false,
     *   "updatedOn": "{{myCurrentDate}}"
     * }
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
     * Fulfills PATCH REST requests. NOTE this is allows partial update of student record. 
     * 1) Find the student from mongodb by id provided in the url
     * 2) Loop over the attribute names in the body of request and set their values in the student that was fetched from mongodb
     * 3) Save the updated student back to mongodb
     * http://localhost:8016/students/:id             PATCH
     * 
       curl -X PATCH -H "Content-Type: application/json" -i -d '{"grade":"sophomore", "age":123, "isFullTime":false}' http://localhost:8016/students/5a23f72a1fb00a38f0a814a9
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
     * Removes(Deletes) the student row whose _id value is specied in the url and passed in req.
     * NOTE _id and _version will be added to record by mongodb itself
     * http://localhost:8016/students/:id             DELETE
     * 
       curl -X DELETE -i http://localhost:8016/students/5a23f72a1fb00a38f0a814a9
     * 
     * @param {*} req 
     * @param {*} res 
     */
    var findByIdThenRemove = function(req, res) {
        try {
            console.log("findByIdThenRemove req.params.id:%s", req.params.id);
            // NOTE ilker mongoose.Types.ObjectId.isValid(req.params.id) returns true for any 12 byte string input
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
     * Removes(Deletes) the student row whose _id value is specied in the body and passed in req.body._id
     * http://localhost:8016/students             DELETE
     * 
       curl -X DELETE -H "Content-Type: application/json" -i -d '{"_id":"5a2f1ef568f053451051ebdb"}' http://localhost:8016/students
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