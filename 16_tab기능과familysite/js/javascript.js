let btn = document.getElementById("btn");
let listbox = document.getElementById("listbox");

btn.addEventListener("click", function () {
  listbox.classList.toggle("on");
  //   css에서 on을 만든다음 classlist에 넣는다
});
