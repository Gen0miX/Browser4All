
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.set({tglDelete: false});
});

//Catch le message de la page refresh pour remettre à zéro le tglDelete
chrome.runtime.onMessage.addListener(function (e) {
    if (e == "pageRefreshed") {
        chrome.storage.sync.set({tglDelete: false});
    }
});

chrome.tabs.onSelectionChanged.addListener(() =>{
   chrome.storage.sync.set({tglDelete: false});

   chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
       chrome.tabs.sendMessage(tabs[0].id, 'tabChanged');
   });
});

chrome.runtime.onMessage.addListener(function(e){
    if(e == "openPopup"){
        var newWindow=window.open('delete.html', 'deleteWindow', 'height=300,width=700');
        if(window.focus()){
            newWindow.focus();
        }
    }
});



