import {
    FaceDetector,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function setupCamera(){

    const stream = await navigator.mediaDevices.getUserMedia({
        video:{
            width:640,
            height:480,
            facingMode:"user"
        }
    });

    video.srcObject = stream;

    return new Promise(resolve=>{
        video.onloadedmetadata=()=>{
            resolve(video);
        };
    });

}

async function createDetector(){

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    return await FaceDetector.createFromOptions(vision,{
        baseOptions:{
            modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite"
        },
        runningMode:"VIDEO"
    });

}

(async()=>{

    await setupCamera();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detector = await createDetector();

    function render(){

        ctx.clearRect(0,0,canvas.width,canvas.height);

        const faces = detector.detectForVideo(
            video,
            performance.now()
        );

        if(faces.detections){

            const maxFaces = Math.min(faces.detections.length,5);

            for(let i=0;i<maxFaces;i++){

                const box = faces.detections[i].boundingBox;

                ctx.strokeStyle="#00ff00";
                ctx.lineWidth=3;

                ctx.strokeRect(
                    box.originX,
                    box.originY,
                    box.width,
                    box.height
                );

                ctx.fillStyle="#00ff00";
                ctx.font="18px Arial";

                ctx.fillText(
                    "Face "+(i+1),
                    box.originX,
                    box.originY-10
                );

            }

        }

        requestAnimationFrame(render);

    }

    render();

})();
