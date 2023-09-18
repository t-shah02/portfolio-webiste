const TECH_TAG_BG_COLORS = [
  "bg-red-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
];

function setupProjectTags() {
  const techTags = document.querySelectorAll(".tech-tag");
  if (techTags) {
    techTags.forEach((techTag) => {
      const actualTechTag = techTag as HTMLSpanElement;
      const randomBgColor =
        TECH_TAG_BG_COLORS[
          Math.floor(Math.random() * TECH_TAG_BG_COLORS.length)
        ];
      actualTechTag.classList.add(randomBgColor);
    });
  }
}

export default setupProjectTags;
