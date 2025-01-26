// import React from 'react';
// import ReactDOM from 'react-dom';
// import AnimatedCursor from './animatedCursor'; // adjust the path if necessary

// // function App() {
// //   return (
// //     <div className="App">
// //       AnimatedCursor
      
//     </div>
//   );
// }

// export default App;




// import * as THREE from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import Threeasy from "threeasy";

// const app = new Threeasy(THREE, { alpha: true });
// var loader = new GLTFLoader();
// let modelUrl = '/retro_computer/scene.gltf';

// // Declare the model globally
// let loadedModel;

// loader.load(modelUrl, function (gltf) {
//     loadedModel = gltf.scene; // Store the model globally
//     loadedModel.scale.set(0.7, 0.7, 0.7); // Scale uniformly

//     loadedModel.rotation.set(Math.PI/2, 0, 0); // Set initial rotation

//     gltf.scene.traverse(function(child) {
//       if (child.isMesh) {
//         child.material.side = THREE.FrontSide; // Make material single-sided
//         // material.transparent = false;  // Disable transparency
//         // material.opacity = 1;
//         child.material.depthWrite = true;       
//         child.material.depthTest = true; 
//         child.material.metalness = 0.8;  // Example for metallic material
//         child.material.roughness = 0.3;
//       }
//     });

//     app.scene.add(loadedModel);
// });

// window.addEventListener('scroll', onScroll);

// function onScroll() {
//     if (loadedModel) { // Check if the model is loaded
//         const scrollY = window.scrollY;
//         const rotationSpeed = 0.001;

//         // Update the rotation based on the scroll
//         loadedModel.rotation.x = scrollY * rotationSpeed;
//         loadedModel.rotation.y = scrollY * rotationSpeed;
//     }
// }

// const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
// app.scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xfdf4dc, 1); // Bright light
// directionalLight.position.set(5, 5, 5); // Light position
// app.scene.add(directionalLight);


// app.renderer.gammaOutput = true;
// app.renderer.gammaFactor = 2.2; // Adjust this value for better colors
// app.renderer.toneMappingExposure = 1.4; // Adjust this value (default is 1)


import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Threeasy from "threeasy";


const app = new Threeasy(THREE, { alpha: true });
var loader = new GLTFLoader();
let modelUrl = '/public/retro_computer/scene.gltf';

// Declare variables
let loadedModel;
let isAnimating = false;
let isZoomedOut = false;
let animationProgress = 0;

// Configuration
const ROTATION_SPEED = 0.04;
const SCROLL_THRESHOLD = 10;
const ANIMATION_DURATION = 2000;
const MIN_CAMERA_Z = 5;
const MAX_CAMERA_Z = 30;

// Setup camera
app.camera.position.z = MIN_CAMERA_Z;
const initialCameraPosition = app.camera.position.clone();

loader.load(modelUrl, function (gltf) {
    loadedModel = gltf.scene;
    loadedModel.scale.set(1.5, 1.5, 1.5);
    
    // Center the model
    const box = new THREE.Box3().setFromObject(loadedModel);
    const center = box.getCenter(new THREE.Vector3());
    loadedModel.position.sub(center);

    gltf.scene.traverse(function(child) {
        if (child.isMesh) {
            child.material.side = THREE.FrontSide;
            child.material.depthWrite = true;       
            child.material.depthTest = true; 
            child.material.metalness = 0.8;
            child.material.roughness = 0.3;
            child.material.transparent = true;
            child.material.opacity = 1;
        }
    });

    app.scene.add(loadedModel);
});

// Mouse movement handler
function onMouseMove(event) {
    if (!loadedModel || isAnimating || isZoomedOut) return;

    // Calculate cursor position in 3D space
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Create a target vector for the model to look at
    const target = new THREE.Vector3(mouseX * 5, mouseY * 5, 0);
    
    // Calculate the direction from the model to the cursor
    const direction = target.clone().sub(loadedModel.position).normalize();
    
    // Create a temporary matrix to help with rotation
    const matrix = new THREE.Matrix4();
    matrix.lookAt(direction, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    
    // Convert matrix to quaternion for smooth rotation
    const targetQuaternion = new THREE.Quaternion();
    targetQuaternion.setFromRotationMatrix(matrix);
    
    // Smoothly interpolate current rotation to target rotation
    loadedModel.quaternion.slerp(targetQuaternion, ROTATION_SPEED);
}

// Scroll handler
function onScroll() {
    if (!loadedModel || isAnimating) return;

    const shouldZoomOut = window.scrollY > SCROLL_THRESHOLD;
    
    if (shouldZoomOut !== isZoomedOut) {
        startAnimation(shouldZoomOut);
    }
}

// Start animation (works for both exit and entry)
function startAnimation(zoomingOut) {
    isAnimating = true;
    animationProgress = 0;
    const startTime = Date.now();
    const startCameraZ = app.camera.position.z;
    const targetCameraZ = zoomingOut ? MAX_CAMERA_Z : MIN_CAMERA_Z;

    function animate() {
        const currentTime = Date.now();
        animationProgress = Math.min((currentTime - startTime) / ANIMATION_DURATION, 1);
        
        // Use easing function for smoother animation
        const eased = zoomingOut 
            ? 1 - Math.pow(1 - animationProgress, 3) // Cubic ease-out for exit
            : Math.pow(animationProgress, 3);        // Cubic ease-in for entry

        if (loadedModel) {
            // Zoom effect
            app.camera.position.z = startCameraZ + (targetCameraZ - startCameraZ) * eased;
            
            // Fade effect
            loadedModel.traverse((child) => {
                if (child.material) {
                    child.material.opacity = zoomingOut ? (1 - eased) : eased;
                }
            });
        }

        if (animationProgress < 1) {
            requestAnimationFrame(animate);
        } else {
            isAnimating = false;
            isZoomedOut = zoomingOut;
            
            // If zoomed out completely, optionally hide the model
            if (isZoomedOut) {
                loadedModel.visible = false;
            }
        }
    }

    // Make sure model is visible when starting entry animation
    if (!zoomingOut) {
        loadedModel.visible = true;
    }

    animate();
}

// Event listeners
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('scroll', onScroll);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x404040, 1);
app.scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xfdf4dc, 1);
directionalLight.position.set(5, 5, 5);
app.scene.add(directionalLight);

// Renderer settings
app.renderer.gammaOutput = true;
app.renderer.gammaFactor = 2.2;
app.renderer.toneMappingExposure = 1.4;
