var currentResult;

new Promise(function(resolve) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
})
    .then(function() {
   console.log(document.getElementById("friendList"));
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: 5382134
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, 8);
        });
    })
    .then(function() {
        return new Promise(function(resolve, reject) {
            VK.api('users.get', {'name_case': 'gen'}, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    resolve();
                }
            });
        })
    })
    .then(function() {
        var p = new Promise(function(resolve, reject) {
            VK.api('friends.get', {fields:["photo_50"]}, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    
                    Storage.init(modelUpdatedHandler);
                    Storage.load(response.response);
                    
                    resolve();
                }
            });
        });
    
        p.catch(function(e) {
            alert('Ошибка: ' + e.message);
        });
    
        return p;
    })
    .then(function(){
        mainList.addEventListener("click", addOrDelete);
        filterList.addEventListener("click", addOrDelete);

        filterMain.addEventListener("input", function(e){
            Storage.filterMain(filterMain.value);
        });

        filterLocal.addEventListener("input", function(e){
            Storage.filterLocal(filterLocal.value);
        });

        btnSave.addEventListener("click", Storage.save);

        Drag.subscribe();
});

function modelUpdatedHandler(result){
    currentResult = result;
    
    fillIn(currentResult);
}

function fillIn(result){
    var source = friendListTemplate.innerHTML,
    templateFn = Handlebars.compile(source),
    template = templateFn({listMain: result.main});

    resultMain.innerHTML = template;
    
    source = friendListLocalTemplate.innerHTML;
    templateFn = Handlebars.compile(source);
    template = templateFn({listLocal: result.local});

    resultLocal.innerHTML = template;
}

function addOrDelete(e){
    e.preventDefault();
    
    var attrActionName = "data-action";
    if (!e.target.hasAttribute(attrActionName)) return;
    
    var li = findParent(e.target, "li")
    var action = e.target.getAttribute(attrActionName),
        uid = li.getAttribute("data-uid");
    
    if (action === "add"){
        Storage.addLocal(uid);
    }else if(action === "delete"){
        Storage.addMain(uid);
    }
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

