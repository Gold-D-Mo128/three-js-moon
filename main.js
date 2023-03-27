import * as THREE from 'three';
import './style.css'
import gsap from 'gsap';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Color } from 'three';


//*scene
const scene = new THREE.Scene();


//*texture
let textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg"; 
let displacementURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg"; 
const textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load(textureURL);
let displacementMap = textureLoader.load( displacementURL );


//*the object we want to add
const geometry = new THREE.SphereGeometry(5,60,60);
const material = new THREE.MeshStandardMaterial({
  color:"#ffffff",
  map: texture, 
  displacementMap: displacementMap,
  displacementScale: 0.06,
  bumpMap: displacementMap,
  bumpScale: 0.04,
   reflectivity:0, 
   shininess :0

})
const moon = new THREE.Mesh(geometry, material);
scene.add(moon)

//*Sizes
const Sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//*light
const light = new THREE.PointLight(0xffffff,0.5);
light.position.set(-100,10,50);
light.intensity = 0.8
scene.add(light);

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.2 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 0, 0 );
scene.add( hemiLight );

//*camera
const camera = new THREE.PerspectiveCamera(75, Sizes.width/Sizes.height, 0.1,1000);
camera.position.z = 20;
scene.add(camera);


//*rendering
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize( Sizes.width,Sizes.height);
renderer.render(scene,camera);
renderer.setClearColor(0x0c0c0c,0)



//*controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
// controls.autoRotate = true
// controls.autoRotateSpeed = 5




//*Resize
window.addEventListener('resize',()=>{
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
})

//*looping the frames and animation
function animate() {
	requestAnimationFrame( animate );
  moon.rotation.y += 0.002;
  moon.rotation.x += 0.0001;

  controls.update()

	renderer.render( scene, camera );
}
animate();

//*timeline magic
const tl = gsap.timeline({defaults:{duration:1}})
tl.fromTo(moon.scale, {z:0.3, x:0.3, y:0.3}, {z:1, x:1, y:1 })
tl.fromTo('.header', {scale:0.9, opacity:0},{scale:1, opacity:1})





