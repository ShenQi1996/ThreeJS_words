import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/*** gui */
const gui = new dat.GUI();

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorLoader = textureLoader.load("/textures/door/color.jpg");
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

// The order matter a lot here.   make sure is px - nx - py - ny -pz -nz
const EnvironmentMapTexture = cubeTextureLoader.load([
  "textures/environmentMaps/0/px.jpg",
  "textures/environmentMaps/0/nx.jpg",
  "textures/environmentMaps/0/py.jpg",
  "textures/environmentMaps/0/ny.jpg",
  "textures/environmentMaps/0/pz.jpg",
  "textures/environmentMaps/0/nz.jpg",
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object  / Material
 */

/*** 1 Mesh Basic Material */
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorLoader;
// // 2 Anther way to set the color on the material.
// // material.color.set("rgb");
// // material.color = new THREE.Color("rgb")
// /**
//  * Wirefame for material
//  */
// // material.wireframe = true;
// /**
//  * Opacity for the material
//  */
// // material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = alphaTexture;
// // ".side" let you decide which side of a face is visble
// // material.side = THREE.FrontSide;
// // material.side = THREE.BackSide;
// material.side = THREE.DoubleSide;

/*** 2 Mesh Normal Material */
//const material = new THREE.MeshNormalMaterial();
// Mesh Normal Material can also have opacity, transparent, .side and flatShading

/*** 3 Mesh Matcap Material */
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

/*** 4 Mesh Depth Material */
// const material = new THREE.MeshDepthMaterial();

/*** 5 Mesh Lamber Material   Depended on lights  -- good with performant */
// const material = new THREE.MeshLambertMaterial();

/*** 6 Mesh Phong Material looks better then Lamber on the reflection  */
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000;
// material.specular = new THREE.Color(0xffffff)

/*** 8 Mesh Toon Material is similar to Mesh Lamber Material but with a cartoonish */
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

/*** 9 Mesh Standard Material -- the best one */
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0;    defualt   0
// material.roughness = 1;    defualt   1

/*** 10 Mesh Physical Material it give object a clear coat effect */
// const material = new THREE.MeshPhysicalMaterial();

/*** 11 Shader Material and Raw Shader Material   --  both use to create your own materials */

/*** 12 Environment Map  */

// material.map = doorColorLoader;
// material.aoMap = ambientOcclusionTexture;
// // aoMap can cnage intensity
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);

// material.transparent = true;
// material.alphaMap = alphaTexture;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;

material.envMap = EnvironmentMapTexture;

gui.add(material, "metalness", 0, 1, 0.0001);
gui.add(material, "roughness", 0, 1, 0.0001);
gui.add(material, "aoMapIntensity", 0, 10, 0.0001);
gui.add(material, "displacementScale", 0, 10, 0.0001);

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 64, 64),
  material
);

sphere.position.x = -1.5;

sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 100, 100),
  material
);

plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
  material
);

torus.position.x = 1.5;

torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

scene.add(sphere, plane, torus);

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update object
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.1 * elapsedTime;
  plane.rotation.x = 0.1 * elapsedTime;
  torus.rotation.x = 0.1 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
