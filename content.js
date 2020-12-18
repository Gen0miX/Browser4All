
let windowPop;
let zoomLevel = 1;
let srcElement;


//Variable Hover
let toggle = false ;
var prevDOM = null;
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

//Envoie un message quand l'utilisateur refresh la page
if (performance.navigation.type == 1) {
    chrome.runtime.sendMessage("pageRefreshed");
}

//Permet de recevoir et réagir à tous les messages envoyés par nos popups ou notre background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch(request.toString()) {
        case 'zoomIn' :
            updateZoom(0.1);
            break;
        case 'zoomOut' :
            updateZoom(-0.1);
            break;
        case 'refresh' :
            refreshZoom(1);
            break;
        case 'activate_delete' :
            activateDelete();
            sendResponse(toggle);
            break;
        case 'des_delete' :
            activateDelete();
            annulerDelete();
            sendResponse(toggle);
        case 'tabChanged' :
            toggle=true;
            activateDelete();
            break;
        case 'annulerDel' :
            annulerDelete();
            break;
        case 'confirmerDel':
            confirmerDelete();
            break;
        case 'windowClose':
            annulerDelete();
            break;
        default :
            alert(request);
            break;
    }
});

//Augmente ou diminue le zoom de la page
let updateZoom = function(zoom) {
    zoomLevel += zoom;
    $('body').css({ zoom: zoomLevel, '-moz-transform': 'scale(' + zoomLevel + ')' });
}

//Remet le zoom à son état original
let refreshZoom = function(zoom){
    zoomLevel = zoom;
    $('body').css({ zoom: zoomLevel, '-moz-transform': 'scale(' + zoomLevel + ')' });
}

//Active la fonction de suppression d'un élément sur la page
function activateDelete() {

  toggle = !toggle;

   if(toggle){
       //Disable all links
       $('a').bind("click", preventDefault);

       document.addEventListener('mousemove', activateHoverAll, false);
       document.addEventListener('click', deleteElementClicked, false);
   }else{
       //Enable all links
       $('a').unbind('click', preventDefault);

       document.removeEventListener('mousemove', activateHoverAll, false);
       document.removeEventListener('click', deleteElementClicked, false);
   }

}

//Active le hover sur tous les éléments de la page
function activateHoverAll(e){

    srcElement = e.target;

        if (prevDOM != srcElement && srcElement.nodeName == 'DIV' || srcElement.nodeName == 'IMG') {
            if (prevDOM != null) {
                prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
            }

            srcElement.classList.add(MOUSE_VISITED_CLASSNAME);

            prevDOM = srcElement;
        }
}

//Stocke les données et les envois au popup afin de supprimer l'élément
function deleteElementClicked(e){

    var idElem = "null";
    var classElem = "null";

    activateDelete();

    srcElement = e.target;

    console.log(srcElement);
    console.log(srcElement.getAttribute('id'));

    if(srcElement.getAttribute('id') != null) {
        idElem = srcElement.getAttribute('id');
    }
    if(srcElement.getAttribute('class') != null){
        classElem = srcElement.getAttribute('class');
    }

    var datas = {
        id: idElem,
        class: classElem,
        elemNode: srcElement.nodeName,
        elem: srcElement,
        url: location.href
    }

    chrome.storage.sync.set({datasDelete: datas});
    chrome.runtime.sendMessage("openPopup");

}


function annulerDelete(){
    prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
}

function confirmerDelete(){
    prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
    srcElement.remove();
}
//Permet de rétirer le comportement par défaut d'un lien
function preventDefault(e){
    e.preventDefault();
}
