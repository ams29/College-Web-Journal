var loginCombos = new Map();

/**
 * Sets up Hashtable and test methods on page load
 */
function setup() {
    testMapBeforeLoad();
    loadData();
    testPasswords();
}

/**
 * This function loads the username and password combinations into the hashtable
 * when the page is first loaded. It is an asychronous function and must wait for 
 * response from fetch API
 * 
 * https://developers.google.com/web/updates/2015/03/introduction-to-fetch
 */
async function loadData() { 
    // wait for response from fetch API
    var response = await fetch('loginCombos.txt');
    // wait for response --> text
    let fileData = await response.text();
    let combos = fileData.split("\n"); // split at new line
    for (let i = 0; i < combos.length; i++) {
        let split = combos[i].split(" ");
        let key = String(split[0]); // first item is key
        let val = String(split[1]); // second item is val
        console.log("key: " + key); 
        console.log("val: " + val); 
        loginCombos.set(key, val);
    }
    console.log(loginCombos.size);
}

/**
 * This functions "creates" a new account with a new username and password combos, is called
 * when the button for "create account" is clicked in the html. Will check if Hashtable contains username,
 * if it does, will alert user to create a new username. If username is valid, will call checkPassword() method
 * to check if password matches password criteria.
 */
function addCombo(username, password) {
    if (username == undefined || password == undefined) {
        alert("Error, please provide valid input");
    }

    if (checkPassword(password)) {
        loginCombos.set(username, password)
        window.location.replace("LoginPage.html"); 
    }
      
}

/**
 * This function creates a new Map() and fills it with a user uploaded file
 * with their newly added password
 */
function readFile(input) {
    loginCombos = new Map();
    var file = input.files[0];

    var reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function() {
	let combos = reader.result.split("\n"); // split at new line                                                                                                        
	for (let i = 0; i < combos.length; i++) {
	    let split = combos[i].split(" ");
	    let key = String(split[0]); // first item is key                                                                                                           
	    let val = String(split[1]); // second item is val                                                                                                          
	    console.log("key: " + key);
	    console.log("val: " + val);
	    loginCombos.set(key, val);
	}

    };

    reader.onerror = function() {
	console.log(reader.error);
    };

}

/**
 * Allows user to download file with all the usernames and password so they can 
 * access the story base and also add their own combination to the file.
 */
function createFile() {
    const iterator1 = loginCombos[Symbol.iterator]();
    var combos = "";
    for (const item of iterator1) {
	combos = combos + item[0] + " " + item[1] + '\n';
    }
    var text = combos;
    var filename = 'loginCombos.txt';
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    
}


/**
 * This functions checks if the password matches the criteria required to create a new account (a letter, a number, and a symbol)
 * with a length of at least 8 characters. It is called from addCombo() when a user "creates" a new account.
 * 
 * Loads login page if password is valid, otherwise, alerts user that the password needs to match the criteria
 */
function checkPassword(password) {
    // create regexes for each criteria
    let regexAlph = RegExp("[aA-zZ]+");
    let regexNum = RegExp("[0-9]+");
    let regexSpecial = RegExp("[^A-Za-z0-9]+");
    if (regexAlph.test(password) && regexNum.test(password) && regexSpecial.test(password)){
        if (password.length >= 8) {
            return true;
        } else {
            alert("Your password must be 8 characters long!");
        }
    } else {
        alert("Your password needs a letter (i.e. abc) a number (i.e. 123) and a special character (i.e. !@#$)");
    }
}

/**
 * This functions will check if the username and password combo given in the login page matches
 * the username and password combo stored in the file
 * 
 * Loads story page if match is successful, otherwise, alerts user that combo is invalid
 */
function checkCombo(username, password) {
    if (loginCombos.has(username)) {
        // if the password matches, load the html that contains the story "database"
        let inputPass = password;
        let actualPass = loginCombos.get(username).trim();
        if (inputPass == actualPass) {
            window.location.replace("JournalPage.html"); // path to JournalPage.html (login successful)
        } else {
            alert("Error, incorrect password!");
        }
    } else {
        alert("Error, this username does not exist! Please create an account!");
    }
}

function assert(truthVal){
	if(!truthVal){
		throw new Error();


	}
		else{
		return;
		}
	}

	function testMapInsert(){
		var loginCombosSize = loginCombos.size;
		loginCombos.set("Test", "$Test12345");
		try{
			assert(loginCombos.size == (loginCombosSize + 1));
			loginCombos.delete("Test");
			console.log("TEST MAP INSERT PASSED");
		}
		catch(err){
			console.log("Test combo was not properly inserted into list");
		}
	}
	function testProperPassword(){
		try{
			assert(checkPassword("$Testtest123"));
			console.log("TEST PROPERPASSWORD PASSED");
		}
		catch(err){
			console.log("Regex isn't working properly on correct password!");
		}
	}
	function testBadPassword(){
		var testBool = checkPassword("test22");
		checkPassword("$Goodpassword123");
		try{
			
			console.log("TEST BADPASSWORD PASSED");
		}
		catch(err){
			console.log("Regex didn't catch wrong password");
		}
	}

	function testMapBeforeLoad(){
		try{
			assert(loginCombos.size == 0);
			console.log("TEST MAPBEFORELOAD PASSED");
		}
		catch(err){
			console.log("Array size should be zero before loading!");
		}
	}

	function testMapAfterLoad(){
	try{
		assert(loginCombos.size != 0);
		console.log("TEST MAP AFTER LOAD PASSED");
	}
		catch(err){
		console.log("Map was not properly loaded.");
		}
	}
	function testPasswords(){
	testProperPassword();
	testBadPassword();
	testMapInsert();

}