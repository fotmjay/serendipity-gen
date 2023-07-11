const errorClear = document.querySelector("button");
document.querySelector(".icon-power").parentElement.addEventListener("click", logOut);
const errors = document.getElementsByClassName("alert-message-ul");
const hearts = document.getElementsByClassName("fa-heart-o");
const trashcans = document.getElementsByClassName("fa-trash");

if (errorClear) {
  errorClear.addEventListener("click", clearErrors);
}

Array.from(hearts).forEach((x) => x.addEventListener("click", likeSuggestion));
Array.from(trashcans).forEach((x) => x.addEventListener("click", deleteSuggestion));

function clearErrors() {
  if (errors) {
    Array.from(errors).forEach((x) => x.remove());
  }
}

async function logOut() {
  try {
    const response = await fetch("/logMeOut", { method: "POST" });
    const data = await response.json();
    console.log(data);
    window.location.href = "/";
  } catch (err) {
    console.log(err);
  }
}

async function likeSuggestion(click) {
  const parent = click.target.parentNode;
  parent.parentNode.classList.toggle("likeSuggestion");
  parent.children[0].classList.toggle("fa-heart-o");
  parent.children[0].classList.toggle("fa-heart");
  parent.children[0].removeEventListener("click", likeSuggestion);
  const data = { title: parent.innerText.slice(1), description: parent.nextElementSibling.innerText };
  try {
    const response = await fetch("/saveSuggestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}

async function deleteSuggestion(click) {
  const id = click.target.parentNode.parentNode.dataset.id;
  try {
    const response = await fetch("/deleteSugg", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        objectId: id,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
