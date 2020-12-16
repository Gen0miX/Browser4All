var datas, stringtoShow, url;

document.addEventListener('DOMContentLoaded', function(){
    chrome.storage.sync.get(["datasDelete"], function(data){
        datas = data ;
        console.log(datas);
        url = transformUrl(data.datasDelete.url);
        stringtoShow = createStringtoShow(data, url);
        document.getElementById('txt-area').value += stringtoShow;
    });

    document.getElementById('annuler').addEventListener('click', onClickAnnuler, false);


    function onClickAnnuler(){
        chrome.tabs.query({currentWindow:false, active: true},
            function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, 'annulerDel');
                window.close();
            });
    }

    document.getElementById('confirmer').addEventListener('click', onClickConfirmer, false);

    function onClickConfirmer(){
        chrome.tabs.query({currentWindow:false, active: true},
            function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, 'confirmerDel');
                window.close();
            });
    }




}, false);

$(window).bind("beforeunload", function(){
    chrome.tabs.query({currentWindow:false, active: true},
        function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, 'windowClose');
            window.close();
        });
});

function transformUrl(url){
    var urlTransformed = "";
    var urlSplitted;
    var i;

    urlSplitted=url.split("/");
    console.log(urlSplitted);

    for (i = 0; i <= 2 ; i++) {
        switch (i) {
            case 0 :
                urlTransformed += urlSplitted[i];
                break;
            case 1 :
                urlSplitted[i] = "//";
                urlTransformed += urlSplitted[i];
                break;
            case 2 :
                urlTransformed += urlSplitted[i]+"/";
                break;
        }
    }
    return urlTransformed;
}

function createStringtoShow(data, url) {
    var string = "";

    string += url;
    if(data.datasDelete.id !== "null"){
        string += "#"+data.datasDelete.id;
    }
    if(data.datasDelete.class !== "null"){
        string += "."+data.datasDelete.class;
    }


    return string ;

}

