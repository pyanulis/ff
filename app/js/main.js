Handlebars.registerHelper('formatTime', function(time) {
    var minutes = parseInt(time / 60),
        seconds = time - minutes * 60;

    minutes = minutes.toString().length === 1 ? '0' + minutes : minutes;
    seconds = seconds.toString().length === 1 ? '0' + seconds : seconds;

    return minutes + ':' + seconds;
});

var globalPlayer = document.createElement('audio'),
    playingItem;

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
                    headerInfo.textContent = 'Музыка на странице ' + response.response[0].first_name + ' ' + response.response[0].last_name;

                    resolve();
                }
            });
        })
    })
    .then(function() {
        return new Promise(function(resolve, reject) {
            VK.api('friends.get', {fields:["photo_50"]}, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    
                    console.log(response.response);
                    
                    var source = friendListTemplate.innerHTML,
                        templateFn = Handlebars.compile(source),
                        template = templateFn({list: response.response});

                    results.innerHTML = template;

                    Drag().subscribe();
                    resolve();
                }
            });
        });
    }).catch(function(e) {
    alert('Ошибка: ' + e.message);
});

