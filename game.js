import * as THREE from 'three';

const scene = new THREE.Scene();

scene.fog = new THREE.Fog(0x222222, 10, 80);

const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias:true
});

renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

camera.position.set(0, 2, 8);

const room = new THREE.Mesh(
    new THREE.BoxGeometry(20,10,20),
    new THREE.MeshStandardMaterial({
        color:0x888888,
        side:THREE.BackSide
    })
);

scene.add(room);

const light = new THREE.PointLight(0xffffcc, 20);
light.position.set(0,4,0);

scene.add(light);

const portal = new THREE.Mesh(
    new THREE.BoxGeometry(5,7,0.2),
    new THREE.MeshBasicMaterial({
        color:0x000000
    })
);

portal.position.set(0,0,-9.8);
portal.visible = false;

scene.add(portal);

document.addEventListener("keydown",(e)=>{

    if(e.key.toLowerCase() === "m"){

        portal.visible = true;

        portal.material.color.set(0x00ffff);

        setTimeout(()=>{
            camera.position.z = -20;
        },3000);
    }
});

function animate(){

    requestAnimationFrame(animate);

    renderer.render(scene,camera);
}

animate();
