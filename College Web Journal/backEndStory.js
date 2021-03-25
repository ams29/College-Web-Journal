var stories = new Map();

var splitConstant = 'afeiwoh6879DWIOIh';

function setup() {
    loadData();
}
/**                                                                                                                                                               
 * This function loads the title and story combinations into the hashtable                                                                                  
 * when the page is first loaded                                                                                                                               
 */
async function loadData() {
     // wait for response from fetch API
     var response = await fetch('stories.txt');
     // wait for response --> text
     let fileData = await response.text();
     //console.log(fileData);
    let combos = fileData.split("afeiwoh6879DWIOIh"); // split at split constant
     console.log(combos.length);
     for (let i = 0; i < combos.length; i+=2) {
         let key = combos[i].trim(); // first item is title
         let val = combos[i + 1].trim(); // second item is story
        console.log("key: " + key); 
        //  console.log("val: " + val); 
         stories.set(key, val);
     }
     console.log("stories map size: " + stories.size);
}

/**
 * This function is called when the search button is clicked in the story html file. 
 * It searches the Hashtable for a story by its title, if a story is found, the story is 
 * displayed in the html, else it will notify the user that no story was found.
 */
function searchStory(title) {    
    if (stories.has(title)) {
         // displayStory is place holder, will update once front end complete
        document.getElementById('displayTitle').innerHTML = title;
        document.getElementById('displayStory').innerHTML = stories.get(title);
    } else {
         // displayStory is place holder, will update once front end complete
        document.getElementById('displayStory').innerHTML = 'This story does not exist in our database!';
    }
}
/**
 * This function is called when the delete button is cliked in the story html file.
 * It deletes a story from the Hashtable based on the title entered into the title box.
 */
function deleteStory(title) {
    if(stories.has(title)) {
	stories.delete(title);
    } else {
        alert("Story not in database!");
    }
}

/**
 * This function recreates the stories.txt file after a story is removed from the hashtable.
 * Since the hashtable is loaded with title/story pairs from stories.txt when the window loads,
 * we want to make sure we remove a story from both the current hashtable and stories.txt. This is
 * done by recreating the stories.txt file with the values in the hashtable AFTER a remove is completed.
 * 
 * This function is called from the deleteStory() function.
 * 
 */
function recreateStoriesFile() {
    // deletes old file
    fs.unlink('stories.txt', function(err) {
        if (err) throw err;
        console.log('File successfully deleted!');
    });
    // iterate through hashtable with for each loop
    // where for each title (key) in the hashtable, we 
    // add both the title and story (value) into a new file.
    for (let title of stories.keys()) {
        let story = stories.get(title);
        // the appendFile() method will create a new stories.txt file since the previous one was deleted.
        fs.appendFile('stories.txt', '\n' + title + '\n' + splitConstant + '\n'  + story + '\n' + splitConstant, function(err) {
            if (err) {
                return console.error(err);
            }
        });
    }

    console.log('stories.txt file recreated!');
}


/**
 * This function creates a new Map() and fills it with a user uploaded file
 * with their newly added password
 */
function readFile(input) {
    stories = new Map();
    var file = input.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        let combos = reader.result.split(splitConstant); // split at new line                                                                                     
        for (let i = 0; i < combos.length; i+=2) {
            let key = String(combos[i].trim()); // first item is key                                                                                                        
            let val = String(combos[i+1].trim()); // second item is val                                                                                                    
            console.log("key: " + key);
            console.log("val: " + val);
            stories.set(key, val);
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
    const iterator1 = stories[Symbol.iterator]();
    var combos = "";
    for (const item of iterator1) {
        combos = combos  + item[0] + '\n' + splitConstant + '\n'  + item[1] + '\n' + splitConstant + '\n';
    }
    var text = combos;
    var filename = 'stories.txt';
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * This function is called when the add button is clicked in the story html file.
 * It adds a new story to the Hashtable. appendFile() adds to end of file
 */
function addStory(title, story) {
    stories.set(title, story);
    document.getElementById('title').value = '';
    document.getElementById('addNewStoryArea').value = '';
    alert("Story added successfully!");
}

/**
 * This functions clears the displayStory inner html to display its default message. It's called when the clear button is clicked
 * by the user.
 */
function clearStory() {
    document.getElementById('displayStory').innerHTML = 'Find a good read!';
}

