var Drag = function() {
    
    var isDragging = false;
    var body = document.getElementsByTagName("body")[0];
    var dragClone;

    var offsetX, offsetY;
    
    function setupListeners(){
        var dragList = document.getElementById("friendList");
        
        dragList.ondragstart = function(){
            return false;
        }

        dragList.onmousedown = function(e) { 
            
            var dragEl = findParent(e.target, "li");

            console.log(dragEl);
            dragClone = dragEl.cloneNode(true);
            dragClone.style.opacity = 0.5;
            dragClone.style.position = "absolute";
            dragClone.style.zIndex = 1000;
            
            console.log(dragClone);

            var location = getLocation(dragEl);
            console.log(location);
            offsetX = e.pageX - location.left;
            offsetY = e.pageY - location.top;
            
            dragClone.onmouseup = function(e){
        if (!isDragging) return;
        
                console.log("up");

                //dragEl.style.left = dragClone.style.left;
                //dragEl.style.top = dragClone.style.top;

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
        console.log(e.pageX, e.pageY);
        dragClone.style.left = e.pageX - offsetX + 'px';
        dragClone.style.top = e.pageY - offsetY + 'px';
      }

    document.onmousemove = function(e) {
        if (isDragging){
            moveDragEl(e);
        }
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


