let btn1 = document.getElementById("btn1");
console.log(btn1);
let fadebox = document.getElementById("fadebox");
console.log(fadebox);

// btn1를 클릭하면 fadebox를 부드럽게 사라지게
btn1.addEventListener("click", function () {
  fadebox.style.transition = "all 1s";
  fadebox.style.opacity = 0;
  //   공간을 차지 하지 않음
  fadebox.style.visibility = "visible";
});

let btn2 = document.getElementById("btn2");
console.log(btn2);
// btn2를 클릭하면 fadebox를 부드럽게 보이기
btn2.addEventListener("click", function () {
  fadebox.style.transition = "all 1s";
  fadebox.style.opacity = 1;
});

// btn3을 클릭하면 .fadetogglebox 보이고 / 숨김
let btn3 = document.getElementById("btn3");
let fadetogglebox = document.getElementById("fadetogglebox");
btn3.addEventListener("click", function () {
  fadetogglebox.classList.toggle("fade-hidden");
});

// btn4를 클릭하면 box2에 있는 높이0
let btn4 = document.getElementById("btn4");
let upbox = document.getElementById("up");
btn4.addEventListener("click", function () {
  upbox.classList.add("slide-hidden");
});

let btn5 = document.getElementById("btn5");
btn5.addEventListener("click", function () {
  upbox.classList.remove("slide-hidden");
});

let btn6 = document.getElementById("btn6");
let slidetgbox = document.getElementById("slidetogglebox");
btn6.addEventListener("click", function () {
  slidetgbox.classList.toggle("slide-hidden");
});

let btn7 = document.getElementById("btn7");
let anibox = document.getElementById("anim");

btn7.addEventListener("click", function () {
  anibox.classList.add("ani-move");
});

let btn8 = document.getElementById("btn8");
btn8.addEventListener("click", function () {
  anibox.classList.remove("ani-move");
});
