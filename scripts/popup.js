
let toggleDelete ;
let timer;

document.addEventListener('DOMContentLoaded', function(){

    checkButtonState();

    document.getElementById('zoomIn').addEventListener('click', onclickZoomIn, false);

    function onclickZoomIn(){
        chrome.tabs.query({currentWindow:true, active: true},
            function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, 'zoomIn');
        });
    }

    document.getElementById('zoomOut').addEventListener('click', onclickZoomOut, false);

    function onclickZoomOut(){
        chrome.tabs.query({currentWindow:true, active: true},
            function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, 'zoomOut');
            });
    }

    document.getElementById('refresh').addEventListener('click', onclickRefresh, false);

    function onclickRefresh(){
        chrome.tabs.query({currentWindow:true, active: true},
            function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, 'refresh');
            });
    }

    document.getElementById('activate_del_elem').addEventListener('click', onclickActivateDelete, false);
    document.getElementById('desactiver_del_elem').addEventListener('click', onclickActivateDelete, false);

    function onclickActivateDelete(){
        toggleDelete = !toggleDelete;
        if(toggleDelete){
            document.getElementById('activer_element_suppr').style.display='none';
            document.getElementById('desactiver_element_suppr').style.display='flex';
            chrome.storage.sync.set({tglDelete: toggleDelete});
        }else{
            document.getElementById('activer_element_suppr').style.display='flex';
            document.getElementById('desactiver_element_suppr').style.display='none';
            chrome.storage.sync.set({tglDelete: toggleDelete});
            clearTimeout(timer)
        }

        chrome.tabs.query({currentWindow:true, active: true},
            function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, 'activate_delete' ,windowCloseTimer);
            });
    }

    document.querySelector('#go-to-options').addEventListener('click',function (){
        if(chrome.runtime.openOptionsPage){
            chrome.runtime.openOptionsPage();
        }else{
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

    document.querySelector('#close-popup').addEventListener('click', function (){
        window.close();
    });


}, false)

function windowCloseTimer(res){
    if(res){
       timer=setTimeout(closeWindow, 3000);
    }
}

function closeWindow(){
    window.close();
}

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



