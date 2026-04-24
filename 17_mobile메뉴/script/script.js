$(function () {
  // 햄버거버튼을 클릭하면
  // 모바일 메뉴가 오른쪽에서 왼쪽으로 애니메이션
  $("button").click(function () {
    $(".cover").fadeIn(300);
    $(".mobile-menu").animate({ right: 0 }, 300);
  });

  //   x버튼을 클릭하면 모바일 메뉴를 오른쪽 브라우저 바깥으로 보낸다(-280px)
  $(".close-btn").click(function () {
    $(".mobile-menu").animate({ right: "-100%" }, 300);
    $(".cover").fadeOut(300);
  });
});
