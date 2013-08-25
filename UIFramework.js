
var map = new Array(); //Used by UI
var deleted = false;
function createInternalDiv(parent, innerclass, backbutton) {
    var newChild = $("<div class='" + innerclass + " right-panel'></div>");
    //newBack = $("<img class='backarrow' src='images\\backarrow.gif' height='25' width='25'/>");
	newBack = $("<div><===</div>");
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

//Global variables
function UIFramework()
{
	this.breadcrum = new Array();
	this.mainMenus = new Array();
	this.multipleSelect =  false;
	this.onload = function(){
		//Bind the main menu buttons
		for (var i = 0; i < UIFramework.mainMenus.length; i++) {
			if($(UIFramework.mainMenus[i].element).length == 0){
				console.log("Main menu has a null element for menu, click won't work for " + UIFramework.mainMenus[i].name);
			}
			$(UIFramework.mainMenus[i].element).click({mainmenu: UIFramework.mainMenus[i]}, UIFramework.mainMenus[i].onClick);
		}
	};
	this.getSelectedMenus = function(){
		var ret = new Array();
		for (var i = 0; i < UIFramework.mainMenus.length; i++) {
			if(UIFramework.mainMenus[i].selected){
				ret.push(UIFramework.mainMenus[i])
			}
		}
		return ret;
	}
}

window.UIFramework = new UIFramework();
$().ready(UIFramework.onload);	

//This is an object for a main menu
function MainMenu(name, element, rightPanel){
	window.UIFramework.mainMenus.push(this); 
	
	this.name = name;
	this.element = element;
	this.selected = false;
	this.rightPanel; //TODO;
	this.onClick = function(parameters){
		var self = parameters.data.mainmenu; //GetMainMenuObj($(this));
		
		self.setSelect(!self.selected);
		if(UIFramework.multipleSelect != true){
			//Unselect every other main menu
			for (var i = 0; i < UIFramework.mainMenus.length; i++) {
				if($(self.element).is(UIFramework.mainMenus[i].element)){
					continue;
				}
				UIFramework.mainMenus[i].setSelect(false);
			}
		}
		if(self.rightPanel == null){
			console.log("Right panel is null for mainMenu, not doing anything");
		} else {
			var defaultParams = { mainMenuClicked: self, mainMenuSelected: UIFramework.getSelectedMenus()};
			self.rightPanel.show(defaultParams); //We pass what menu was clicked, and which ones are selected
		}
		
		
	};
	
	this.toString = function(){
		return "MainMenu object: " + name;
	};
	
	this.setSelect = function(selected){
		this.selected = selected;
		if(this.selected){
			$(this.element).addClass("selected-item");
		} else {
			$(this.element).removeClass("selected-item");
		}
	};
	
	
}

//An element that when clicked will open up a right panel and send some parameters
function PanelOpener(element, rightPanel, parameters){
	this.element = element;
	this.rightPanel = rightPanel;
	this.parameters = parameters;
	
	this.onClick = function(params){
		var passedParameters = params.data;
		var newPanel = passedParameters.opener.rightPanel;
		if(newPanel == null){
			console.log("Right panel is null for mainMenu, not doing anything");
		} else {
			newPanel.show(passedParameters.rightPanel, passedParameters.opener.parameters); 
		}
	}
}

function RightPanel(name, showBackButton, cssClass, onCreate){
	this.name = name;
	this.cssClass = cssClass;
	this.onCreate = onCreate; //Function that is called when we get created.
	this.showBackButton = showBackButton;
	this.element; //If null, this means we don't exist yet.
	this.panelOpeners = new Array();
	if(this.showBackButton == null){
		this.showBackButton = true; //Default to true
	}
	this.show = function(previousRightPanel, parameters){
		destroyMap(previousRightPanel.element);
		var ret = createInternalDiv($("#exploding-right"), cssClass);
		$(ret).append(name);
		this.element = $(ret);
		if(onCreate != null){
			this.onCreate($(ret), parameters);
			
			//Bind any panel openers added to their onclick function
			for (var i = 0; i < this.panelOpeners.length; i++) {
				$(this.panelOpeners[i].element).click({opener: this.panelOpeners[i], rightPanel: this}, this.panelOpeners[i].onClick);
			}
		}
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
