var Drag = function() {
    
    var isDragging = false;
    var body = document.getElementsByTagName("body")[0];
    var dragClone;

    var offsetX, offsetY;
    
    function setupListeners(){
        var mainSection = document.getElementById("mainContent");
        var dragList = document.getElementById("friendList");
        var friendsFilter = document.getElementById("friendListChosen");
        
        var isOverMainList,
            isOverMainContent,
            isOverFilter;
        
        

        document.onmousemove = function(e) {
            console.log(e.target.tagName);
            if (isDragging){
                moveDragEl(e);
            }
        }
        dragList.ondragstart = function(){
            //return false;
            console.log("dragList drag start");
        }
        
        mainSection.ondragover = function(){
            console.log("main drag over");
        }
        
        mainSection.ondrag = function(){
            console.log("main drag");
        }
        
        friendsFilter.onmouseout = function(e){
            console.log("no");
            isOverFilter = false;
        }
        
        friendsFilter.onmouseover = function(){
            console.log("obj");
            isOverFilter = true;
        }

        dragList.onmousedown = function(e) { 
            e.preventDefault();
            
            var dragEl = findParent(e.target, "li");

            dragClone = dragEl.cloneNode(true);
            dragClone.style.opacity = 0.8;
            dragClone.style.position = "absolute";
            dragClone.style.zIndex = 1000;

            var location = getLocation(dragEl);
            offsetX = e.pageX - location.left;
            offsetY = e.pageY - location.top;
            
            dragClone.onmousemove = function(e){
                console.log(e.target.tagName);
                e.preventDefault();
            }
            dragClone.onmouseup = function(e){
                console.log('isOverFilter:', isOverFilter);
                if (!isDragging) return;
                
                if (!isOverFilter){
                    body.removeChild(dragClone);
                    isDragging = false;
                    return;
                }
                
                var dragInsert = dragEl.cloneNode(true);
                friendsFilter.appendChild(dragInsert);
                dragList.removeChild(dragEl);
                
                var uid = dragInsert.getAttribute("data-uid");
                
                if (storage_uid.indexOf(uid) === -1){
                    storage_uid.push(uid);
                }
                
                localStorage["friendListChosen"] = JSON.stringify(storage_uid.join(" "));
                
                console.log(localStorage);

                body.removeChild(dragClone);
                isDragging = false;
            }
            
            body.appendChild(dragClone);
            isDragging = true;
        }
    };
    
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


