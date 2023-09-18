// @ts-ignore
import Typed from "typed.js";

const CONSOLE_COMMANDS_AND_OUTPUT = [
  "cat hello_world.py",
  "print('Hello World')",
  "cat helloWorld.ts",
  "console.log('Hello World');",
  "cat HelloWorld.java",
  'System.out.println("Hello World");',
  "cat helloworld.go",
  'fmt.Println("Hello World") ',
];

const setupNavbarTyping = () =>
  new Typed("#prog-lang-heading", {
    strings: CONSOLE_COMMANDS_AND_OUTPUT,
    typeSpeed: 50,
    backSpeed: 50,
    loop: true,
    smartBackspace: false,
  });

export default setupNavbarTyping;
