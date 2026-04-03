const scriptURL =
  "https://script.google.com/macros/s/AKfycbxm60yFJOua1FJHsEGE0T2XO5RIkmesFlB89YNi5IFHV5ApIdVFAe-0EWx_EYTFLzBYBQ/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      msg.innerHTML = "Message sent successfully";
      setTimeout(function () {
        msg.innerHTML = "";
      }, 5000);
      form.reset();
    })
    .catch((error) => console.error("Error!", error.message));
});
