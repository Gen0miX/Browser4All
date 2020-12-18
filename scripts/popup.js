
let toggleDelete ;
let timer;

document.addEventListener('DOMContentLoaded', function(){

    checkButtonState();

    //Envoie le message de zoomer
    document.getElementById('zoomIn').addEventListener('click', onclickZoomIn, false);

    function onclickZoomIn(){
        chrome.tabs.query({currentWindow:true, active: true},
            function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, 'zoomIn');
        });
    }

    //Envoie le message de dézoomer
    document.getElementById('zoomOut').addEventListener('click', onclickZoomOut, false);

    function onclickZoomOut(){
        chrome.tabs.query({currentWindow:true, active: true},
            function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, 'zoomOut');
            });
    }

    //Envoie le message de rafraîchir le zoom
    document.getElementById('refresh').addEventListener('click', onclickRefresh, false);

    function onclickRefresh(){
        chrome.tabs.query({currentWindow:true, active: true},
            function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, 'refresh');
            });
    }

    //Activer le fonction de suppression en changeant le bouton et en envoyant le message correspondant au script de contenu
    document.getElementById('activate_del_elem').addEventListener('click', onclickActivateDelete, false);
    document.getElementById('desactiver_del_elem').addEventListener('click', onclickActivateDelete, false);

    function onclickActivateDelete(){
        toggleDelete = !toggleDelete;
        if(toggleDelete){
            document.getElementById('activer_element_suppr').style.display='none';
            document.getElementById('desactiver_element_suppr').style.display='flex';
            chrome.storage.sync.set({tglDelete: toggleDelete});

            chrome.tabs.query({currentWindow:true, active: true},
                function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, 'activate_delete' ,windowCloseTimer);
                });

        }else{
            document.getElementById('activer_element_suppr').style.display='flex';
            document.getElementById('desactiver_element_suppr').style.display='none';
            chrome.storage.sync.set({tglDelete: toggleDelete});
            clearTimeout(timer)

            chrome.tabs.query({currentWindow:true, active: true},
                function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, 'des_delete' ,windowCloseTimer);
                });

        }
    }

    //Ouvre la page d'options de l'extension
    document.querySelector('#go-to-options').addEventListener('click',function (){
        if(chrome.runtime.openOptionsPage){
            chrome.runtime.openOptionsPage();
        }else{
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

    //Donne l'action de fermer le popup au bouton du header
    document.querySelector('#close-popup').addEventListener('click', function (){
        window.close();
    });


}, false)

//Ferme la fenêtre de popup après un certain temps si la suppression est active
function windowCloseTimer(res){
    if(res){
       timer=setTimeout(closeWindow, 3000);
    }
}
function closeWindow(){
    window.close();
}

//Contrôle l'état de la fonction de suppression d'un élément lorsqu'on ouvre le popup
function checkButtonState(){
    chrome.storage.sync.get(["tglDelete"], function(data){
        toggleDelete = data.tglDelete;
        if(toggleDelete){
            document.getElementById('activer_element_suppr').style.display='none';
            document.getElementById('desactiver_element_suppr').style.display='flex';
        }else{
            document.getElementById('activer_element_suppr').style.display='flex';
            document.getElementById('desactiver_element_suppr').style.display='none';
        }
    });
}



