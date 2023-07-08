document.querySelector("button").addEventListener("click", clearErrors);
document.querySelector(".icon-power").parentElement.addEventListener("click", logOut);
const hearts = document.getElementsByClassName("fa-heart-o");

Array.from(hearts).forEach((x) => x.addEventListener("click", likeSuggestion));

function clearErrors() {
  document.getElementsByClassName("alert-message-ul").remove();
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

function likeSuggestion(click) {
  const data = click.target.parentNode.dataset;
  document.querySelector(data).element.classList.add("mystyle");
}
