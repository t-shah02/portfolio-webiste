

setInterval(() => {
    const r = Math.floor(Math.random() * 255) + 1;
    const g = Math.floor(Math.random() * 255) + 1;
    const b = Math.floor(Math.random() * 255) + 1;
    const colorString = `rgb(${r}, ${g}, ${b})`;

    document.body.style.backgroundColor = colorString;
}, 1500);

let clickedImageOnce = false;
const headSmashImage = document.querySelector("#head-smash-img");
headSmashImage.addEventListener("click", () => {
    clickedImageOnce = true;
})

const emiliaRapGodAudio = document.querySelector("#emilia-rap-god-audio");
document.addEventListener("mousemove", () => {
    if (clickedImageOnce) {
        emiliaRapGodAudio.play();
    }
});