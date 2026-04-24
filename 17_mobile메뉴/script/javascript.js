//햄버거 버튼을 클릭하면 모바일 메뉴가
// 오른쪽에서 나오게함

let btn = document.getElementById("btn");
let mobileMenu = document.getElementById("mobileMenu");
let cover = document.getElementById("cover");
let closeBtn = document.getElementById("close-btn");
console.log(btn, cover, closeBtn);
console.log(mobileMenu);
//햄버거 버튼을 클릭하면 모바일 메뉴가
// 오른쪽에서 나오게함
btn.addEventListener("click", function () {
  mobileMenu.classList.add("on");
  cover.classList.add("on");
});

// 모바일 메뉴에 x버튼을 클릭하면 모바일 메뉴가 브라우저 밖으로 나감
closeBtn.addEventListener("click", function () {
  mobileMenu.classList.remove("on");
});
