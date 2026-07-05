import {
    moveCard,
    removeCard
} from "./ui.js";

const video = document.getElementById("video");
const canvas = document.getElementById("overlay");

const ctx = canvas.getContext("2d");

const isMobile =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

let detector;

const activeFaces = new Set();

/*
--------------------------
Camera
--------------------------
*/

async function setupCamera(){

    const stream = await navigator.mediaDevices.getUserMedia({

        video:{
            width:640,
            height:480,
            facingMode: isMobile ? "environment" : "user"
        },

        audio:false

    });

    video.srcObject = stream;

    return new Promise(resolve=>{

        video.onloadedmetadata=()=>{

            canvas.width=video.videoWidth;
            canvas.height=video.videoHeight;

            resolve();

        };

    });

}

/*
--------------------------
Detector
--------------------------
*/

async function createDetector(){

    const vision = await window.FilesetResolver.forVisionTasks(

        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"

    );

    detector = await window.FaceDetector.createFromOptions(

        vision,

        {

            baseOptions:{

                modelAssetPath:

                "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite"

            },

            runningMode:"VIDEO",

            minDetectionConfidence:0.5

        }

    );

}

/*
--------------------------
Loop
--------------------------
*/

function update(){

    if(!detector){

        requestAnimationFrame(update);
        return;

    }

    const results = detector.detectForVideo(

        video,
        performance.now()

    );

    activeFaces.clear();

    if(results.detections){

        const limit = Math.min(

            results.detections.length,

            5

        );

        for(let i=0;i<limit;i++){

            const face = results.detections[i];

            const box = face.boundingBox;

            const id = "face"+i;

            activeFaces.add(id);

            const scaleX = window.innerWidth / video.videoWidth;
            const scaleY = window.innerHeight / video.videoHeight;

            const x =
                (box.originX + box.width + 20) * scaleX;

            const y =
                (box.originY - 20) * scaleY;

            moveCard(id,x,y);

        }

    }

    document.querySelectorAll(".personCard").forEach(card=>{

        const index = Array.from(

            document.querySelectorAll(".personCard")

        ).indexOf(card);

        const id="face"+index;

        if(!activeFaces.has(id)){

            removeCard(id);

        }

    });

    requestAnimationFrame(update);

}

/*
--------------------------
Start
--------------------------
*/

export async function startTracker(){

    await setupCamera();

    await createDetector();

    update();

}

startTracker();
