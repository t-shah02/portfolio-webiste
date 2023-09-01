import "./style.css";
// @ts-ignore
import Typed from 'typed.js';

const consoleCommandsAndOutputs = [
    "cat hello_world.py",
    "print('Hello World')",
    "cat helloWorld.ts",
    "console.log('Hello World');",
    "cat HelloWorld.java",
    'System.out.println("Hello World");',
    "cat helloworld.go",
    'fmt.Println("Hello World") '
];

new Typed('#prog-lang-heading', {
    strings: consoleCommandsAndOutputs,
    typeSpeed: 50,
    backSpeed: 50,
    loop: true,
    smartBackspace: false,
});