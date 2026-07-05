// =====================================================
// Face Tracker Main Script
// =====================================================

const vrButton = document.getElementById("vrButton");

const vrView = document.getElementById("vrView");

const app = document.getElementById("app");

let vrEnabled = false;

vrButton.onclick = () => {

    vrEnabled = !vrEnabled;

    if(vrEnabled){

        app.classList.add("hidden");
        vrView.classList.remove("hidden");

        vrButton.textContent = "Exit";

    }else{

        app.classList.remove("hidden");
        vrView.classList.add("hidden");

        vrButton.textContent = "VR";

    }

};

import "./tracker.js";

// Future startup code can go here.

console.log("Face Tracker Loaded");
