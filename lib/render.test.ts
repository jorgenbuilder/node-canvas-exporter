import fs from "fs";
import { render, save } from "./render";
import TestScene1 from "../scenes/test/green-cube";
import TestScene2 from "../scenes/test/blue-cube";

test("render test scene #1", async () => {
    const data = await render(...TestScene1());
    save(data, "./test.png");
    expect(fs.readFileSync("./test.png")).toBeDefined();
    fs.rmSync("./test.png");
});

test("render test scene #2", async () => {
    const data = await render(...TestScene2());
    save(data, "./test.png");
    expect(fs.readFileSync("./test.png")).toBeDefined();
    fs.rmSync("./test.png");
});
