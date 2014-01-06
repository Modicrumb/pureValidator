var pureValidate = function(conditions, formElement, ajaxFunction) {
        //variables taken via constructor
        this.conditions = conditions;
        this.formElement = formElement;
        //setting variables up
        var form = this.formElement,
        inputs = form.getElementsByTagName('input'),
        isValid = true,
        Validator = this;

        this.conditionCheck = function conditionCheck(conditionOptions , input) {
            if (conditionOptions.hasOwnProperty('empty')) {
                if (input.value == "") {
                    return conditionOptions.empty;
                }
            }
            if (conditionOptions.hasOwnProperty('match')) {
                //get name of first key
                for (var key in conditionOptions.match)
                {   
                    if (conditionOptions.match.hasOwnProperty(key)) {
                        var matchKey = key;
                        var inputAgainst = document.getElementById(matchKey);
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
        }

        //taken from jQuery library
        this.inArray = function inArray(needle, haystack) {
            var length = haystack.length;
            for(var i = 0; i < length; i++) {
                if(haystack[i] == needle) return true;
            }
            return false;
        }

        this.getLabel = function getLabel(node) {
                    if (node.previousSibling.nodeType === 1 && node.previousSibling.tagName === "LABEL")
                        return node.previousSibling;
                    else 
                        var node = node.previousSibling;
                        return getLabel(node); 
                }
        
        this.resetMessage = function resetMessage(input) {
            var thisKey = input.getAttribute('id');
            var innerSpan = document.getElementById(thisKey + "_validate")
            if (innerSpan !== null) {
                innerSpan.innerHTML = '';
            }
        }

        this.validate = function validate() {
            for (var key in Validator.conditions) {
                if (Validator.conditions.hasOwnProperty(key)) {
                    var input = document.getElementById(key);
                    var conditionOptions = Validator.conditions[key];
                    var msgText = Validator.conditionCheck(conditionOptions,input);
                    var assocLabel = Validator.getLabel(input);
                    //here I am setting it so that it the text resets on change
                    input.onchange = function() {
                        Validator.resetMessage(this);
                    }
                    if (msgText !== undefined)
                    {
                        isValid = false;
                        var spanInner = document.createElement('span');
                        spanInner.setAttribute('id',key + "_validate");
                        var txtNode = document.createTextNode(" " + msgText);
                        spanInner.appendChild(txtNode);
                        var existingSpan = document.getElementById(key + "_validate");
                        /* Only append span if it doesn't exist and innerHTML appended is unique*/
                        if (existingSpan === null) {
                            //check all over span HTML to be able to compare with new span
                            var spanLabel = assocLabel.getElementsByTagName('span');
                            var compArray = new Array();
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
        }
        /* Find the submit button*/
        for (var i=0; i < inputs.length; i++) {
            if (inputs[i].getAttribute('type') === 'submit' || inputs[i].getAttribute('type') === 'button') {
                /* Handle submit buttons and resetting on change here*/
                inputs[i].onclick = function() {
                   Validator.validate();
                   debug.innerHTML = isValid;
                   if (isValid && ajaxFunction === undefined) {
                    form.submit();
                   }
                   else if (isValid) {
                    ajaxFunction(); 
                   }
                   //reset isValid
                   isValid = true;
                };
            }
        }

    }