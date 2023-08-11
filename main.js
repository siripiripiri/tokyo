import * as THREE from 'https://unpkg.com/browse/three@0.97.0/build/three.module.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './style.css';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,0.1,1000);
camera.position.set(1,0,0);
camera.lookAt(new THREE.Vector3(0,0,0));


const renderer = new THREE.WebGLRenderer({
  canvas : document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(0);


//making the rings

const geometry = new THREE.TorusGeometry(10,1,24,50)
const material = new THREE.MeshStandardMaterial( {color: 0xf8b9fa});
const ring1 = new THREE.Mesh(geometry,material);

scene.add(ring1);

const geometry1 = new THREE.TorusGeometry(10,1,24,50)
const material1 = new THREE.MeshStandardMaterial( {color: 0xf8b9fa});
const ring2 = new THREE.Mesh(geometry1,material1);

scene.add(ring2);
ring2.rotation.set(4.7,0,0)

const ambientLight = new THREE.AmbientLight(0xffffff)
const pointLight = new THREE.PointLight(0xfffaeb)
pointLight.position.set(20,20,20)
scene.add(pointLight,ambientLight)

const controls = new OrbitControls(camera,renderer.domElement);



function animate(){
  requestAnimationFrame(animate);

  ring1.rotation.x += 0.01;
  ring1.rotation.y += 0.005;
  ring1.rotation.z += 0.01;

  ring2.rotation.x += 0.01;
  ring2.rotation.y += 0.005;
  ring2.rotation.z += -0.01;

  controls.update();

  renderer.render(scene,camera);
}

animate()


//making the balls

function addBalls(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const balls = new THREE.Mesh(geometry,material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));

  balls.position.set(x,y,z);
  scene.add(balls);
}

Array(400).fill().forEach(addBalls)

//making a cube with custom faces

const sanjal = new THREE.TextureLoader().load('san.jpg');

const sanjalCube = new THREE.Mesh(
  new THREE.BoxGeometry(5,5,5),
  new THREE.MeshBasicMaterial( { map: sanjal})
);

scene.add(sanjalCube);


const mtlLoader = new MTLLoader();
mtlLoader.setPath('');

// Load the MTL file
function addHearts(){
mtlLoader.load('heart.mtl', function (materials) {
  materials.preload();

  // Create an instance of the OBJLoader
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('');

  // Load the OBJ file
  objLoader.load(
    'heart.obj',
    function (hearts) {
      const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(250));

      hearts.position.set(x,y,z);
      hearts.scale.set(0.3,0.3,0.3);
      hearts.rotation.x = 4.7;
      scene.add(hearts);
    }
  );
});
}

Array(420).fill().forEach(addHearts)

//ramen
function addRamen(){
  mtlLoader.load('ramensketch.mtl', function (materials) {
    materials.preload();
  
    // Create an instance of the OBJLoader
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('');
  
    // Load the OBJ file
    objLoader.load(
      'ramensketch.obj',
      function (ramen) {
        ramen.rotation.x = -5;
        ramen.position.x= -13;
        ramen.position.y = 4;
        ramen.position.z= 21;
        ramen.scale.set(3,3,3);
        scene.add(ramen);
      }
    );
  });
  }
  
addRamen()
const pointLightRamen = new THREE.PointLight(0xfffaeb)
pointLightRamen.position.set(-12,4,21);


//moving camera on scroll

function moveCamera(){

  const t = document.body.getBoundingClientRect().top;


  sanjalCube.rotation.y += 0.0075;

  camera.position.z = t* -0.01;
  camera.position.x = t* 0.002;
  camera.position.y = t* -0.002;
  renderer.render(scene,camera);

}

document.body.onscroll = moveCamera



//js for the texts

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) =>{
    console.log(entry)
    if (entry.isIntersecting){
      entry.target.classList.add('show');
    }
    else{
      entry.target.classList.remove('show');
    }
  });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

