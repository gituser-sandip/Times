


function validationform() {
    // Get the values of the input fields
    var namev = document.getElementById('name').value;
    var emailv = document.getElementById('email').value;
    var messagev = document.getElementById('message').value;

    // Check if any of the fields are empty
    if(namev == "")
    {
        alert("Name fields are required!");
        return false;
    }
    else if(emailv == ""){
        alert("Email fields are required!");
        return false;
    }
    else if(messagev == ""){
        alert("Message fields are required!");
        return false;
    }
    // Check if the email address is valid
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(emailv)){
        alert("Invalid email address!");
        return false;
    }
    else{
        alert("Form submitted successfully!");
        return true;
    }


}