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

QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

//QUnit.test("creating pureValidate object creates new pureValidate object...", function(assert){
//    var validator = new pureValidate();
//    assert.ok(typeof validator === "object", "passed");
//});

QUnit.test("creating pureValidate object with incorrect parameters throws invalid parameters exception", function(assert){
    assert.throws(function(){new pureValidate();}, "checks for exception thrown");
});

QUnit.test("function pureValidate.conditionCheck should return me the set message when input is empty", function(assert){
    assert.ok(this.validator.conditionCheck === "is empty", "checks if validator acknowledges an empty field");
});