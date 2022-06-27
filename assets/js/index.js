"use strict";
const root = document.getElementById("root");
const mapSocialClass = new Map();
mapSocialClass.set("www.facebook.com", "fa-facebook");
mapSocialClass.set("www.instagram.com", "fa-instagram");
mapSocialClass.set("twitter.com", "fa-twitter");

/**
 *
 * @param {string} tag
 * @param {object} options
 * @param {string[]} options.classNames
 * @param {objects} children
 * @returns
 */
function createElement(
  tag = "div",
  { classNames = [], attributes = {}, events = {} },
  ...children
) {
  const element = document.createElement(tag);
  if (classNames.length) {
    element.classList.add(...classNames);
  }
  for (const [nameAttr, valueAttr] of Object.entries(attributes)) {
    element.setAttribute(nameAttr, valueAttr);
  }
  for (const [typeEvent, handlerEvent] of Object.entries(events)) {
    element.addEventListener(typeEvent, handlerEvent);
  }
  element.append(...children);
  return element;
}

function createCard(actor) {
  const h2 = createElement(
    "h2",
    { classNames: ["card-fullname"] },
    document.createTextNode(fullName(actor) || "Noname")
  );
  return createElement(
    "article",
    { classNames: ["card-container"] },
    createWrapper(actor),
    h2,
    createWrapperLinks(actor)
  );
}

function createLink(element) {
  const url = new URL(element);
  const link = document.createElement("a");
  link.classList.add("fa-brands");
  link.classList.add(mapSocialClass.get(url.hostname));
  link.setAttribute("href", element);
  link.setAttribute("target", "_blank");
  return link;
}

function createWrapperLinks(actor) {
  const linkWrapper = document.createElement("div");
  linkWrapper.classList.add("card-photo-wrapper-link");

  const { contacts } = actor;
  contacts.forEach((element) => {
    linkWrapper.append(createLink(element));
  });

  return linkWrapper;
}

function createImage({ id, profilePicture, lastName }) {
  const img = document.createElement("img");
  img.classList.add("card-photo");
  img.setAttribute("src", profilePicture);
  img.setAttribute("alt", lastName);
  img.dataset.id = `wrapper-${id}`;
  img.addEventListener("error", photoErrorHandler);
  img.addEventListener("load", photoLoadHandler);
}

function createWrapper(actor) {
  const { id, lastName } = actor;
  const photoWrapper = document.createElement("div");
  photoWrapper.classList.add("card-photo-wrapper");
  photoWrapper.setAttribute("id", `wrapper-${id}`);

  const initials = document.createElement("div");
  initials.classList.add("card-initials");
  initials.style.backgroundColor = stringToColour(lastName);
  initials.append(document.createTextNode(lastName[0] || "NN")); /* home work */

  photoWrapper.append(initials);
  createImage(actor);
  return photoWrapper;
}

function photoLoadHandler({ target }) {
  const parent = document.getElementById(target.dataset.id);
  parent.append(target);
}

/* handler */
function photoErrorHandler({ target }) {
  target.remove();
  return;
}

function createErrorContent() {
  return createElement(
    "div",
    { classNames: ["error-content"] },
    document.createTextNode("Oops...a critical error has occurred")
  );
}

fetch("./data.json")
  .then((response) => response.json())
  .then((actors) => {
    const cards = actors.map((actor) => createCard(actor));
    root.append(...cards);
  })
  .catch((error) => {
    const span = createErrorContent();
    document.body.prepend(span);

    if (error instanceof TypeError) {
      console.error("Ошибка соединения: ", error);
    } else if (error instanceof SyntaxError) {
      console.error("Проверь запятые: ", error);
    } else {
      console.error(error);
    }
  });

/* utilits */
function stringToColour(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).slice(-2);
  }
  return colour;
}

function fullName(actor) {
  return `${actor.firstName} ${actor.lastName}`;
}

////////////////////////////КЛИК///////////////////////
const stateSet = new Set();
const state = [];
const clickChoosed = document.getElementById("clickChoosed");

document.addEventListener("click", (e) => {
  e.preventDefault();
  const nameActor =
    e.target.textContent === "NN "
      ? e.target.textContent
      : e.target.textContent.substring(1);
  if (!state.includes(nameActor)) {
    state.push(nameActor);
    clickChoosed.append(createList(nameActor));
  }
});

function createList(list) {
  return createElement(
    "li",
    { classNames: ["list-iteam"] },
    document.createTextNode(list)
  );
}
