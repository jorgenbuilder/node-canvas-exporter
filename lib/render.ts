import * as THREE from "three";
import Jimp from "jimp";
import fs from "fs";
import _gl from "gl";
import { JSDOM } from "jsdom";
import TestScene, { RenderRequest } from "../scenes/test/green-cube";

const args = process.argv;
const scenePath = args[2];

const { window } = new JSDOM();
(global as any).document = window.document;

export async function render(
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
): Promise<Buffer> {
    const gl = _gl(width, height, { premultipliedAlpha: true });
    const renderer = new THREE.WebGLRenderer({ context: gl, antialias: true });

    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.render(scene, camera);

    var bitmapData = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);

    return new Promise(
        (res) =>
            new Jimp(width, height, (err: object, image: any) => {
                image.bitmap.data = bitmapData;
                image.getBuffer(
                    "image/png",
                    (err: object, buffer: Uint8Array) => {
                        res(Buffer.from(buffer));
                    }
                );
            })
    );
}

export function save(data: Buffer, path: string) {
    fs.writeFileSync(path, data);
}

if (scenePath) {
    const Scene = require(`../${scenePath}`);
    try {
        render(...(Scene.default() as RenderRequest)).then((data) =>
            save(data, "./image.png")
        );
    } catch (e) {
        throw new Error(`Failed to render given scene! ${e}`);
    }
} else if (args) {
    render(...TestScene()).then((data) => save(data, "./image.png"));
}
