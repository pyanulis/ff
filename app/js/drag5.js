var Drag = (function() {
    
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
        
        mainFriendsList.addEventListener("dragstart", function(e){
            e.dataTransfer.setData({}, {});
            listDragStart(getIsOverFilterList, e.srcElement, Storage.addLocal);
        });
        
        friendsFilter.addEventListener("dragstart", function(e){
            listDragStart(getIsOverMainList, e.srcElement, Storage.addMain);
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
    
    function listDragStart(listOverDelegate, dragElement, update){
        dragElement.ondragend = function(){
                if (listOverDelegate()){
                    update(dragElement.getAttribute("data-uid"));
                    dragElement.ondragend = null;
                }
            };
    }
    
    function getIsOverFilterList(){
        return isOverFilter;
    }
    
    function getIsOverMainList(){
        return isOverMainList;
    }
    
    return {
            subscribe: setupListeners
        };
})();