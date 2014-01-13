pureValidate
================================

This is a function object designed to automatically create front end validation via the passing of input ids and error messages. Error messages will be output in the corresponding labels: spans are created within the labels in order to display error messages and span ids are created based on input ids suffixed with _validator. Because the spans are within the labels and have their own unique ids it allows for a lot of front end customization. Input ids, error messages, and special cases are read by the function via an object which is passed to the function object via it's constructor. 

The Rules
---------

There are a few rules to follow if you plan on using pureValidate dealing with HTML mark up.

1.    Every input specified (for validation) should have a unique ID as well as a preceding label
2.    input Ids can't have dashes in them - 
3.    Form submission must not be allowed except through javaScript, pureValidate doesn't do this on it's own (Maybe it will later!)
4.    That's actually it I guess

Using the Validator
-------------------

The Validator takes 3 parameters and currently it only checks against 3 conditions:
1.     empty: whether an input is empty or not
2.     regex: whether an input matches a regex
3.     match: whether an input matches another

Wow, how do I use it already?

Good question Brochacho, the pureValidate function takes 3 parameters:
1.     conditionOptions object you create =)
2.     the form to be operated on as a node
3.     an optional ajaxFunction to be used instead of submit()

Creating the conditionOptions - Here I will create an example conditionOption showcasing all 3 conditions

    var conditions = {
    	inputid1: {
    		empty: "This Input is empty",
    		match: {
    			inputid2: "These inputs don't match values!"
    		}
    	},
    	inputid2: {
    		empty: "This input is empty!!! Note that no conditions have to be specified for another input to use match on another input"
    	},
    	phone: {
    		regex: {
    			match: /\d/
    			message: "Please enter digits only!"
    		}
    	}
    }

Now suppose you want 1 label to handle 2 inputs, that is possible but keep the following in mind: 
If you want one message to show for one condition on 2 inputs ex:
	<form id="form1">
		<label> This label is for the phoneArea and for the Number </label>
		<input id="phoneArea" type="text" />
		<input id="phoneNum" type="text" />
		<input type="submit" />
	</form>
Your conditionOptions would look like: 
    var conditions = {
    	phoneArea: {
    		empty: "This field is empty"
    	},
    	phoneNum: {
    		empty: "This field is empty"
    	}
    }

Since both conditions have exactly the same messages only one will appear if the fields are empty and submit is clicked, only one unique message per condition appears, if two messages are the same they won't appear in the same label.

Okay let's put it together now:
First include the pureValidate function (pureValidate.js) in the head of your document, or in the bottom of the body if you are feeling like that's what is cool.
Second set up your conditions. 
Third grab the form object. var form = document.getElementById('form1'); for example
Instantiate the function: 
    var phoneValidate = new pureValidate(conditions, form)


For the optional ajaxFunction parameter you would pass in the function name without the parentheses

    function ajax() {
    	alert("this isn't really a good example of an ajax function");
    }
    var phoneValidate = new pureValidate(conditions, form, ajax)

That's all, code it up friends. 