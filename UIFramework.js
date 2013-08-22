
var map = new Array(); //Used by UI

function createInternalDiv(parent, innerclass, backbutton) {
    var newChild = $("<div class='" + innerclass + " right-panel'></div>");
    newBack = $("<img class='backarrow' src='images\\backarrow.gif' height='25' width='25'/>");
    TopDiv = $("<div class='panel-top'></div>");
    
    if (typeof backbutton == 'undefined' && backbutton != false) {
        $(TopDiv).append($(newBack));
    }
    $(newChild).append($(TopDiv));
    $(parent).append(newChild);
    if (!deleted) {
        $('html, body').animate({
            scrollLeft: $(newChild).offset().left
        }, 2000);
    }
    deleted = false;

    map.push($(newChild));
    $(newBack).click(function () {
        destroyMap($(newChild.prev()));
    });
    return $(newChild);
}


function destroyMap(parent) {
    var counter = 10;
    while (parent != null && parent.length != 0 && !$(parent).hasClass("right-panel")) {
        parent = $(parent).parent();
        if (parent == $("body")){
            break;
        }

        //Infinite loop breaker
        counter--;
        if (counter == 0) {
            break;
        }
        
    }
  
    
    while (map.length != 0 && !$(map[map.length - 1]).is($(parent))) {

        if (map.length - 2 >= 0) {
            $('html, body').animate({
                scrollLeft: $(map[map.length - 2]).offset().left
            }, "slow");
        }
        $(map.pop()).remove();
        deleted = true;
    }
}

function CloseCenterBox() {
    $(".center-box").remove();
    $(".center-box-dim").remove();
}

function DisplayCenterBox(title) {
    
    var div = $("<div class='center-box-dim'></div>");
    $("body").append(div);
    
    

    if ($(".center-box").length == 0) {
        var div = $("<div class='center-box'><b>" + title + "</b><div class='center-close'><a>X</a></div><hr/><br/></div>");
        $("body").append(div);
        $(".center-close").click(CloseCenterBox);
        return div;
    } else {
        CloseCenterBox();
    }
}
