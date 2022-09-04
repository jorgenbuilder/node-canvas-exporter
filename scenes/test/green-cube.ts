import * as THREE from "three";

export type RenderRequest = [THREE.Scene, THREE.Camera, number, number];

export default function (): RenderRequest {
    const width = 600;
    const height = 400;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

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
    return [scene, camera, width, height];
}
