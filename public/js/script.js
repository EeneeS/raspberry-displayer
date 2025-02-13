"use strict";

import * as config from "./config.js";

async function loadImages() {
  const $imageContainer = document.querySelector("#images");
  $imageContainer.addEventListener("click", handleClickImage);

  const imageNames = await getImageNames();

  const html = createImageHTML(imageNames);

  $imageContainer.innerHTML = "";
  $imageContainer.insertAdjacentHTML("beforeend", html);
};

async function getImageNames() {
  const response = await fetch(`${config.HOST}:${config.PORT}/images`);
  const data = await response.json();
  return data;
};

function createImageHTML(imageNames) {
  let html = "";
  imageNames.forEach((name) => {
    html += `<li data-image-name="${name}"><img src="${config.HOST}:${config.PORT}/uploads/${name}"></li>`;
  });
  return html;
};

async function handleUpload(e) {
  e.preventDefault();

  const $fileInput = document.querySelector("#fileInput");
  const file = $fileInput.files[0];

  if (!file) {
    alert("Please select file to upload.");
    return;
  };

  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    alert("Invalid file type");
    $fileInput.value = "";
    return;
  };

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${config.HOST}:${config.PORT}/upload-image`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      alert("File uploaded successfully!");
      $fileInput.value = "";
      loadImages();
    } else {
      alert("Failed to upload file!");
    };
  } catch(error) {
    console.log(error);
    alert("Failed to upload file!");
  };
};

function handleClickImage(e) {
  const clickedElement = e.target.closest("li");
  if (clickedElement) {
    clickedElement.classList.toggle("selected");
  }
};

async function handleRemoveImages(e) {
  e.preventDefault();
  const imageNames = Array.from(document.querySelectorAll(".selected"))
                          .map(el => el.getAttribute("data-image-name"));
  if (confirm(`Are you sure you want to remove the selected images?`)) {
    const response = await fetch(`${config.HOST}:${config.PORT}/delete-images`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filenames: imageNames })
    }); 

    if (response.ok) {
      alert("Images removed successfully");
    };
    loadImages();
  }
};

function main() {
  loadImages();

  const $removeButton = document?.querySelector("#removeSelected");
  $removeButton.addEventListener("click", handleRemoveImages)

  const $uploadForm = document?.querySelector("#uploadForm");
  $uploadForm.addEventListener("submit", handleUpload);
};

main();
