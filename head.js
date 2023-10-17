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
  const vShader = `
  uniform float time;
  uniform float progress;
  uniform sampler2D texture1;
  uniform vec4 resolution;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;


  void main(){
    vUv = uv;
    vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1 );
  }
  `;

  const fShader = `
  uniform float time;
  uniform vec4 resolution;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  // Define a function to generate Perlin noise
  float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float PI = 3.141592653589793238;

  float speed = 0.1; // Adjust the speed of the noise animation
  float scale = .4; // Adjust the scale of the noise

  void main() {
    // Calculate the noise value based on time and UV coordinates
    vec2 noiseInput = vUv * scale + vec2(time * speed);
    float noiseValue = random(noiseInput);

    // Displace the fragment position along the normal vector using noise
    float displacement = (noiseValue - 1.9) * 0.9; // Adjust the displacement range

    vec3 displacedPosition = vPosition + vNormal * displacement;

    // Calculate the diffuse lighting based on the original normal
    // Modify the light direction to include noise over time
    float noiseFactor = 0.1; // Adjust the noise intensity
    vec3 lightDirection = normalize(vec3(0.5, 0.9, 1.1) + noiseFactor * vec3(sin(time), cos(time), 0.0));

    float diff = dot(vNormal, lightDirection);
    
    // Apply color modulation based on the displaced normal and time
    vec4 waterColor = vec4(0.26, 0.58, 0.29, 1.0) * (0.5 + abs(sin(diff * 8.0 + time)));
    // 0.26	0.67	0.54


    gl_FragColor = waterColor;
}

`;
  const uniforms = {
    time: { value: 0 }, // Initialize time to zero, update it in your animation loop
    resolution: { value: new THREE.Vector4() }, // This will be automatically set by Three.js
  };
  const loader = new GLTFLoader();

  loader.load("./assets/head/scene.gltf", (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        // Check if the child is a mesh
        const mesh = child;
        if (mesh.material) {
          mesh.material = new THREE.ShaderMaterial({
            vertexShader: vShader,
            fragmentShader: fShader,
            uniforms,
          });
        }
      }
    });

    // Enable shadows for this mesh
    model.castShadow = true;
    model.receiveShadow = true; // If needed

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

    function animate() {
      requestAnimationFrame(animate);

      // Update the time uniform in your animation loop
      uniforms.time.value += 0.01; // You can adjust the time increment as needed

      renderer.render(scene, camera);
    }

    animate();
  });

  //added the glassy overLay
  loader.load("./assets/head/scene.gltf", (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        // Check if the child is a mesh
        const mesh = child;
        if (mesh.material) {
          // Create a transparent material with refraction and opacity
          const glassMaterial = new THREE.MeshPhysicalMaterial({
            roughness: 0.2,
            transmission: 1,
            thickness: 1,
            envMapIntensity: 3,
          });

          mesh.material = glassMaterial;
        }
      }
    });

    // Adjust the model's scale, position, and rotation as needed
    model.scale.set(9.3, 9.3, 9.3);
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

    function animate() {
      requestAnimationFrame(animate);

      // Update the time uniform in your animation loop
      uniforms.time.value += 0.01; // You can adjust the time increment as needed

      renderer.render(scene, camera);
    }

    animate();
  });
}
loadModel();

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

const light = new THREE.PointLight(0xffffff, 1);
light.position.set(-100, 10, 50);
light.intensity = 0.8;
scene.add(light);

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
