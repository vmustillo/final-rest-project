// echoMsg: echoMsg,
// find: find,
// findById: findById,
// save: save,
// findByIdUpdateFullyThenSave: findByIdUpdateFullyThenSave,
// findByIdUpdatePartiallyThenSave: findByIdUpdatePartiallyThenSave,
// findByIdThenRemove: findByIdThenRemove,
// findByIdInBodyThenRemove: findByIdInBodyThenRemove


describe("teacherRestController", function(params) {
    var teacherModel = require('../../../src/rest/model/teacherModel');

    var teacherModelSpied = {
        echoMsg: jasmine.createSpy(),
        find: jasmine.createSpy(),
        findById: jasmine.createSpy(),
        save: jasmine.createSpy(),
        findByIdUpdateFullyThenSave: jasmine.createSpy(),
        findByIdUpdatePartiallyThenSave: jasmine.createSpy(),
        findByIdThenRemove: jasmine.createSpy(),
        findByIdInBodyThenRemove: jasmine.createSpy()
    };

    var teacherRestController = require('../../../src/rest/controller/teacherRestController')(teacherModelSpied);

    var request = { params: { id: 1 } };
    var response = {
        send: jasmine.createSpy(),
        status: jasmine.createSpy()
    };

    describe("GET /teachers/echo/:msg", function() {
        it('should call teacherModel.echoMsg function', function() {

        });
    });

    describe("GET /teachers", function() {
        it('teacherRestController.find should call teacherModel.find function', function() {
            teacherRestController.find(request, response);
            expect(teacherModelSpied.find).toHaveBeenCalled();
        });
    });

});