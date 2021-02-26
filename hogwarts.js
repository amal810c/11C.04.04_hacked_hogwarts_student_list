"use strict";

window.addEventListener("DOMContentLoaded", initPage);

let json;
let bloodstatus;
const link = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodstatuslink = "https://petlatkea.dk/2021/hogwarts/families.json";
const allStudents = [];
let expelledStudents = [];
let selectedStudent;
let temp = document.querySelector("template");
let container = document.querySelector("section");
let filterType = "all";
let sortBy = "sorting";
const search = document.querySelector(".search");
search.addEventListener("input", searchStudent);
let systemIsHacked = false;

const studentTemplate = {
  firstname: "-not set yet-",
  lastname: "-not set yet-",
  middlename: "-not set yet-",
  nickname: "-not set yet-",
  photo: "-not set yet-",
  house: "-not set yet-",
  gender: "",
  prefect: false,
  expelled: false,
  bloodstatus: "",
  squad: false,
};

function initPage() {
  console.log("ready");

  document.querySelector("#hack").addEventListener("click", hackTheSystem);

  readBtns();
  fetchStudentData();
}

function searchStudent(event) {
  let searchList = allStudents.filter((student) => {
    let searchname = "";
    if (student.lastname === null) {
      searchname = student.firstname;
    } else {
      searchname = student.firstname + " " + student.lastname;
    }
    return searchname.toLowerCase().includes(event.target.value);
  });

  showStudentList(searchList);
}

function readBtns() {
  //adds an eventlistener to each filterbutton
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectedFilter));

  //looks after changes in the options under #sortingList
  document.querySelector("#sortingList").onchange = function () {
    selectedSort(this.value);
  };
}

function selectedFilter(event) {
  //reads witch button is clicked
  const filter = event.target.dataset.filter;
  console.log(`Use this ${filter}`);
  //filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  filterType = filter;
  buildList();
}

function filterList(filterredList) {
  //adds the selected students to filteredList
  //let filteredList = allStudents;
  if (filterType === "gryffindor") {
    filterredList = allStudents.filter(isGryffindor);
  } else if (filterType === "hufflepuff") {
    filterredList = allStudents.filter(isHufflepuff);
  } else if (filterType === "ravenclaw") {
    filterredList = allStudents.filter(isRavenclaw);
  } else if (filterType === "slytherin") {
    filterredList = allStudents.filter(isSlytherin);
  } else if (filterType === "expelled") {
    filterredList = expelledStudents;
  }
  //TODO: filter on expelled and unexpelled

  // console.log(filterredList);
  return filterredList;
}

function isGryffindor(house) {
  //rerutns true if a students house is Gryffindor
  return house.house === "Gryffindor";
}

function isHufflepuff(house) {
  //rerutns true if a students house is Hufflepuff
  return house.house === "Hufflepuff";
}

function isRavenclaw(house) {
  //rerutns true if a students house is Ravenclaw
  return house.house === "Ravenclaw";
}

function isSlytherin(house) {
  //rerutns true if a students house is Slytherin
  return house.house === "Slytherin";
}

function selectedSort(event) {
  //checks what option is clicked
  sortBy = event;
  console.log(`Use this ${sortBy}`);
  //sortList(sortBy);
  buildList();
}

function sortList(sortedList) {
  //based on what is clicked, calls the matching function
  //let sortedList = allStudents;

  if (sortBy === "firstnamea-z") {
    sortedList = sortedList.sort(sortByFirstnameAZ);
  } else if (sortBy === "firstnamez-a") {
    sortedList = sortedList.sort(sortByFirstnameZA);
  } else if (sortBy === "lastnamea-z") {
    sortedList = sortedList.sort(sortByLastnameAZ);
  } else if (sortBy === "lastnamez-a") {
    sortedList = sortedList.sort(sortByLastnameZA);
  } else if (sortBy === "housea-z") {
    sortedList = sortedList.sort(sortByHouseAZ);
  } else if (sortBy === "housez-a") {
    sortedList = sortedList.sort(sortByHouseZA);
  }

  return sortedList;
}

//sorts by firstname a-z
function sortByFirstnameAZ(firstnameA, firstnameB) {
  if (firstnameA.firstname < firstnameB.firstname) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by firstname z-a
function sortByFirstnameZA(firstnameA, firstnameB) {
  if (firstnameA.firstname < firstnameB.firstname) {
    return 1;
  } else {
    return -1;
  }
}

//sorts by lastname a-z
function sortByLastnameAZ(lastnameA, lastnameB) {
  if (lastnameA.lastname < lastnameB.lastname) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by lastname z-a
function sortByLastnameZA(lastnameA, lastnameB) {
  if (lastnameA.lastname < lastnameB.lastname) {
    return 1;
  } else {
    return -1;
  }
}

//sorts by house a-z
function sortByHouseAZ(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by house z-a
function sortByHouseZA(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return 1;
  } else {
    return -1;
  }
}

function buildList() {
  let currentList = filterList(allStudents);
  currentList = sortList(currentList);

  showStudentList(currentList);
}

async function fetchStudentData() {
  const respons = await fetch(link);
  json = await respons.json();
  const respons1 = await fetch(bloodstatuslink);
  bloodstatus = await respons1.json();
  prepareObjects(json);
}

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
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

    //gender
    student.gender = jsonObject.gender;
    student.prefect = false;

    //bloodstatus

    student.bloodstatus = matchBloodstatusWithStudentName(student);

    //Adds all objects (students) into the array
    allStudents.push(student);
  });
  showStudentList(allStudents);
}

function matchBloodstatusWithStudentName(student) {
  if (bloodstatus.half.indexOf(student.lastname) != -1) {
    return "Half-blood";
  } else if (bloodstatus.pure.indexOf(student.lastname) != -1) {
    return "Pure-blood";
  } else {
    return "Muggle-born";
  }
}

function showStudentList(students) {
  //showing the number of students showed on the list
  if (students.length === 1) {
    document.querySelector("#showedStudents").textContent =
      "Now showing " + students.length + " students";
  } else {
    document.querySelector("#showedStudents").textContent =
      "Now showing " + students.length + " students";
  }
  //template clone for each student in the list
  container.innerHTML = "";
  students.forEach((student) => {
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

    //adding house color to the right students
    klon.querySelector("article").classList = "";
    if (student.house === "Slytherin") {
      klon.querySelector("article").classList.add("Slytherin");
    } else if (student.house === "Ravenclaw") {
      klon.querySelector("article").classList.add("Ravenclaw");
    } else if (student.house === "Hufflepuff") {
      klon.querySelector("article").classList.add("Hufflepuff");
    } else if (student.house === "Gryffindor") {
      klon.querySelector("article").classList.add("Gryffindor");
    }

    container.appendChild(klon);
  });
}

function openSingleStudent(student) {
  popup.style.display = "block";

  if (student.expelled != true) {
    document.querySelector("#expellbtn").classList.remove("clickedbutton");
  } else {
    document.querySelector("#expellbtn").classList.add("clickedbutton");
  }

  if (student.prefect != true) {
    document.querySelector("#prefectbtn").classList.remove("clickedbutton");
  } else {
    document.querySelector("#prefectbtn").classList.add("clickedbutton");
  }

  if (student.squad != true) {
    document.querySelector("#isbtn").classList.remove("clickedbutton");
  } else {
    document.querySelector("#isbtn").classList.add("clickedbutton");
  }

  //adding house color to the right students
  popup.querySelector("article").classList = "";
  if (student.house === "Slytherin") {
    popup.querySelector("article").classList.add("Slytherin");
  } else if (student.house === "Ravenclaw") {
    popup.querySelector("article").classList.add("Ravenclaw");
  } else if (student.house === "Hufflepuff") {
    popup.querySelector("article").classList.add("Hufflepuff");
  } else if (student.house === "Gryffindor") {
    popup.querySelector("article").classList.add("Gryffindor");
  }

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
  popup.querySelector(".blodstatus").textContent = student.bloodstatus;
  popup.querySelector(".house").textContent = student.house;
  popup.querySelector("#house_crest").src =
    "housecrests/" + student.house + ".png";
  if (student.photo != null) {
    popup.querySelector("#popup_student_pic").src = "images/" + student.photo;
  } else {
    popup.querySelector("#popup_student_pic").src = "";
  }

  //expell, prefect and squad
  document.querySelector("#expellbtn").addEventListener("click", expell);

  document
    .querySelector("#prefectbtn")
    .addEventListener("click", togglePrefect);

  document.querySelector("#isbtn").addEventListener("click", toggleSquad);

  document.querySelector("#close").addEventListener("click", () => {
    popup.style.display = "none";
    document.querySelector("#expellbtn").removeEventListener("click", () => {});
    document
      .querySelector("#prefectbtn")
      .removeEventListener("click", () => {});
    document.querySelector("#isbtn").removeEventListener("click", () => {});
  });

  selectedStudent = student;
}

function expell() {
  if (selectedStudent.lastname != "Grøn") {
    //removes expelled student form allStudents list
    if (selectedStudent.expelled === false) {
      allStudents.splice(allStudents.indexOf(selectedStudent), 1);
      selectedStudent.expelled = true;
      selectedStudent.prefect = false;
      selectedStudent.squad = false;
      expelledStudents.push(selectedStudent);
      document.querySelector("#expellbtn").classList.add("clickedbutton");
      document.querySelector("#prefectbtn").classList.remove("clickedbutton");
      document.querySelector("#isbtn").classList.remove("clickedbutton");
      console.log("expell");
    } else {
      alert("This student is allready expelled!");
      console.log("This student is allready expelled");
    }
  } else {
    alert(
      `Sorry bro! Can't expell ${selectedStudent.firstname} "${selectedStudent.nickname}" ${selectedStudent.lastname}! 😝`
    );
  }

  buildList();
}

function togglePrefect() {
  console.log("toggle prefect");
  if (selectedStudent.expelled === false) {
    const index = allStudents.indexOf(selectedStudent);
    if (selectedStudent.prefect === false) {
      housePrefectCheck();
    } else {
      removePrefect(selectedStudent);
    }
  } else {
    alert("This student is expelled! An expelled students can't be a Prefect!");
  }

  function housePrefectCheck() {
    console.log("chekking for house prefects");
    const houseprefects = [];
    allStudents.filter((student) => {
      if (student.house === selectedStudent.house && student.prefect === true) {
        houseprefects.push(student);
      }
    });
    console.log("prefect house: " + houseprefects.length);
    const numberOfPrefects = houseprefects.length;
    const other = [];
    houseprefects.filter((student) => {
      if (student.gender === selectedStudent.gender) {
        other.push(student);
      }
    });
    console.log("other: " + other.length);
    //if there is another of the same type
    if (other.length >= 1) {
      removeOther(other[0]);
    } else {
      // allStudents[index].prefect = true;
      console.log("add prefect");
      makePrefect(selectedStudent);
    }
  }

  function removePrefect(studentPrefect) {
    document.querySelector("#prefectbtn").classList.remove("clickedbutton");
    const index = allStudents.indexOf(studentPrefect);
    allStudents[index].prefect = false;
  }

  function makePrefect(studentPrefect) {
    document.querySelector("#prefectbtn").classList.add("clickedbutton");
    const index = allStudents.indexOf(studentPrefect);
    allStudents[index].prefect = true;
  }

  function removeOther(other) {
    //ask the user to ignore ore remove the other
    document.querySelector("#onlytwoprefects").classList.remove("hide");
    document
      .querySelector("#onlytwoprefects .closebutton")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#onlytwoprefects [data-action=remove1]")
      .addEventListener("click", clickRemoveOther);

    //add name to button
    document.querySelector("#onlytwoprefects .prefect1").textContent =
      other.firstname;

    //if ignore - do nothing..
    function closeDialog() {
      document.querySelector("#onlytwoprefects").classList.add("hide");
      document
        .querySelector("#onlytwoprefects .closebutton")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#onlytwoprefects [data-action=remove1]")
        .removeEventListener("click", clickRemoveOther);
    }

    //if remove other:
    function clickRemoveOther() {
      removePrefect(other);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }
}

function toggleSquad() {
  console.log("toggle squad");
  const index = allStudents.indexOf(selectedStudent);
  if (selectedStudent.expelled === false) {
    if (selectedStudent.squad === false) {
      houseSquadCheck();
    } else {
      removeSquad();
    }
  } else {
    alert(
      "This student is expelled! An expelled students can't be a part of the Inquisitorial Squad!"
    );
  }

  function houseSquadCheck() {
    console.log("chekking for house squads");
    if (
      selectedStudent.bloodstatus === "Pure-blood" &&
      selectedStudent.house === "Slytherin"
    ) {
      makeSquad();
    } else {
      alert(
        "Only pure-blooded students from Slytherin can join the Inquisitorial Squad! 🐍"
      );
    }
  }

  function makeSquad() {
    if (systemIsHacked === true) {
      setTimeout(function () {
        toggleSquad();
      }, 1000);
    }
    allStudents[index].squad = true;
    document.querySelector("#isbtn").classList.add("clickedbutton");
  }

  function removeSquad() {
    document.querySelector("#isbtn").classList.remove("clickedbutton");
    if (systemIsHacked === true) {
      setTimeout(function () {
        alert("Wuups.. Can't do that.. HA HA HA!");
      }, 100);
      //alert("Wuups.. Can't do that.. HA HA HA!");
    }
    allStudents[index].squad = false;
  }
}

function hackTheSystem() {
  if (systemIsHacked === false) {
    //add me to studentlist
    console.log("You have been hacked!");
    const thisIsMe = Object.create(studentTemplate);
    thisIsMe.firstname = "Amalie";
    thisIsMe.lastname = "Grøn";
    thisIsMe.middlename = null;
    thisIsMe.nickname = "The Hacker";
    thisIsMe.photo = "me.png";
    thisIsMe.house = "Hufflepuff";
    thisIsMe.gender = "girl";
    thisIsMe.prefect = false;
    thisIsMe.expelled = false;
    thisIsMe.bloodstatus = "Pure-blood";
    thisIsMe.squad = false;
    messWithBloodstatus();
    allStudents.unshift(thisIsMe);

    //fuck up blood-status
    systemIsHacked = true;

    buildList();
    setTimeout(function () {
      alert("The Dark Lord is back, you have been hacked!!! ☠ ☠ ☠");
    }, 100);
  } else {
    alert("Wuups.. System's allready been hacked!");
  }
}

function messWithBloodstatus() {
  allStudents.forEach((student) => {
    if (student.bloodstatus === "Muggle-born") {
      student.bloodstatus = "Pure-blood";
    } else if (student.bloodstatus === "Half-blood") {
      student.bloodstatus = "Pure-blood";
    } else {
      let bloodNumber = Math.floor(Math.random() * 3);
      if (bloodNumber === 0) {
        student.bloodstatus = "Muggle-born";
      } else if (bloodNumber === 1) {
        student.bloodstatus = "Half-blood";
      } else {
        student.bloodstatus = "Pure-blood";
      }
    }
  });
}
