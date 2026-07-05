import {
    savePerson,
    getPerson
} from "./storage.js";

const container = document.getElementById("faceContainer");

const popup = document.getElementById("popup");

const nameInput = document.getElementById("nameInput");
const ageInput = document.getElementById("ageInput");
const infoInput = document.getElementById("infoInput");

const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

let currentFace = null;

const cards = new Map();

/*
-----------------------------------
Create Card
-----------------------------------
*/

export function createCard(faceID){

    if(cards.has(faceID))
        return cards.get(faceID);

    const card = document.createElement("div");
    card.className = "personCard";

    const name = document.createElement("div");
    name.className = "personName";

    const age = document.createElement("div");
    age.className = "personAge";

    const info = document.createElement("div");
    info.className = "personInfo";

    const button = document.createElement("button");
    button.className = "registerButton";
    button.textContent = "Register";

    card.appendChild(name);
    card.appendChild(age);
    card.appendChild(info);
    card.appendChild(button);

    container.appendChild(card);

    cards.set(faceID,{
        card,
        name,
        age,
        info,
        button
    });

    refreshCard(faceID);

    button.onclick=()=>{

        currentFace=faceID;

        const person=getPerson(faceID);

        nameInput.value=person?.name||"";
        ageInput.value=person?.age||"";
        infoInput.value=person?.info||"";

        popup.classList.remove("hidden");

    };

    return cards.get(faceID);

}

/*
-----------------------------------
Refresh Card
-----------------------------------
*/

export function refreshCard(faceID){

    const ui=cards.get(faceID);

    if(!ui) return;

    const person=getPerson(faceID);

    if(person){

        ui.name.textContent=person.name;
        ui.age.textContent="Age: "+person.age;
        ui.info.textContent=person.info||"";

        ui.button.textContent="Edit";

    }
    else{

        ui.name.textContent="Unregistered Person";
        ui.age.textContent="";
        ui.info.textContent="";

        ui.button.textContent="Register";

    }

}

/*
-----------------------------------
Move Card
-----------------------------------
*/

export function moveCard(faceID,x,y){

    const ui=createCard(faceID);

    ui.card.style.left=x+"px";
    ui.card.style.top=y+"px";

}

/*
-----------------------------------
Remove Card
-----------------------------------
*/

export function removeCard(faceID){

    const ui=cards.get(faceID);

    if(!ui) return;

    ui.card.remove();

    cards.delete(faceID);

}

/*
-----------------------------------
Popup Buttons
-----------------------------------
*/

cancelBtn.onclick=()=>{

    popup.classList.add("hidden");

};

saveBtn.onclick=()=>{

    if(currentFace==null)
        return;

    savePerson(

        currentFace,

        nameInput.value.trim()||"Unknown",

        ageInput.value||"Unknown",

        infoInput.value.trim()

    );

    refreshCard(currentFace);

    popup.classList.add("hidden");

};
