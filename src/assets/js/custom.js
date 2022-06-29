$(function(){




  var url = window.location.pathname,
      urlRegExp = new RegExp(url.replace(/\/$/,'') + "$");
      console.log(urlRegExp);
      // now grab every link from the navigation
      $('.list li .ml-menu a').each(function(){
          // and test its normalized href against the url pathname regexp
          if(urlRegExp.test(this.href.replace(/\/$/,''))){
              $(this).addClass('active').parent().parent().css("display","block").parent('li.su-access').find('.menu-toggle').addClass('toggled');
              //$(this).addClass('active').parent().parent().css("display","block").parent('li.su-access').addClass('active');
          }
      });

});



$(document).on("click",".cancel-form",function(){
		$(".form")[0].reset();
		if($(".dropzone").length > 0){
			$(".dropzone .dz-preview").remove();
			$(".dropzone").removeClass("dz-started");
			$(".media").remove();
		}
	});



function showLoader(show)
{
	if(show){
		$(".page-loader-wrapper").removeClass("hide");
	}else{
		$(".page-loader-wrapper").addClass("hide");
	}
}
/* Left Sidebar */



      var _this = this;
      var $body = $('body');
      var $overlay = $('.overlay');

      //Close sidebar
      $(window).on("click", function (e) {
          var $target = $(e.target);
          if (e.target.nodeName.toLowerCase() === 'i') { $target = $(e.target).parent(); }

          if (!$target.hasClass('bars')  && $target.parents('#leftsidebar').length === 0) {
              if (!$target.hasClass('js-right-sidebar')) $overlay.fadeOut();
              $body.removeClass('overlay-open');
          }
      });



      //Collapse or Expand Menu
      $('.menu-toggle').on('click', function (e) {
          var $this = $(this);
          var $content = $this.next();

          if ($($this.parents('ul')[0]).hasClass('list')) {
              var $not = $(e.target).hasClass('menu-toggle') ? e.target : $(e.target).parents('.menu-toggle');

              $.each($('.menu-toggle.toggled').not($not).next(), function (i, val) {
                  if ($(val).is(':visible')) {
                      $(val).prev().toggleClass('toggled');
                      $(val).slideUp();
                  }
              });
          }

          $this.toggleClass('toggled');
          $content.slideToggle(320);
      });




/*  Left sidemenu collapse */
$('.sidemenu-collapse').on('click', function () {
  var $body = $('body');
  if ($body.hasClass('side-closed')) {
      $body.removeClass('side-closed');
      $body.removeClass('submenu-closed');
  } else {
      $body.addClass('side-closed');
      $body.addClass('submenu-closed');
  }
});
$(".content, .navbar").mouseenter(function () {
  var $body = $('body');
  $body.removeClass('side-closed-hover');
  $body.addClass('submenu-closed');
});
$(".sidebar").mouseenter(function () {
  var $body = $('body');
  $body.addClass('side-closed-hover');
  $body.removeClass('submenu-closed');
});

if (localStorage.getItem("demo2_sidebar_option")) {
  jQuery("body").addClass(localStorage.getItem("demo2_sidebar_option"));
}
if ($('body').hasClass('side-closed')) {
  $(".sidebar-user-panel").css({ "display": "none" });
} else {
  $(".sidebar-user-panel").css({ "display": "block" });
}
jQuery(document).on("click", ".sidemenu-collapse", function () {
  var sidebar_option = "";
  if ($('body').hasClass('side-closed')) {
      var sidebar_option = "side-closed submenu-closed";
      $(".sidebar-user-panel").css({ "display": "none" });
  } else {
      $(".sidebar-user-panel").css({ "display": "block" });
  }
  jQuery("body").addClass(sidebar_option);
  localStorage.setItem("demo2_sidebar_option", sidebar_option);
});





$(function(){


	$(".ml-menu li a").click(function(){
		$( ".ml-menu li a" ).each(function( index ) {
			$(this).removeClass('active');
		});

		$(this).addClass('active');
	})


	$(".menu-toggle").click(function(){

	})

	$(".changepassword").click(function(){
		$(".menu-toggle").removeClass('waves-effect waves-block');
		$(".su-access").removeClass('active');
		$('.ml-menu').css('display','none');
		$(".menu-toggle").removeClass('toggled');
		$( ".ml-menu li a" ).each(function( index ) {
			$(this).removeClass('active');
		});
	});
	$('.dropdown, .fullscreen').on('click', function () {
		$(".right-sidebar").removeClass('open');
	});
});
