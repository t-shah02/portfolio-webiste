import "./style.css";
// @ts-ignore
import Typed from 'typed.js';

const CONSOLE_COMMANDS_AND_OUTPUT = [
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
    strings: CONSOLE_COMMANDS_AND_OUTPUT,
    typeSpeed: 50,
    backSpeed: 50,
    loop: true,
    smartBackspace: false,
});


const TECH_TAG_BG_COLORS = [
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500"
]
const techTags = document.querySelectorAll(".tech-tag");

if (techTags) {
    techTags.forEach(techTag => {
        const actualTechTag = (techTag) as HTMLSpanElement;
        const randomBgColor = TECH_TAG_BG_COLORS[Math.floor(Math.random() * TECH_TAG_BG_COLORS.length)];
        actualTechTag.classList.add(randomBgColor);
    })
}