import * as THREE from "three";
import "./style.css";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Color } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

//*scene
const scene = new THREE.Scene();

//*texture
let textureURL =
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg";
let displacementURL =
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg";
const textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load(textureURL);
let displacementMap = textureLoader.load(displacementURL);

function loadModel() {
  const loader = new GLTFLoader();

  // Load the GLTF model
  loader.load("./assets/head/scene.gltf", (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        // Check if the child is a mesh
        const mesh = child;
        if (mesh.material) {
          const material = mesh.material;
          material.color.set(0xc0c0c0);
          material.metalness = 0.5;
          material.shininess = 50;
          material.roughness = 0.6;
        }
      }
    });

    // Adjust the model's scale, position, and rotation as needed
    model.scale.set(9, 9, 9);
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);

    var mouse = new THREE.Vector2();

    let plane = new THREE.Plane(new THREE.Vector3(0, 0, 0.079), -1);
    let raycaster = new THREE.Raycaster();
    let pointOfIntersection = new THREE.Vector3();

    window.addEventListener("mousemove", function (e) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, pointOfIntersection);

      model.lookAt(pointOfIntersection);
    });

    // Add the model to the scene
    scene.add(model);

    // Call the animate function to start rendering
    animate();
  });
}
loadModel();

// Create the circular platform geometry
const platformGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 60);
const platformMaterial = new THREE.MeshStandardMaterial({
  color: 0x888888,
  roughness: 0.5,
  metalness: 0.5,
});
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.position.set(0, -5.2, 0);
// scene.add(platform);

//................................
const platformGeometrylight = new THREE.CylinderGeometry(4.5, 4.5, 0.6, 60);
const platformMaterial2 = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.5,
  metalness: 0.5,
  emissive: 0xffffff, // Set the emissive color (green in this example)
  emissiveIntensity: 1, // Adjust the emissive intensity as needed
});
const platformL = new THREE.Mesh(platformGeometrylight, platformMaterial2);
platformL.position.set(0, -5.2, 0);
// scene.add(platformL);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight2.position.set(0, 11, 0); // Adjust the light direction
// platformL.add(directionalLight2);

//*the object we want to add

// scene.add(moon);

//*Sizes
const Sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//*light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0); // Adjust the light direction
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5); // Adjust the colors and intensity
hemisphereLight.position.set(1, -10, 1); // Adjust the light direction
scene.add(hemisphereLight);

// const light = new THREE.PointLight(0xffffff, 1);
// light.position.set(-100, 10, 50);
// light.intensity = 0.8;
// scene.add(light);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 10);
// hemiLight.color.setHSL(0.6, 1, 0.6);
// hemiLight.groundColor.setHSL(0.095, 1, 0.75);
// hemiLight.position.set(0, 0, 0);
// scene.add(hemiLight);

//*camera
const camera = new THREE.PerspectiveCamera(
  75,
  Sizes.width / Sizes.height,
  0.1,
  1000
);
camera.position.z = 20;
scene.add(camera);

//*rendering
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(Sizes.width, Sizes.height);
renderer.render(scene, camera);
renderer.setClearColor(0x0c0c0c, 0);

//*controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = false;
// controls.enablePan = false;
// controls.enableZoom = true;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 5

//*Resize
window.addEventListener("resize", () => {
  //*update size
  // Sizes.width = window.innerWidth;
  // Sizes.height = window.innerHeight;

  //*update camera
  // camera.updateProjectionMatrix();
  // camera.aspect = Sizes.width/Sizes.height;
  // renderer.setSize(Sizes.width,Sizes.height);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//*looping the frames and animation
function animate() {
  requestAnimationFrame(animate);
  // controls.update();
  renderer.render(scene, camera);
}
animate();

//*timeline magic
const tl = gsap.timeline({ defaults: { duration: 1 } });
// tl.fromTo(moon.scale, { z: 0.3, x: 0.3, y: 0.3 }, { z: 1, x: 1, y: 1 });
tl.fromTo(".header", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1 });
