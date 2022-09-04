import * as THREE from "three";
import Jimp from "jimp";
import fs from "fs";
import _gl from "gl";
import { JSDOM } from "jsdom";

const { window } = new JSDOM();
(global as any).document = window.document;

const width = 600;
const height = 400;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const gl = _gl(width, height, { premultipliedAlpha: true });
const renderer = new THREE.WebGLRenderer({ context: gl, antialias: true });
// renderer.setPixelRatio(2)

renderer.setSize(width, height);
renderer.outputEncoding = THREE.sRGBEncoding;

var light1 = new THREE.PointLight();
light1.position.set(50, 50, 50);
scene.add(light1);

var light2 = new THREE.PointLight();
light2.position.set(-50, 50, 50);
light2.intensity = 0.1;
scene.add(light2);

const material = new THREE.MeshStandardMaterial({ color: "green" });
const geometry = new THREE.BoxGeometry(1, 1, 1);
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.y = Math.PI * 0.25;
mesh.rotation.x = Math.PI * -0.125;
scene.add(mesh);
camera.position.z = 2;

renderer.render(scene, camera);

var bitmapData = new Uint8Array(width * height * 4);
gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);

new Jimp(width, height, (err: object, image: any) => {
    image.bitmap.data = bitmapData;
    image.getBuffer("image/png", (err: object, buffer: Uint8Array) => {
        fs.writeFileSync("./image.png", Buffer.from(buffer));
    });
});
