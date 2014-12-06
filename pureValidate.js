/** pureValidate Created by Richard Sacco 2014 
*** Released under MIT lisence http://opensource.org/licenses/MIT
***/

/** Creates an instance of pureValidate
*** 
*** @constructor
*** @this {pureValidate}
*** @param {object} conditions, object describing inputs, conditions to check against, and alert messages
*** @param {element} formElement, form for conditions to be operated on
*** @param optional {function} successCallback, function without parens to be executed replacing form.submit()
***
***/

var pureValidate = function(conditions, formElement, successCallback) {
        if(!conditions || !formElement){
            throw "invalid parameters exception";
        }
        this.conditions = conditions;   //adding conditions parameter to pureValidate object
        this.formElement = formElement; //adding form parameter to pureValidate object

        var form = this.formElement,
        inputs = form.getElementsByTagName('input'),
        isValid = true,
        Validator = this;

        /** Goes through all specified condition options and acts accordingly
        *** 
        *** @param {object} conditionOptions, object describing conditions to check against, and alert messages specific to inputs
        *** @param {element} input, input being operated on
        *** return message string to output
        ***/
        this.conditionCheck = function (conditionOptions , input) {
            if (conditionOptions.hasOwnProperty('empty')) {
                if (input.value === "") {
                    return conditionOptions.empty;
                }
            }
            if (conditionOptions.hasOwnProperty('match')) {
                var inputAgainst; 
                var matchKey;
                //get name of first key
                for (var key in conditionOptions.match)
                {   
                    if (conditionOptions.match.hasOwnProperty(key)) {
                        matchKey = key;
                        inputAgainst = document.getElementById(matchKey);
                    }
                }
                if (input.value != inputAgainst.value ) {
                    return conditionOptions.match[matchKey];
                }
            }
            if (conditionOptions.hasOwnProperty('regex')) {
                var match = conditionOptions.regex.match;
                var message = conditionOptions.regex.message;
                if (!match.test(input.value))
                {
                    return message;
                }
            }
        };

        /** Taken from jQuery library checks values in a one dimensional array
        *** 
        *** @param {toSearch} needle, can be anything to be searched in another array
        *** @param {array} haystack, one dimensional array to search through
        *** return true or false, true if needle is found in array, false otherwise
        ***/
        this.inArray = function inArray(needle, haystack) {
            var length = haystack.length;
            for(var i = 0; i < length; i++) {
                if(haystack[i] == needle) return true;
            }
            return false;
        };

        /** Grabs label right before various input, recursive function because uses dom level 1 previousSibling
        *** 
        *** @param {node} node, object describing conditions to check against, and alert messages specific to inputs
        *** return label element
        ***/
        this.getLabel = function getLabel(node) {
                    if (node.previousSibling.nodeType === 1 && node.previousSibling.tagName === "LABEL")
                        return node.previousSibling;
                    else 
                        node = node.previousSibling;
                        return getLabel(node); 
                };

        /** Resets the span message within an input to be ''
        *** 
        *** @param {element} input, object describing conditions to check against, and alert messages specific to inputs
        *** return void, changes label element innerHTML
        ***/
        this.resetMessage = function resetMessage(input) {
            var thisKey = input.getAttribute('id');
            var innerSpan = document.getElementById(thisKey + "_validate");
            if (innerSpan !== null) {
                innerSpan.innerHTML = '';
            }
        };

         /** Function at the heart of pureValidate
        *** 
        *** operates on conditionOptions and invokes resetMessage onchange on inputs specified
        *** invokes conditionCheck to get message based on value that is currently in input
        *** intelligently creates message alert spans and removes span text
        ***
        ***/
        this.validate = function validate() {
            for (var key in Validator.conditions) {
                if (Validator.conditions.hasOwnProperty(key)) {
                    var input = document.getElementById(key);
                    var conditionOptions = Validator.conditions[key];
                    var msgText = Validator.conditionCheck(conditionOptions,input);
                    var assocLabel = Validator.getLabel(input);
                    //here I am setting it so that it the text resets on change
                    input.onchange = resetValidationMessage(input);
                    if (msgText !== undefined)
                    {
                        isValid = false;
                        var spanInner = document.createElement('span');
                        spanInner.setAttribute('id',key + "_validate");
                        spanInner.setAttribute('class', "validationMsg");
                        var txtNode = document.createTextNode(msgText);
                        spanInner.appendChild(txtNode);
                        var existingSpan = document.getElementById(key + "_validate");
                        /* Only append span if it doesn't exist and innerHTML appended is unique*/
                        if (existingSpan === null) {
                            //check all over span HTML to be able to compare with new span
                            var spanLabel = assocLabel.getElementsByTagName('span');
                            var compArray = [];
                            for (var j = 0; j < spanLabel.length; j++) {
                                compArray.push(spanLabel[j].innerHTML);
                            }
                            if (!Validator.inArray(spanInner.innerHTML,compArray)) {
                                assocLabel.appendChild(spanInner);
                            }
                        }
                        else {
                            /*Check to make sure existing span is not null, if it is do nothing*/
                            if (existingSpan !== null) {
                            /* if it does exist check to see if message needs to be changed or not*/
                                if (existingSpan.innerHTML !== " " + msgText) {
                                    existingSpan.innerHTML = " " + msgText;
                                }
                            } 
                        }
                    }
                }
            }
            
            function resetValidationMessage(input) {
                return function(){
                    Validator.resetMessage(input);
                };
            }
            
        };

        /** Most "functional code" in pureValidate
        *** algorithmically finds submit button based on the type attribute (finds button with submit type)
        *** invokes validate on submit button click, note that it does not block a form from sending, rails or cake can do this
        *** if isValid is false it doesn't submit, if successCallback is defined it uses that function instead of submit 
        *** if form allows submission without JS stop it and if it has a disabled attribute take it off
        **/
        for (var i=0; i < inputs.length; i++) {
            if (inputs[i].getAttribute('type') === 'submit' || inputs[i].getAttribute('type') === 'button') {
                inputs[i].removeAttribute('disabled');
                /* Handle submit buttons and resetting on change here*/
                inputs[i].onclick = submitAndReset;
            }
        }
            
        function submitAndReset() {
           form.onsubmit = function() {
                return false;
            };
           Validator.validate();
           if (isValid && successCallback === undefined) {
            form.submit();
           }
           else if (isValid) {
            successCallback(); 
           }
           //reset isValid
           isValid = true;
        }
    };