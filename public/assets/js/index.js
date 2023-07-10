document.querySelector("button").addEventListener("click", clearErrors);
document.querySelector(".icon-power").parentElement.addEventListener("click", logOut);
const errors = document.getElementsByClassName("alert-message-ul");
const hearts = document.getElementsByClassName("fa-heart-o");

Array.from(hearts).forEach((x) => x.addEventListener("click", likeSuggestion));

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
  const data = { title: parent.innerText, description: parent.nextElementSibling.innerText };
  console.log(data);
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
