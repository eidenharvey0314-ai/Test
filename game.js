import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";
import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/controls/PointerLockControls.js";

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x999966, 20, 200);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, document.body);

document.getElementById("startBtn").onclick = () => {
    controls.lock();
    document.getElementById("startScreen").style.display = "none";
};

camera.position.y = 2;

const ambient = new THREE.AmbientLight(0xffffcc, 0.8);
scene.add(ambient);

const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0,8,0);
scene.add(light);

const chunks = new Map();

const ROOM_SIZE = 20;
const LOAD_DISTANCE = 4;

function createRoom(x,z) {

    const group = new THREE.Group();

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE),
        new THREE.MeshStandardMaterial({
            color: 0x999955
        })
    );

    floor.rotation.x = -Math.PI/2;
    group.add(floor);

    const ceiling = floor.clone();
    ceiling.position.y = 5;
    ceiling.rotation.x = Math.PI/2;
    group.add(ceiling);

    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xd8d08a
    });

    function wall(px,pz,rot) {
        const wall = new THREE.Mesh(
            new THREE.PlaneGeometry(ROOM_SIZE,5),
            wallMaterial
        );

        wall.position.set(px,2.5,pz);
        wall.rotation.y = rot;

        group.add(wall);
    }

    if(Math.random() > 0.2)
        wall(0,-ROOM_SIZE/2,0);

    if(Math.random() > 0.2)
        wall(0,ROOM_SIZE/2,Math.PI);

    if(Math.random() > 0.2)
        wall(-ROOM_SIZE/2,0,Math.PI/2);

    if(Math.random() > 0.2)
        wall(ROOM_SIZE/2,0,-Math.PI/2);

    const lamp = new THREE.PointLight(
        0xffffee,
        1.5,
        30
    );

    lamp.position.y = 4.5;
    group.add(lamp);

    group.position.set(
        x * ROOM_SIZE,
        0,
        z * ROOM_SIZE
    );

    scene.add(group);

    return group;
}

function updateChunks() {

    const cx = Math.floor(camera.position.x / ROOM_SIZE);
    const cz = Math.floor(camera.position.z / ROOM_SIZE);

    for(let x=-LOAD_DISTANCE;x<=LOAD_DISTANCE;x++) {
        for(let z=-LOAD_DISTANCE;z<=LOAD_DISTANCE;z++) {

            const key = `${cx+x},${cz+z}`;

            if(!chunks.has(key)) {
                chunks.set(
                    key,
                    createRoom(cx+x, cz+z)
                );
            }
        }
    }
}

let moveForward=false;
let moveBackward=false;
let moveLeft=false;
let moveRight=false;

document.addEventListener("keydown",e=>{
    if(e.code==="KeyW") moveForward=true;
    if(e.code==="KeyS") moveBackward=true;
    if(e.code==="KeyA") moveLeft=true;
    if(e.code==="KeyD") moveRight=true;
});

document.addEventListener("keyup",e=>{
    if(e.code==="KeyW") moveForward=false;
    if(e.code==="KeyS") moveBackward=false;
    if(e.code==="KeyA") moveLeft=false;
    if(e.code==="KeyD") moveRight=false;
});

const velocity = new THREE.Vector3();

let time = 0;

function animate() {

    requestAnimationFrame(animate);

    updateChunks();

    velocity.set(0,0,0);

    if(moveForward) velocity.z -= 0.15;
    if(moveBackward) velocity.z += 0.15;
    if(moveLeft) velocity.x -= 0.15;
    if(moveRight) velocity.x += 0.15;

    controls.moveRight(velocity.x);
    controls.moveForward(-velocity.z);

    time += 0.1;

    camera.position.y =
        2 +
        Math.sin(time * 1.7) * 0.05;

    camera.rotation.z =
        Math.sin(time * 0.8) * 0.003;

    renderer.render(scene,camera);
}

animate();

window.addEventListener("resize",()=>{
    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});
