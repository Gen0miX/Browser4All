
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

let updateZoom = function(zoom) {
    zoomLevel += zoom;
    $('body').css({ zoom: zoomLevel, '-moz-transform': 'scale(' + zoomLevel + ')' });
}

let refreshZoom = function(zoom){
    zoomLevel = zoom;
    $('body').css({ zoom: zoomLevel, '-moz-transform': 'scale(' + zoomLevel + ')' });
}


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
       /*prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);*/
       document.removeEventListener('click', deleteElementClicked, false);
   }

}

function activateHoverAll(e){

    srcElement = e.target;

        // Lets check if our underlying element is a IMG.
        if (prevDOM != srcElement && srcElement.nodeName == 'DIV' || srcElement.nodeName == 'IMG') {

            // For NPE checking, we check safely. We need to remove the class name
            // Since we will be styling the new one after.
            if (prevDOM != null) {
                prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
            }

            // Add a visited class name to the element. So we can style it.
            srcElement.classList.add(MOUSE_VISITED_CLASSNAME);

            // The current element is now the previous. So we can remove the class
            // during the next iteration.
            prevDOM = srcElement;
        }
}

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

function preventDefault(e){
    e.preventDefault();
}
