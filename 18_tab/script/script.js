$(function () {
  // tab 메뉴를 클릭하면 해당번째에 on클래스 추가
  $(".tab li").click(function () {
    // this->클릭한걸 갖고있는데, 그걸 나한테 알려주는 함수(index)
    let num = $(this).index();
    console.log(num);

    //   기존에 on class삭제
    $(".tab li").removeClass("on");
    $(this).addClass("on");
    //   기존에 list_wrap 숨김
    $(".list_wrap").hide();
    $(".list_wrap").eq(num).show();
  });
});
