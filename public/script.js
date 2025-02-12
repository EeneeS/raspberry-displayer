"use strict";

async function loadImages() {
  const $imageContainer = document.querySelector("#images");
  const imageNames = await getImageNames();
  const html = createImageHTML(imageNames);
  $imageContainer.insertAdjacentHTML("beforeend", html);
};

async function getImageNames() {
  const response = await fetch("http://localhost:1234/images");
  const data = await response.json();
  return data;
};

function createImageHTML(imageNames) {
  let html = "";
  imageNames.forEach((name) => {
    html += `<li><img src="http://localhost:1234/uploads/${name}"></li>`;
  });
  return html;
}

function main() {
  loadImages();
};

main();
