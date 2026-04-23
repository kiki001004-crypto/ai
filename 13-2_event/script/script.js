// jquery사용시 준비사항
$(function () {
  // 버튼을 손모양으로 표시시켜줄때
  $("button").css({ cursor: "pointer" });
  // btn1를 클릭하면 .box1에 첫번째 박스 부드럽게 사라지기
  $("#btn1").click(function () {
    $(".box1 div:first-child").fadeOut(1000);
  });
  // btn2를 클릭하면 .box1에 첫번째 박스 부드럽게 보이기
  $("#btn2").click(function () {
    $(".box1 div:first-child").fadeIn(1000);
  });

  //   btn2를 클릭하면 .box1에 첫번째 박스 부드럽게 보이기/숨김
  $("#btn3").click(function () {
    $(".box1 div:last-child").fadeToggle();
  });

  //   btn4를 클릭하면 .box2에 첫번째 박스 요소의 높이:0
  $("#btn4").click(function () {
    $(".box2 div:first-child").slideUp();
  });
  //   btn5를 클릭하면 .box2에 첫번째 박스 높이:원래대로
  $("#btn5").click(function () {
    $(".box2 div:first-child").slideDown();
  });
  //   btn6를 클릭하면 .box2에 두번째 박스 높이0:원래대로
  $("#btn6").click(function () {
    $(".box2 div:nth-child(2)").slideToggle();
  });

  //   btn7를 클릭하면 .box2에 ani박스 오른쪽으로 이동
  $("#btn7").click(function () {
    $(".box2 .ani").animate({ left: "840px" });
  });
  //   btn8를 클릭하면 .box2에 ani박스 원래 위치로 이동
  $("#btn8").click(function () {
    $(".box2 .ani").animate({ left: "440px" });
  });

  //   btn9를 클릭하면 .box3에 첫번째박스 class .bg 추가
  $("#btn9").click(function () {
    $(".box3 div:first-child").addClass("bg");
  });
  //   btn10를 클릭하면 .box3에 첫번째박스 class .bg 제거
  $("#btn10").click(function () {
    $(".box3 div:first-child").removeClass("bg");
  });
});
