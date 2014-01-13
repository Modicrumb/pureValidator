pureValidate -- Pure JavaScript Form Validation
================================

This is a function object designed to automatically create front end validation via the passing of input ids and error messages. Error messages will be output in the corresponding labels: spans are created within the labels in order to display error messages and span ids are created based on input ids suffixed with _validator. Because the spans are within the labels and have their own unique ids it allows for a lot of front end customization. Input ids, error messages, and special cases are read by the function via an object which is passed to the function object via it's constructor. 

Examples and more documentation coming soon