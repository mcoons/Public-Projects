var colors = [ "#131313","#1b1b1b","#272727","#3d3d3d","#5d5d5d","#858585","#b4b4b4","#ffffff","#c7cfdd","#92a1b9","#657392","#424c6e","#2a2f4e","#1a1932","#391f21","#5d2c28","#8a4836","#bf6f4a","#e69c69","#f6ca9f","#f9e6cf","#edab50","#e07438","#c64524","#8e251d","#ff5000","#ed7614","#ffa214","#ffc825","#ffeb57","#d3fc7e","#99e65f","#5ac54f","#33984b","#1e6f50","#134c4c","#0c2e44","#00396d","#0069aa","#0098dc","#00cdf9","#0cf1ff","#94fdff","#fdd2ed","#f389f5","#db3ffd","#7a09fa","#3003d9","#0c0293","#03193f","#3b1443","#622461","#93388f","#ca52c9","#c85086","#f68187","#f5555d","#ea323c","#c42430","#891e2b","#571c27","#ff0000","#00ff00","#0000ff" ];
var currentColor = "#000000"; 
var backgroundColor = "rgb( 255,255,255 )";
var painting = false;
var erasing = false;
var currentBrush = 0;
var undoArray = [];
var scale = 1;
var alphaBackground = true;
var showGrid = true;
var width = 70;
var height = 70;

createCanvas( width, height );
createPalette();
createTools();

document.body.onmousedown = function(){ painting = true; }
document.body.onmouseup   = function(){ painting = false; }

function createCanvas( width, height ){
    let canvas     = createElement( {type: "canvas", id: "myCanvas", width: scale*width, height: scale*height} );
    let main       = createElement( {type: "div",    id: "main"} );
    let header     = createElement( {type: "header", id: "header"} );
    let headerText = createElement( {type: "div",    id: "headerText", text: "Sprite Maker"} );
    let paintArea  = createElement( {type: "div",    id: "paintArea",  events: [ {type: "mouseleave", fn: clearCursor} ]} );

    for ( let h = 0; h < height; h++ ){
        let rowDiv = createElement( {type: "div", id: "row"+h, classes: [ "row" ]} );
        for ( let w = 0; w < width; w++ ){
            let pixelDiv = createElement( {type: "div", id: w+","+h, events: [ {type: "click", fn: paintPixel}, {type: "mouseover", fn: mouseOver} ], classes: [ "pixel", "outlined", "background" ]} );
            pixelDiv.style.background = backgroundColor;
            rowDiv.appendChild( pixelDiv );
        }        
        paintArea.appendChild( rowDiv );
    }

    header.appendChild( headerText );
    header.appendChild( canvas );
    header.appendChild( createElement( {type: "a", id: "saveButton", events:[ {type: "click", fn: saveSprite} ], text: "Download Sprite", classes: [ "button" ]} ));
    main.appendChild( paintArea );
    main.appendChild( header );
    document.getElementsByTagName( "body" )[0].appendChild( main );

    updateSprite();
}

function createPalette(){
    let paletteDiv = createElement( {type: "div", id: "paletteDiv"} );
    let paletteHolder = createElement( {type: "div", id: "paletteHolder"} );
    
    for ( let index = 0; index < colors.length; index++ ){
        let colorDiv = createElement( {type: "div", id: "color"+index, events: [ {type: "click", fn: selectColor} ], classes: [ "colorDiv" ]} );
        colorDiv.style.backgroundColor = colors[index];
        paletteHolder.appendChild( colorDiv );
    }

    paletteDiv.appendChild( paletteHolder );
    paletteDiv.appendChild( createElement( {type:"button", id:"bgButton",   events: [ {type: "click", fn: setBackground} ], text: "Set Background\nto Current Color"} ) );
    paletteDiv.appendChild( createElement( {type:"img",    id:"eraser",     events: [ {type: "click", fn: selectEraser} ], src: "eraser.png", classes: [ "eraser","button" ]} ) );
    document.getElementById( "header" ).appendChild( paletteDiv );
    document.getElementById( "color0" ).classList.add( "selected" );
}

function createTools(){
    let toolboxDiv   = createElement( {type: "div", id: "toolboxDiv"} );
    let brushHolder  = createElement( {type: "div", id: "brushHolder"} );
    let buttonHolder = createElement( {type: "div", id: "buttonHolder"} );
    
    brushHolder.appendChild( createElement( {type: "button",  id: "BrushButton0",  events: [ {type: "click", fn: setBrush} ],      text: "Small\nBrush",  classes: [ "button","selected" ]} ) );
    brushHolder.appendChild( createElement( {type: "button",  id: "BrushButton1",  events: [ {type: "click", fn: setBrush} ],      text: "Medium\nBrush", classes: [ "button" ]} ) );
    brushHolder.appendChild( createElement( {type: "button",  id: "BrushButton2",  events: [ {type: "click", fn: setBrush} ],      text: "Large\nBrush",  classes: [ "button" ]} ) );
    
    buttonHolder.appendChild( createElement( {type: "button", id: "clearButton",   events: [ {type: "click", fn: clearScreen} ],   text: "Clear\nScreen", classes:[ "button" ]} ) );
    buttonHolder.appendChild( createElement( {type: "button", id: "unDoButton",    events: [ {type: "click", fn: unDo} ],          text: "UnDo\nLast", classes: [ "button" ]} ) );
    buttonHolder.appendChild( createElement( {type: "button", id: "unDoAllButton", events: [ {type: "click", fn: unDoAll} ],       text: "UnDo\nAll", classes: [ "button" ]} ) );
    
    toolboxDiv.appendChild( brushHolder );
    toolboxDiv.appendChild( buttonHolder );
    document.getElementById( "paletteDiv" ).appendChild( toolboxDiv );
}

function selectColor(){
    document.querySelectorAll( "#paletteHolder .selected" ).forEach( element => { element.classList.remove( "selected" ) } );
    this.classList.add( "selected" );
    currentColor = this.style.backgroundColor;
    document.getElementById( "paletteDiv" ).classList.remove( "eraseBorder" );
    document.getElementById( "paletteDiv" ).style.borderColor = this.style.backgroundColor;
    document.getElementById( "eraser" ).classList.remove( "selected" );
    erasing = false;
    document.getElementById( "bgButton" ).disabled = false;
}

function selectEraser(){
    document.querySelectorAll( "#paletteHolder .selected" ).forEach( element => { element.classList.remove( "selected" ) } );
    this.classList.add( "selected" );
    erasing = true;
    document.getElementById( "bgButton" ).disabled = true;
    document.getElementById( "paletteDiv" ).style = "";
    document.getElementById( "paletteDiv" ).classList.add( "eraseBorder" );
}

function clearScreen(){ 
    let undoObj = {};

    document.querySelectorAll( ".painted" ).forEach( element => {         
        undoObj[element.id] = {color: element.style.backgroundColor, classes: element.classList.value.replace( " selected","" )}; 
        element.style.backgroundColor = backgroundColor;
        element.classList.remove( "painted" );
        element.classList.add( "background" );
    } ); 
    undoArray.push( undoObj );
    updateSprite();
}

function paintPixel( event ){ 
    applyColor( this ); 
}

function mouseOver( event ){
    displayCursor( this );
    if ( painting ){ 
        applyColor( this ); 
    }
}

function applyColor( pixel ){
    let neighbors = findNearNeighbors( pixel, currentBrush );

    updateUnDo( neighbors );
    neighbors.forEach( n => { 
        n.style.backgroundColor = erasing ? backgroundColor : currentColor;
        if ( !erasing ){
            n.classList.remove( "background" ); 
            n.classList.add( "painted" ); 
        }
        else{
            n.classList.remove( "painted" );
            n.classList.add( "background" );
        }
    } );
    updateSprite();
}

function updateUnDo( neighbors ){
    let undoObj = {};

    neighbors.forEach( n => { undoObj[n.id] = {color: n.style.backgroundColor, classes: n.classList.value.replace( " selected", "" )}; } );
    undoArray.push( undoObj );
}

function unDo(){
    resetUnDoGroup( undoArray.pop() );
    updateSprite();
}

function unDoAll(){
    undoArray.reverse().forEach( undoElement => { resetUnDoGroup( undoElement ); } ); 
    undoArray = [];
    updateSprite();
}

function resetUnDoGroup( group ){
    for ( let key in group ){ 
        document.getElementById( key ).style.background = group[key]["classes"].includes( "background" ) ? backgroundColor : group[key]["color"];
        document.getElementById( key ).classList = group[key]["classes"]; 
    }
}

function setBrush(){
    currentBrush = Number( this.id.replace( "BrushButton","" ) );  
    document.querySelectorAll( "#toolboxDiv .selected" ).forEach( element => { element.classList.remove( "selected" ); } );
    this.classList.add( "selected" );
}

function setBackground(){
    backgroundColor = currentColor;
    document.querySelectorAll( ".background" ).forEach( element => { element.style.backgroundColor = backgroundColor; } );
    updateSprite();
}

function displayCursor( pixel ){
    clearCursor();
    findNearNeighbors( pixel, currentBrush ).forEach( n => { n.classList.add( "selected" ); } );
} 

function clearCursor(){ 
    document.querySelectorAll( "#paintArea .selected" ).forEach( p => { p.classList.remove( "selected" ); } ); 
}

function findNearNeighbors( pixel, dist ){
    let currentPixelX = Number( pixel.id.split( "," )[0] );
    let currentPixelY = Number( pixel.id.split( "," )[1] );
    let neighborList = [];

    if ( dist === 0 ){
        return [pixel];
    }
    else{
        for ( let y = -dist; y <= dist; y++ ){
            for ( let x = -dist; x <= dist; x++ ){
                let possibleNeighbor = document.getElementById( (currentPixelX + x) + "," + (currentPixelY + y) );
                if ( possibleNeighbor ){ 
                    neighborList.push( possibleNeighbor ); 
                }
            }
        }
    }

    return neighborList;
}

function updateSprite(){
    let canvas = document.getElementById( "myCanvas" );
    let ctx = canvas.getContext( "2d" );

    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    for ( let h = 0; h < height; h++ ){
        for ( let w = 0; w < width; w++ ){   
            var check = document.getElementById( w + "," + h ).classList.contains( "background" ) && alphaBackground;
            ctx.fillStyle = document.getElementById( w + "," + h ).style.backgroundColor.replace( "rgb", "rgba" ).replace( ")", check ? ",0)" : ",1)" );
            ctx.fillRect( w * scale, h * scale, scale, scale ); 
        }
    }
}

function saveSprite(){
    let canvas = document.getElementById( "myCanvas" );

    this.href = canvas.toDataURL();
    this.download = "mypainting.png";
}

function createElement( elementInfo ){
    if ( !elementInfo.type ){
        console.log( "ERROR: createElement was not sent a type" );
        return null;
    }
    let element = document.createElement( elementInfo.type );

    if ( elementInfo.id )      { element.id = elementInfo.id; }
    if ( elementInfo.events )  { elementInfo.events.forEach( e => { element.addEventListener( e.type, e.fn ); } ); }
    if ( elementInfo.classes ) { elementInfo.classes.forEach( c => { element.classList.add( c ); } ); }
    if ( elementInfo.text )    { element.innerText = elementInfo.text; }
    if ( elementInfo.src )     { element.src = elementInfo.src; }
    if ( elementInfo.width )   { element.width = elementInfo.width; }
    if ( elementInfo.height )  { element.height = elementInfo.height; }
    if ( elementInfo.href )    { element.href = elementInfo.href; }
    if ( elementInfo.download ){ element.download = elementInfo.download; }

    return element;
}
