"use strict";

import * as config from "./config.js";

const $imgContainer = document.querySelector("#currentImg");
let currentIndex = 0;

async function initSlideShow() {
  let imagesNames = await getImageNames();
  if (imagesNames.length === 0) return;
  
  $imgContainer.src = `${config.HOST}:${config.PORT}/uploads/${imagesNames[0]}`;
  startSlideshow(imagesNames);
};

function startSlideshow(imagesNames) {
  setInterval(async () => {
    currentIndex++;
    if (currentIndex >= imagesNames.length) {
      imagesNames = await getImageNames();
      shuffleImages(imagesNames);
      currentIndex = 0;
    }
    if (imagesNames.length > 0) {
      $imgContainer.src = `${config.HOST}:${config.PORT}/uploads/${imagesNames[currentIndex]}`;
    }
  }, 3500);
};

// Fisher-Yates shuffle :)
function shuffleImages(imageNames) {
  for (let i = imageNames.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = imageNames[i];
    imageNames[i] = imageNames[j];
    imageNames[j] = temp;
  }
};

async function getImageNames() {
  try {
    const response = await fetch(`${config.HOST}:${config.PORT}/images`);
    if (!response.ok) { 
      throw new Error("Failed to fetch images");
    };
    return await response.json();
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};

function main() {
  initSlideShow();
};

main();
