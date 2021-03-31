'use strict'
const switcher = document.querySelector('.btn');
 switcher.addEventListener('click', function() {
    
    var className = document.body.className;
    if(className == "fadeWhite") {
        document.body.className="fadeBlack";
        document.getElementById("btn").textContent = "Dark";

    }
    else {
        
        document.body.className="fadeWhite";
        document.getElementById("btn").textContent = "Light"; 

    }


});
