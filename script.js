let fileHandle;
let fileData;
let text;
let jsonData;
var saved = false;
const list = document.querySelector(".list");
const rowlist = document.querySelector(".rowlist");
const kategorier_input = document.getElementById("kategorier_input");
const kategorierID = document.querySelector("#kategorier");

const processedParams = []; // use later to check that kategorier only gets create one time

printMyToDos();

async function button() {
  [fileHandle] = await window.showOpenFilePicker(); // lets us pick file it is
  fileData = await fileHandle.getFile(); // returns the contents of the selected file
  text = await fileData.text(); // return it as a string
  // jsonData = JSON.parse(text); // selt
  await localforage.setItem("myKey", fileHandle);
  console.log(fileHandle);
  localStorage.setItem("fileData", text);
  saved = true;
  window.location.reload();
}

function printMyToDos() {
  if (localStorage.getItem("fileData")) {
    jsonData = JSON.parse(localStorage.getItem("fileData"));
  }

  // create span tasks
  jsonData.forEach((element) => {
    if (!processedParams.includes(element.task.kategorier)) {
      // Only run the loop if the parameter has not been processed before
      processedParams.push(element.task.kategorier);

      // Your code here
      console.log(`Processing items with parameter ${element.task.kategorier}`);
      var list1 = document.createElement("div");
      var headline = document.createElement("h3");
      headline.innerHTML = element.task.kategorier;
      list1.classList.add("col-md-4");
      list1.classList.add("col-12");
      list1.classList.add("list");
      list1.classList.add("gx-5");
      list1.classList.add("gy-5");
      list1.setAttribute("id", `${element.task.kategorier}`);
      list1.appendChild(headline);
      rowlist.append(list1);
      var option = document.createElement("option");
      option.innerHTML = element.task.kategorier;
      kategorierID.appendChild(option);
    }

    var divtask = document.createElement("div");
    divtask.classList.add("divtask");
    document.getElementById(`${element.task.kategorier}`).appendChild(divtask);

    console.log(element.task.name);
    var span = document.createElement("SPAN");
    span.innerHTML = element.task.name;
    divtask.appendChild(span);

    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-danger");
    divtask.appendChild(deleteButton);

    if (element.task.completed === true) {
      span.style.textDecoration = "line-through";
    } else if (element.task.completed === false) {
      span.style.textDecoration = "";
    }

    span.addEventListener("click", function () {
      if (element.task.completed === false) {
        element.task.completed = true;
        console.log(element);
        localStorage.setItem("fileData", JSON.stringify(jsonData));
        span.style.textDecoration = "line-through";
      } else if (element.task.completed === true) {
        element.task.completed = false;
        span.style.textDecoration = "";
        console.log(element);
        localStorage.setItem("fileData", JSON.stringify(jsonData));
      }
    });

    deleteButton.addEventListener("click", function () {
      const index = jsonData.indexOf(element);
      const x = jsonData.splice(index, 1);
      span.parentNode.removeChild(span);
      this.remove(deleteButton);
      localStorage.setItem("fileData", JSON.stringify(jsonData));
      console.log(element);
      console.log(jsonData);
    });
  });
}

function Add() {
  const task = document.getElementById("task");
  const kategorier = document.getElementById("kategorier");
  jsonData.push({
    task: { name: task.value, completed: false, kategorier: kategorier.value },
  });
  localStorage.setItem("fileData", JSON.stringify(jsonData));
  console.log(jsonData);
  location.href = location.href;
}

function Addkategorier() {
  var option = document.createElement("option");
  option.innerHTML = kategorier_input.value;
  kategorierID.appendChild(option);
  kategorier_input.value = "";
}

async function save(event) {
  const fileHandle = await localforage.getItem("myKey");
  jsonData = JSON.parse(localStorage.getItem("fileData"));

  console.log(jsonData);
  const save = JSON.stringify(jsonData);
  const stream = await fileHandle.createWritable();
  await stream.write(save);
  await stream.close();
}

async function saveAs() {
  fileHandle = await window.showSaveFilePicker();
  save();
}
