var Storage = (function() {
    
    var key = "friendListChosen";
    
    var storage_uid;
    
    var filterMain = "",
        filterLocal = "";
    
    var storage = {
        main: [],
        local: []
    };
    
    var model = {
        main: [],
        local: []
    };
    
    var modelUpdatedCallback;
    
    function loadStorage(serverResponse){
        
        storage_uid = [];
        
        if (localStorage[key]){
            storage_uid = JSON.parse(localStorage[key]).split(" ").filter(function(item, index, array){
                return item !== "";
            });
        }
        
        storage = parseServerList(serverResponse);
        updateModel();
    }
    
    function updateModel(){
        if (filterLocal === ""){
            model.local = storage.local.slice();
        }else{
            model.local = filterList(storage.local, filterLocal);
        }
        
        if (filterMain === ""){
            model.main = storage.main.slice();
        }else{
            model.main = filterList(storage.main, filterMain);
        }
        
        model.local = model.local.sort(sorterByFullName);
        model.main = model.main.sort(sorterByFullName);
        
        modelUpdatedCallback(model);
    }
    
    function parseServerList(serverResponse){
    
        var listMain = [],
            listLocal = [];
        
        serverResponse.forEach(function(item){
            if (storage_uid.indexOf(item.uid.toString()) !== -1){
                item["action_img"] = "images/icon-delete.png";
                listLocal.push(item);
            }else{
                item["action_img"] = "images/icon-add.png";
                listMain.push(item);
            }
            item["fullname"] = item.first_name + " " + item.last_name;
        });
        
        return {
            main: listMain,
            local: listLocal
        }
    }
    
    function addLocal(uid){
        var adding = storage.main.filter(function(item){
            return item.uid.toString() === uid;
        })[0];
        
        adding["action_img"] = "images/icon-delete.png";
        
        storage.local.push(adding);
        storage.main.splice(storage.main.indexOf(adding), 1);
        
        updateModel();
    }
    
    function addMain(uid){
        var adding = storage.local.filter(function(item){
            return item.uid.toString() === uid;
        })[0];
        
        adding["action_img"] = "images/icon-add.png";
        
        storage.main.push(adding);
        storage.local.splice(storage.local.indexOf(adding), 1);
        
        updateModel();
    }
    
    function filterList(list, filter){
        return list.filter(function(item){
            return item.fullname.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        });
    }
    
    function setFilterMain(filter){
        filterMain = filter;
        updateModel();
    }
    
    function setFilterLocal(filter){
        filterLocal = filter;
        updateModel();
    }
    
    function initModule(updateCallback){
        modelUpdatedCallback = updateCallback;
    }
    
    function save(){
        storage_uid = [];
            
        storage.local.forEach(function(item){
            storage_uid.push(item.uid);
        });

        localStorage[key] = JSON.stringify(storage_uid.join(" "));
    }
    
    function sorterByFullName(item1, item2){
        var fn1 = item1.fullname.toLocaleLowerCase(),
            fn2 = item2.fullname.toLocaleLowerCase();
        
        if (fn1 > fn2) return 1;
        if (fn1 < fn2) return -1;
        return 0;
    }
    
    return {
        load: loadStorage,
        addLocal: addLocal,
        addMain: addMain,
        filterLocal: setFilterLocal,
        filterMain: setFilterMain,
        save: save,
        init: initModule
    }
})();