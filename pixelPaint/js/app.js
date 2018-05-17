var colors = ["#FFFFFF", "#C0C0C0", "#808080", "#000000",
              "#FF0000", "#800000", "#FFFF00", "#808000",
              "#00FF00", "#008000", "#00FFFF", "#008080",
              "#0000FF", "#000080", "#FF00FF", "#800080"];

var currentColor = "black"; 
var paint = false;
var currentBrush = 0;

function createCanvas(width, height){
    width  = (width  >= 3  ? width  : 3);
    width  = (width  <= 70 ? width  : 70);
    height = (height >= 3  ? height : 3);
    height = (height <= 30 ? height : 30);

    var main = document.createElement("DIV");
    main.id = "main";

    var header = document.createElement("HEADER");
    header.id = "header";

    var headerText = document.createElement("DIV");
    headerText.id = "headerText";
    headerText.innerText = "Pixel Art";
    header.appendChild(headerText);
    main.appendChild(header);

    var paintArea = document.createElement("DIV");
    paintArea.id  = "paintArea";
    paintArea.addEventListener("mouseleave", clearCursor);

    for (let h = 0; h < height; h++) {
        var rowDiv = document.createElement("DIV");
        rowDiv.id = "row"+h.toString();
        rowDiv.classList.add("row");
        for (let w = 0; w < width; w++) {
            var pixelDiv = document.createElement("DIV");
            pixelDiv.id = w.toString() + "," + h.toString();
            pixelDiv.classList.add("pixel");
            pixelDiv.addEventListener("click", paintPixel);
            pixelDiv.addEventListener("mouseover", mouseOver);           
            rowDiv.appendChild(pixelDiv);
        }        
        paintArea.appendChild(rowDiv);
    }
    main.appendChild(paintArea);
    document.getElementsByTagName("body")[0].appendChild(main);
}

function createPalette(){
    var paletteDiv = document.createElement("DIV");
    paletteDiv.id  = "paletteDiv";

    for (let index = 0; index < 16; index++) {
        var colorDiv = document.createElement("DIV");
        colorDiv.id = "color" + index.toString();
        colorDiv.classList.add("colorDiv");
        colorDiv.style.backgroundColor = colors[index];
        colorDiv.addEventListener("click", selectColor);
        if (index === 3) {
            colorDiv.classList.add("selected");
        }
        paletteDiv.appendChild(colorDiv);
    }
    document.getElementById("main").appendChild(paletteDiv);
}

function createTools(){
    var toolboxDiv = document.createElement("DIV");
    toolboxDiv.id  = "toolboxDiv";

    var clearButton = document.createElement("DIV");
    clearButton.id = "clearButton";
    clearButton.addEventListener("click", clearScreen);
    clearButton.innerText = "Clear";

    var smallButton = document.createElement("DIV");
    smallButton.id = "BrushButton0";
    smallButton.addEventListener("click", setBrush);
    smallButton.classList.add("brush");
    smallButton.classList.add("selected");
    smallButton.innerText = "Small";

    var mediumButton = document.createElement("DIV");
    mediumButton.id = "BrushButton1";
    mediumButton.addEventListener("click", setBrush)
    mediumButton.classList.add("brush");
    mediumButton.innerText = "Medium";

    var largeButton = document.createElement("DIV");
    largeButton.id = "BrushButton2";
    largeButton.addEventListener("click", setBrush);
    largeButton.classList.add("brush");
    largeButton.innerText = "Large";

    toolboxDiv.appendChild(clearButton);
    toolboxDiv.appendChild(smallButton);
    toolboxDiv.appendChild(mediumButton);
    toolboxDiv.appendChild(largeButton);
    document.getElementById("main").appendChild(toolboxDiv);
}

function selectColor(){
    document.querySelectorAll(".colorDiv").forEach( element => {  element.classList.remove("selected") });
    this.classList.add("selected");
    currentColor =  this.style.backgroundColor;
}

function paintPixel(event){
    applyColor(this);
}

function mouseOver(event){
    displayCursor(this);
    if (paint){
        applyColor(this);
    }
}

function applyColor(pixel){
    var neighbors = findNearNeighbors(pixel, currentBrush);
    neighbors.forEach( n => { n.style.backgroundColor = currentColor;} )
}

document.body.onmousedown = function() { 
    paint = true;
}

document.body.onmouseup = function() {
    paint = false;
}

function clearScreen(){
    document.querySelectorAll(".pixel").forEach( element => { element.style.backgroundColor = "white"; });
}

function setBrush(){
    currentBrush = Number(this.id.replace("BrushButton",""));  
    document.querySelectorAll(".brush").forEach(element => {element.classList.remove("selected");})
    this.classList.add("selected");
}

function findNearNeighbors(pixel, dist){
    var currentPixelX = Number( pixel.id.split(",")[0] );
    var currentPixelY = Number( pixel.id.split(",")[1] );
    var neighborList = [];

    if (dist === 0){
        neighborList.push(pixel);
        return neighborList;
    }
    else {
        for (let y = -dist; y <= dist; y++){
            for (let x = -dist; x <= dist; x++) {
                var possibleNeighbor = document.getElementById((currentPixelX+x) +","+ (currentPixelY+y));
                if (possibleNeighbor){
                    neighborList.push(possibleNeighbor);
                }
            }
        }
    }
    return neighborList;
}

function displayCursor(pixel){
    clearCursor();
    findNearNeighbors(pixel, currentBrush).forEach( n => { n.classList.add("selected"); });
}

function clearCursor() {
    document.querySelectorAll(".pixel").forEach(  p =>  { p.classList.remove("selected"); });
}

createCanvas(18,7);
createPalette();
createTools();