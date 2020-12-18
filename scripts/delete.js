var datas, stringtoShow, url;

document.addEventListener('DOMContentLoaded', function(){
    //Cherche les données stockés dans notre navigateur pour la suppression
    chrome.storage.sync.get(["datasDelete"], function(data){
        datas = data ;
        console.log(datas);
        url = transformUrl(data.datasDelete.url);
        stringtoShow = createStringtoShow(data, url);
        document.getElementById('txt-area').value += stringtoShow;
    });

    //Annule la suppression de l'élément
    document.getElementById('annuler').addEventListener('click', onClickAnnuler, false);


    function onClickAnnuler(){
        chrome.tabs.query({currentWindow:false, active: true},
            function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, 'annulerDel');
                window.close();
            });
    }

    //Confirme la suppression de l'élément
    document.getElementById('confirmer').addEventListener('click', onClickConfirmer, false);

    function onClickConfirmer(){
        chrome.tabs.query({currentWindow:false, active: true},
            function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, 'confirmerDel');
                window.close();
            });
    }




}, false);

//Quand la fenêtre va être fermée elle va envoyer un message
$(window).bind("beforeunload", function(){
    chrome.tabs.query({currentWindow:false, active: true},
        function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, 'windowClose');
            window.close();
        });
});

//Tranform l'url afin de garder que l'adresse du site
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

//Créer le string qui va être afficher dans la textbox en ajoutant l'url + la class + l'id de l'élément
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

