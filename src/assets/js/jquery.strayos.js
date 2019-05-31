;(function($){
  function mobileNav(){
    $(".btnMobileNav").on("click", function(){
      var display = $(".topNav").css("display");
      if(display == "none"){
        $(this).addClass("navClose");
        $(".topNav").stop(true, true).fadeIn(300);
        $("html, body").css({
          overflow:"hidden"
        });
      }
      else{
        $(this).removeClass("navClose");
        $(".topNav").stop(true, true).fadeOut(300);
        $("html, body").css({
          overflow:"visible"
        });
      }
    });
  }

  function leftNav(){
    $(".leftNav > li > a").each(function(){
      $(this).on("click", function(){
        if($(this).next("ul").length > 0){
          $(this).toggleClass("on");
          $(this).next("ul").stop(true, true).slideToggle(300);
        }
      });
    });
  }

  //Siteinfo
  function siteInfo(){
    $(".siteInfo").each(function(){
      $(this).on("click", function(){
        $(this).find(".siteDetails").fadeIn(300);
      });
    });
    $(document).mouseup(function(e) {
      var container = $(".siteDetails");
      if(!container.is(e.target) && container.has(e.target).length === 0){
        container.hide();
      }
    });
  }

  //Show hide ExportMeasurement
  function showhideExportMeasurement(){
    $(".txtMeasurement").on("click", function(){
      $(".exportMeasurement").fadeToggle(300);
      return false;
    });
    $(".exportMeasurement").on("click", function(){
      $(".dvExportMeasurement").fadeIn(300);
      $(this).fadeOut(300);
      return false;
    });
    $(".btnCloseExport").on("click", function(){
      $(".dvExportMeasurement").fadeOut(300);
      return false;
    });
  }

  function siteDropdown(){
    $(".siteDropdown").each(function(){
      $(this).on("click", function(){
        $(this).next(".dropdownList").fadeIn(300);
      });
    });
    $(document).mouseup(function(e) {
      var container = $(".dropdownList");
      if(!container.is(e.target) && container.has(e.target).length === 0){
        container.hide();
      }
    });
  }

  function showhideLeftPanel(){
    $(".btnCollapse").on("click", function(){
      var panel = $(this).attr("data-panel");
      var panelClass = $(this).attr("data-panelClass");
      $(this).toggleClass("off");
      $("."+panel).toggleClass(panelClass);
    });
  }

  function userAccount(){
    $(".user").on("click", function(){
      $(".userAccount").fadeToggle(300);
    });
    $(document).mouseup(function(e) {
      var container = $(".userAccount");
      if(!container.is(e.target) && container.has(e.target).length === 0){
        container.hide();
      }
    });
  }

  function downloadProject(){
    $(".btnDownload").on("click", function(){
      $(".downloadProjectFiles").slideDown(300);
    });
    $(".closeDownload").on("click", function(){
      $(".downloadProjectFiles").slideUp(300);
      return false;
    });
  }

  function tabs(){
    $(".tabs a").eq(0).addClass("activeTab");
    $(".tabContent").eq(0).slideDown(300);
    $(".tabs a").each(function(){
      $(this).on("click", function(){
        var target = $(this).attr("href");
        $(".activeTab").removeClass("activeTab");
        $(this).addClass("activeTab");
        $(".tabContent").slideUp(300);
        $(target).slideDown(300);
        return false;
      });
    });
  }

  function closePopup(){
    $(".closePop").each(function(){
      $(this).on("click", function(){
        var target = $(this).attr("data-target");
        $(target).fadeOut(300);
        return false;
      });
    });
  }

  function timeline(){
    $(".btnTimeline").on("click", function(){
      $('.btnTimelineOuter').toggleClass("closeTimeline");
      $(this).toggleClass("closeTimeline");
      $(".timelineContOuter").toggleClass("closeTimelineContOuter");
      $(".timelineCont").toggleClass("closeTimelineCont");
    });

    $(".checkbox.checkbox-info input[type=checkbox]").each(function(){
      $(this).on("change", function(){
        if($(this).is(':checked')){
          $(this).closest(".timelineImg").find(".timelineImgCont").addClass("activeChk");
          $(this).closest(".chkOuter").addClass("activeChk");
        }
        else{
          $(this).closest(".timelineImg").find(".timelineImgCont").removeClass("activeChk");
          $(this).closest(".chkOuter").removeClass("activeChk");
        }
      });
    });
  }

  function switchBttn(){
    $(".switchBtn").each(function(){
      $(this).on("change", function(){
        if($(this).attr("data-target")){
          var obj = $(this).attr("data-target");
          if($(this).is(':checked')){
            $(obj).slideDown(300);
          }
          else{
            $(obj).slideUp(300);
          }
        }
      });
    });
  }

  function expandMap(){
    $(".btnExpandMap").each(function(){
      $(this).on("click", function(){
        $(this).toggleClass("collapseMap");
        var target = $(this).attr("data-target");
        $("#"+target).toggleClass("expand");
        $("#"+target).find(".layerRowRight").toggleClass("showhide");
      });
    });
  }

  $(function(){
    mobileNav();
    leftNav();
    siteInfo();
    showhideExportMeasurement();
    siteDropdown();
    showhideLeftPanel();
    userAccount();
    downloadProject();
    tabs();
    closePopup();
    timeline();
    switchBttn();
    expandMap();
  });

})(jQuery);



