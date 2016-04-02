var Drag = function() {
    
    var isDragging = false;
    var body = document.getElementsByTagName("body")[0];
    var dragClone;

    var offsetX, offsetY;
        
    var isOverMainList,
        isOverFilter;
    
    function setupListeners(){
        var mainSection = document.getElementById("mainContent");
        var mainFriendsList = document.getElementById("friendList");
        var friendsFilter = document.getElementById("friendListChosen");
        
        if (!localStorage["friendListChosen"]){
            console.log("init ls");
            localStorage["friendListChosen"] = "\"\"";
        }
        var storage_uid = JSON.parse(localStorage["friendListChosen"]).split(" ").filter(function(item, index, array){
            return item !== "";
        });
        console.log('storage_uid:', storage_uid);
        
        mainFriendsList.addEventListener("dragstart", function(e){
            listDragStart(getIsOverFilterList, e.srcElement, friendsFilter);
        });
        
        friendsFilter.addEventListener("dragstart", function(e){
            listDragStart(getIsOverMainList, e.srcElement, mainFriendsList);
        });
        
        document.addEventListener("dragover", function(e){
            isOverMainList = false;
            isOverFilter = false;
        }, true);
        
        mainFriendsList.addEventListener("dragover", function(e){
            e.preventDefault();
            isOverMainList = true;
        }, true);
        
        friendsFilter.addEventListener("dragover", function(e){
            e.preventDefault();
            isOverFilter = true;
        }, true);
    };
    
    function listDragStart(listOverDelegate, dragElement, listELement){
        dragElement.ondragend = function(){
                if (listOverDelegate()){
                    listELement.appendChild(dragElement);
                    dragElement.ondragend = null;
                }
            };
    }
    
    function getIsOverFilterList(){
        console.log('isOverFilter:', isOverFilter);
        return isOverFilter;
    }
    
    function getIsOverMainList(){
        console.log('isOverMainList:', isOverMainList);
        return isOverMainList;
    }
    
    function findParent(sourceEl, parentTag){
        
        if (sourceEl.tagName === parentTag) return sourceEl;
        
        var tagName = "";
        var parentNode = sourceEl;
        while (tagName.toLowerCase() !== parentTag.toLowerCase() && tagName.toLowerCase() !== "body"){
            
            parentNode = parentNode.parentNode;
            tagName = parentNode.tagName;
        }
        
        if (tagName.toLowerCase() === "body"){
            throw "Didn't find " + parentTag + ". Reached document root.";
        }
        
        return parentNode;
    }
    
    
    function cloneFull(sourceEl){
        if (sourceEl.nodeType !== 1) return sourceEl;
        
        var clone = sourceEl.cloneNode();
        for (var i = 0; i<sourceEl.childNodes.length;++i){
            
            clone.appendChild(cloneFull(sourceEl.childNodes[i]));
        }
        
        return clone;
    }

    function moveDragEl(e) {
        dragClone.style.left = e.pageX - offsetX + 'px';
        dragClone.style.top = e.pageY - offsetY + 'px';
      }

    function getLocation(elem) {
      var box = elem.getBoundingClientRect();

      var body = document.body;
      var docEl = document.documentElement;

      var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

      var clientTop = docEl.clientTop || body.clientTop || 0;
      var clientLeft = docEl.clientLeft || body.clientLeft || 0;

      var top = box.top + scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;

      return {
        top: top,
        left: left
      };
        
        
}
    
    return {
            subscribe: setupListeners
        };

/*var inputColor = document.getElementById("inputColor");
inputColor.onkeyup = function(e){
    body.style.background = inputColor.value;
    console.log(inputColor.value);
}*/
};


