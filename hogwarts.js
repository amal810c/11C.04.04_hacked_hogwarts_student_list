"use strict";

window.addEventListener("DOMContentLoaded", initPage);

let json;
const link = "https://petlatkea.dk/2021/hogwarts/students.json";
const allStudents = [];
let temp = document.querySelector("template");
let container = document.querySelector("section");

function initPage() {
  console.log("ready");

  fetchStudentData();
}

async function fetchStudentData() {
  const respons = await fetch(link);
  json = await respons.json();
  //addEventListenerToButtons();
  prepareObjects(json);
}

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    // TODO: Create new object with cleaned data - and store that in the allAnimals array

    //Create new object
    const studentTemplate = {
      firstname: "-not set yet-",
      lastname: "-not set yet-",
      middlename: "-not set yet-",
      nickname: "-not set yet-",
      photo: "-not set yet-",
      house: "-not set yet-",
    };
    // TODO: MISSING CODE HERE !!!

    const fullname = jsonObject.fullname.trim();

    //Split "fullname" into smaller parts after each space. So we get name, type, description and age
    const fullName = jsonObject.fullname.toLowerCase().trim();
    const splitFullName = fullName.split(" ");
    const house = jsonObject.house.toLowerCase().trim();

    const firstSpaceBeforeName = fullName.indexOf(" ");
    const lastSpaceBeforeName = fullName.lastIndexOf(" ");

    const firstQuotationMark = fullName.indexOf('"');
    const lastQuotationMark = fullName.indexOf('"');

    let lastName = "";
    let indexhyphen = 0;
    let firstLetterAfterHyphen = "";
    let smallLettersAfterHyphen = "";

    //Create the new object from the empty object template
    const student = Object.create(studentTemplate);

    //Insert value/string/substring into place
    //Firstname inserts in index 0
    let firstName =
      splitFullName[0].substring(0, 1).toUpperCase() +
      splitFullName[0].substring(1);

    student.firstname = firstName;

    if (splitFullName.length > 1) {
      //Lastname inserts in at lastIndexOf
      lastName =
        splitFullName[splitFullName.length - 1].substring(0, 1).toUpperCase() +
        splitFullName[splitFullName.length - 1].substring(1);

      //Check for a hyphen in the lastnames
      indexhyphen = lastName.indexOf("-");
      if (indexhyphen != -1) {
        const nameBeforeHyphen = lastName.substring(0, indexhyphen + 1);
        firstLetterAfterHyphen = lastName
          .substring(indexhyphen + 1, indexhyphen + 2)
          .toUpperCase();
        smallLettersAfterHyphen = lastName.substring(indexhyphen + 2);
        lastName =
          nameBeforeHyphen + firstLetterAfterHyphen + smallLettersAfterHyphen;
      }

      student.lastname = lastName;

      //Middlename inserts in index 2
      let middlename = "";
      let nickname = null;
      if (splitFullName.length > 2) {
        if (splitFullName[1].indexOf('"') >= 0) {
          nickname = splitFullName[1].replaceAll('"', "");

          nickname =
            nickname.substring(0, 1).toUpperCase() + nickname.substring(1);
          middlename = null;
        } else {
          middlename =
            splitFullName[1].substring(0, 1).toUpperCase() +
            splitFullName[1].substring(1);
          nickname = null;
        }
      } else {
        middlename = null;
      }

      student.middlename = middlename;
      student.nickname = nickname;

      //console.log(middlename);
      //console.log(nickname);
    } else {
      student.lastname = null;
      student.middlename = null;
      student.nickname = null;
    }

    //Photo
    if (student.lastname != null) {
      if (indexhyphen == -1) {
        if (student.firstname == "Padma" || student.firstname == "Parvati") {
          student.photo =
            lastName.toLowerCase() +
            "_" +
            firstName.substring(0).toLowerCase() +
            ".png";
        } else {
          student.photo =
            lastName.toLowerCase() +
            "_" +
            firstName.substring(0, 1).toLowerCase() +
            ".png";
        }
      } else {
        student.photo =
          firstLetterAfterHyphen.toLocaleLowerCase() +
          smallLettersAfterHyphen +
          "_" +
          firstName.substring(0, 1).toLowerCase() +
          ".png";
      }
    } else {
      student.photo = null;
    }

    //House is already a seperate string so just adds the age to the object
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);

    //Adds all objects (students) into the array
    allStudents.push(student);
  });
  showStudentList(allStudents);
}

function showStudentList(students) {
  console.log(students);
  container.innerHTML = "";
  students.forEach((student) => {
    // if (filter == "alle" || filter == mad.gsx$kategori.$t) {
    const klon = temp.cloneNode(true).content;
    if (student.lastname == null) {
      klon.querySelector(".fullname").textContent = student.firstname;
    } else {
      klon.querySelector(".fullname").textContent =
        student.firstname + " " + student.lastname;
    }
    if (student.photo != null) {
      klon.querySelector("img").src = "images/" + student.photo;
    }
    klon
      .querySelector("article")
      .addEventListener("click", () => openSingleStudent(student));

    container.appendChild(klon);
    //}
  });
}

function openSingleStudent(student) {
  popup.style.display = "block";
  if (student.middlename == null && student.nickname == null) {
    if (student.lastname == null) {
      popup.querySelector("h2").textContent = student.firstname;
    } else {
      popup.querySelector("h2").textContent =
        student.firstname + " " + student.lastname;
    }
  } else if (student.middlename != null) {
    popup.querySelector("h2").textContent =
      student.firstname + " " + student.middlename + " " + student.lastname;
  } else if (student.nickname != null) {
    popup.querySelector("h2").textContent =
      student.firstname +
      " " +
      '"' +
      student.nickname +
      '"' +
      " " +
      student.lastname;
  }
  //popup.querySelector(".blodstatus").textContent = student.house;
  popup.querySelector(".house").textContent = student.house;
  //popup.querySelector(".house_crest").src = ;
  if (student.photo != null) {
    popup.querySelector("img").src = "images/" + student.photo;
  } /* else {
    popup.querySelector("img").src = null;
  } */

  document
    .querySelector("#close")
    .addEventListener("click", () => (popup.style.display = "none"));
}
