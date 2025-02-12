"use strict";

async function loadImages() {
  const $imageContainer = document.querySelector("#images");
  const imageNames = await getImageNames();
  const html = createImageHTML(imageNames);
  $imageContainer.innerHTML = "";
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
    return;
  };

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("http://localhost:1234/upload-image", {
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

function main() {
  loadImages();
  const $uploadForm = document.querySelector("#uploadForm");
  $uploadForm.addEventListener("submit", handleUpload);
};

main();
