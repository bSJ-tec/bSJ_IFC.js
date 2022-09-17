import {
    AmbientLight,
    AxesHelper,
    Color,
    DirectionalLight,
    GridHelper,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "./node_modules/three/examples/jsm/loaders/IFCLoader";

//Three.js シーンの作成
const scene = new Scene();
scene.background = new Color(0xaaaaaa);

// Viewport size seting
const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// User view point setting
const camera = new PerspectiveCamera(75, size.width/size.height);
camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 3;

// Light setting
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 0,5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(0,10,0);
directionalLight.target.position.set(-5,0,0);
scene.add(directionalLight);
scene.add(directionalLight.target);

// Renderer setting
const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({canvas: threeCanvas});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Grid setting
const grid = new GridHelper(50,30);
scene.add(grid);

const axis = new AxesHelper();
axis.material.depthTest = false;
axis.renderOder = 1;
scene.add(axis);

// OrbitControls
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;

// Animation loop
const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();

// Viewport setting
window.addEventListener("resize", () => {
    (size.width = window.innerWidth), (size.height = window.innerHeight);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
});

// IFC Loader setting
const ifcLoader = new IFCLoader();
ifcLoader.ifcManager.setWasmPath("wasm/");

const input = document.getElementById("file-input");
input.addEventListener(
    "change",
    (changed) => {
        var ifcURL = URL.createObjectURL(changed.target.files[0]);
        console.log(ifcURL);
        ifcLoader.load(ifcURL, (geometry) => scene.add(geometry));
    },
    false
);

