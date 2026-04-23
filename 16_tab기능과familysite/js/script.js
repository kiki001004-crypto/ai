// 준비작업()바이딩 작업)
$(function () {
  //list box 숨김
  $("footer .inner .family .list").hide();
  // button을 클릭하면  .list박스를 보이고/숨김
  $("button").click(function () {
    $(".list").slideToggle();
  });
});
