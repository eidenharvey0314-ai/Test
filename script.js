const video = document.getElementById("camera");

navigator.mediaDevices.getUserMedia({

video:true,
audio:true

})
.then(stream=>{

video.srcObject=stream;

});

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.continuous=false;
recognition.lang="en-US";

document.getElementById("talk").onclick=()=>{

recognition.start();

};

recognition.onresult = async(event)=>{

const text = event.results[0][0].transcript;

addChat("You",text);

const response = await fetch("/ask",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

message:text

})

});

const data = await response.json();

addChat("AI",data.reply);

const speech = new SpeechSynthesisUtterance(data.reply);

speechSynthesis.speak(speech);

}

function addChat(name,msg){

const chat=document.getElementById("chat");

chat.innerHTML+=`<p><b>${name}:</b> ${msg}</p>`;

chat.scrollTop=chat.scrollHeight;

}
