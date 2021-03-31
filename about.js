'use strict'
const input = document.querySelector("input.aboutme");
 input.addEventListener('click', function(){
    var x = document.getElementById("hidden");
    var g = document.getElementById("a");
    alert(x.className)
    if(x== "hidden") {
        x.className="expand";
        g.className="anim";
        
    }
    if(x.className=="expand"){
        x.className="hidden"
        g.className="rev";
        document.getElementsByTagName("p")[0].removeAttribute("hidden"); 

    }
    else{
        g.className="anim";
        x.className="expand";
        document.getElementsByTagName("p")[0].removeAttribute("hidden"); 
        alert(getElementsByTagName('p'));

    }
    });


