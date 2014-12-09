//these are here just to silence the jsHint
var QUnit = QUnit;
var pureValidate = pureValidate;
var document = document;

QUnit.module("pureValidator", {
    setup: function(){
        var userConditions = {
            user_username: { 
                empty: "Please provide a username"
            },
            user_password: { 
                empty: "Please provide a password"
            },
            user_email: { 
                empty: "Please provide an email",
                regex: {
                    match: /^([\w-\'\+]+(?:\.[\w-\'\+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
                    message: "Please provide a valid email"
                }
            },
           user_confirmEmail: {
                empty: "Please confirm your email",
                match: {
                    user_email:"Please make sure emails are identical"
                }
            },
            phone_area: {
                empty: "Please enter a phone number"
            },
            phone_number: {
                empty: "Please enter a phone number"
            }
        };
        var newUserForm = document.getElementById('new-user-form'); 
        
        this.validator = new pureValidate(userConditions, newUserForm);
    },
    teardown: function(){
        
    }
});

QUnit.test("creating pureValidate object creates new pureValidate object...", function(assert){
    assert.ok(typeof this.validator === "object", "validator is an object");
});

QUnit.test("creating pureValidate object with incorrect parameters throws invalid parameters exception", function(assert){
    assert.throws(function(){new pureValidate();}, "checks for exception thrown");
});

QUnit.test("function pureValidate.conditionCheck should return me the set message when input is empty", function(assert){
    var otherValidateMsg = this.validator.conditionCheck({empty: "value is empty"}, document.getElementById('emptyvalue'));
    assert.ok(otherValidateMsg === "value is empty", "dom empty input test");
});

QUnit.test("function pureValidate.conditionCheck should return me the set message when input doesn't match other input", function(assert){
    var validateMsg = this.validator.conditionCheck({match: {mismatchtexttwo: "text needs to match with mismatchtexttwo"}}, document.getElementById('mismatchtextone'));
    assert.ok(validateMsg === "text needs to match with mismatchtexttwo", "returns" + validateMsg + "checks if validator acknowledges an empty field");
});

QUnit.test("function pureValidate.conditionCheck should not return me anything if two inputs are correctly validated to match", function(assert){
    var validateMsg = this.validator.conditionCheck({match: {matchingtextone: "this text should not be returned"}}, document.getElementById('matchingtextone'));
    assert.ok(validateMsg === undefined, "returns" + validateMsg + "checks if validator acknowledges an empty field");
});

QUnit.test("function pureValidate.conditionCheck should return me the set message when input doesn't match regexp", function(assert){
    var newInput = document.createElement('input');
    newInput.value = "";
    var validateMsg = this.validator.conditionCheck({empty: "is empty"}, newInput);
    assert.ok(validateMsg === "is empty", "returns" + validateMsg + "checks if validator acknowledges an empty field");
});

QUnit.test("function pureValidate.conditionCheck should not return me the validation message when matching regexp", function(assert){
    var validateMsg = this.validator.conditionCheck({regex: {match: /[a-z]{3}\d{3}[a-z]{3}/, message:'doesn\'t match regexp'}}, document.getElementById('regexpmatch'));
    assert.ok(validateMsg === undefined, "returns" + validateMsg + "checks if validator acknowledges an empty field");
});

QUnit.test("function pureValidate.conditionCheck should return me the validation message when not matching regexp", function(assert){
    var validateMsg = this.validator.conditionCheck({regex: {match: /[a-z]{3}\d{3}[a-z]{3}/, message:'doesn\'t match regexp'}}, document.getElementById('notregexpmatch'));
    assert.ok(validateMsg === 'doesn\'t match regexp', "returns" + validateMsg + "checks if validator acknowledges an empty field");
});

QUnit.test("function pureValidate.getLabel should return me the corresponding label node", function(assert){
    var labelNode1 = this.validator.getLabel(document.getElementById('mismatchtextone'));
    assert.ok(labelNode1.innerHTML === 'mismatch one', 'returned ' + labelNode1.innerHTML);
    var labelNode2 = this.validator.getLabel(document.getElementById('mismatchtexttwo'));
    assert.ok(labelNode2.innerHTML === 'mismatch two', 'returned ' + labelNode2.innerHTML);
    var labelNode3 = this.validator.getLabel(document.getElementById('labeltestone'));
    assert.ok(labelNode3.innerHTML === 'labeltestone', 'returned ' + labelNode3.innerHTML);
    var labelNode4 = this.validator.getLabel(document.getElementById('labeltestmultione'));
    assert.ok(labelNode4.innerHTML === 'label test multi one', 'returned ' + labelNode4.innerHTML);
    var labelNode5 = this.validator.getLabel(document.getElementById('labeltestnotexist'));
    assert.ok(labelNode5 === undefined);
});

QUnit.test("function pureValidate.resetMessage should reset the span message tied to the corresponding input", function(assert){
    assert.ok(document.getElementById('spanmessage_validate').innerHTML === 'a validation message', 'pre resetMessage');
    this.validator.resetMessage(document.getElementById('spanmessage'));
    assert.ok(document.getElementById('spanmessage_validate').innerHTML === '', 'post resetMessage');
});

QUnit.test("function validate should create appropriate validation spans with messages specified in passed in configuration parameter", function(assert){
    //validation span doesn't exist prior
    assert.ok(!document.getElementById('user_username_validate'));
    this.validator.validate();
    //validation span exists after validate function 
    var validationSpan = document.getElementById('user_username_validate')
    assert.ok(validationSpan);
    //and it has the correct corresponding text
    assert.ok(validationSpan.innerHTML === 'Please provide a username');
});

QUnit.test("function validate should not create a span with a validation message when input fulfills validation requirements", function(assert){
    var input = document.getElementById('user_username');
    input.value = 'username';
    //validation span doesn't exist prior
    assert.ok(!document.getElementById('user_username_validate'));
    
    this.validator.validate();
    //validation span not exists after
    assert.ok(!document.getElementById('user_username_validate'));
});
//
//QUnit.test("successCallback should be called when all validations pass", function(assert){
//     
//});