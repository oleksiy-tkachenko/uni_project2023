let hero;
let cellArray = [];
let monsterArray;
let isControlsAdded = false;
let monsterID;
let mazeGeneratedBefore = false;
function cellToStyle(cell, mazeSize){
    return `id="cell${cell.x+cell.y*mazeSize}" style="border-color: black;\n${cell.cellborders[0] ? "border-top: 1px;\n": ""}${cell.cellborders[1] ? "border-left: 1px;\n": ""}
${cell.cellborders[2] ? "border-right: 1px;\n": ""}${cell.cellborders[3] ? "border-bottom: 1px;\n": ""}"`
}
function ControlEvent(e) {
    switch(e.code) {
        case "KeyW": hero.Move("up", cellArray); break;
        case "KeyS": hero.Move("down", cellArray); break;
        case "KeyA": hero.Move("left", cellArray); break;
        case "KeyD": hero.Move("right", cellArray   ); break;
    }
}
function FightControl(e) {
    switch (e.code){
        case "KeyZ": pressTime = Date.now();document.removeEventListener('keydown', FightControl); break;
    }
}
class Cell{
    constructor(x, y, _isVisited = false){
        this.x = x
        this.y = y
        this._isVisited = _isVisited
        this._cellborders = [false, false, false, false]
    }
    get cellborders(){
        return this._cellborders;
    }
    get isVisited(){
        return this._isVisited;
    }
    set isVisited(a){
        this._isVisited = a;
    }
}
let wasdControls = "";
let exitCell;
function randomVector(x, y, mazeSize){

    let randNumber = Math.random()*4;
    if(randNumber <= 1){
        if (x === 0){
            return randomVector(x,y, mazeSize);
        }
        return "left"
    } else if(randNumber > 1 && randNumber <=2){
        if (y === (mazeSize-1)){
            return randomVector(x, y, mazeSize);
        }
        return "down";
    } else if(randNumber > 2 && randNumber <=3){
        if (x === mazeSize-1){
            return randomVector(x, y, mazeSize);
        }
        return "right";
    } else if(randNumber >3 && randNumber <=4){
        if (y === 0){
            return randomVector(x, y, mazeSize);
        }
        return "up"
    }
        

}


function GetMazeSize(){
    return Number(document.getElementById("mazeSizeOptions").value); //10x10
}

function GenerateMaze(){
    cellArray = [];
    monsterID = 0;
    document.getElementById("gameboard").innerHTML = ""
    document.getElementById("lives").style.visibility = "visible" 
    const gameBoard = [];
    let maxPath = 1;
    let mazeSize = GetMazeSize(); //10x10
    let failedAttemtps = [];
    let nextCell;
    if(mazeGeneratedBefore){
    monsterArray.forEach(element => {
        clearInterval(element.intervalID)
    });
    }
    monsterArray = [];
    for(let i=0; i<mazeSize;i++){
        for(let j=0;j<mazeSize;j++){
            let newCell = new Cell(j,i);
            cellArray.push(newCell);
            
        }
    }
    let currentCell = cellArray[0]; // 0, 0 coordinates
    currentCell.isVisited = true;
    let visitedCells = 1
    let goingOrder =[currentCell];
    let currentPath = 1;
    hero = new Hero(currentCell, mazeSize)
    
    while(visitedCells <= mazeSize*mazeSize-1){
        maxPath = Math.max(maxPath, currentPath)
        if (currentPath == maxPath){
            exitCell = currentCell;
        }
        if (failedAttemtps.length >=4||(failedAttemtps.length >= 3&& (currentCell.y === 0||currentCell.y === mazeSize-1 ||currentCell.x === 0 || currentCell.x ===mazeSize-1))
        || (failedAttemtps.length>=2 && ((currentCell.x === 0 && (currentCell.y === 0||currentCell.y === mazeSize-1)) ||(currentCell.x === mazeSize-1 &&(currentCell.y === 0||currentCell.y === mazeSize-1))))){
            failedAttemtps = [];
            goingOrder.pop();
            currentPath--;
            currentCell = goingOrder[goingOrder.length-1] 
        }
        switch (randomVector(currentCell.x, currentCell.y, mazeSize)){
            case "up":
                if(failedAttemtps.includes("up")){
                    break;
                }
            
                nextCell = cellArray[cellArray.indexOf(currentCell)-mazeSize]; 
                if(nextCell.isVisited === false){
                    currentCell.cellborders[0] = true;
                    currentCell = nextCell;
                    currentCell.cellborders[3] = true;
                    currentCell.isVisited = true;
                    visitedCells++;
                    goingOrder.push(currentCell);
                    failedAttemtps = [];
                    currentPath++
                }else{ 
                    failedAttemtps.push("up");
                }
                break;
            case "right":
                if(failedAttemtps.includes("right")){break;}
            
                nextCell = cellArray[cellArray.indexOf(currentCell)+1]; 
                if(nextCell.isVisited === false){
                    currentCell.cellborders[2] = true;
                    currentCell = nextCell;
                    currentCell.cellborders[1] = true;
                    currentCell.isVisited = true;
                    visitedCells++;
                    goingOrder.push(currentCell);
                    failedAttemtps = [];
                    currentPath++
                } else {
                    failedAttemtps.push("right");
                
                }
                break;
            case "down":
                if(failedAttemtps.includes("down")){break;}
                nextCell = cellArray[cellArray.indexOf(currentCell)+mazeSize]; 
                if(nextCell.isVisited === false){
                    currentCell.cellborders[3] = true;
                    currentCell = nextCell;
                    currentCell.cellborders[0] = true;
                    currentCell.isVisited = true;
                    visitedCells++;
                    goingOrder.push(currentCell);
                    failedAttemtps = [];
                    currentPath++
                } else{
                    failedAttemtps.push("down");
                
                }
                break;
            case "left":
                if(failedAttemtps.includes("left")){break;}
            
                nextCell = cellArray[cellArray.indexOf(currentCell)-1]; 
                if(nextCell.isVisited === false){
                    currentCell.cellborders[1] = true;
                    currentCell = nextCell;
                    currentCell.cellborders[2] = true;
                    currentCell.isVisited = true;
                    visitedCells++;
                    goingOrder.push(currentCell);
                    failedAttemtps = [];
                    currentPath++
                }else{ 
                    failedAttemtps.push("left");
                
                }
                break;    
        }    
    }
    if (currentPath-1 == maxPath){
        exitCell = currentCell;
    }
    for(let i=0; i<mazeSize;i++){
        for(let j=0;j<mazeSize;j++){
            document.getElementById("gameboard").innerHTML += `<div ${cellToStyle(cellArray[i*mazeSize+j],mazeSize)} class=\"box\"></div>`;
            SpawnMonster(cellArray,cellArray[i*mazeSize+j],mazeSize, exitCell)
        }
    }
    document.getElementById("lives").innerText = `${mazeSize/5+1}`
    document.getElementById("gameboard").style.gridTemplateColumns = `repeat(${mazeSize}, 50px)`
    document.getElementById("gameboard").style.gridTemplateRows = `repeat(${mazeSize}, 50px)`
    document.getElementById(`cell${cellArray.indexOf(hero.currentCell)}`).innerHTML += '<div style="color: green;">@</div>';
    document.getElementById(`cell${cellArray.indexOf(exitCell)}`).innerHTML += '<div style="color: blue ;">E</div>';
    if (!isControlsAdded) {
        wasdControls = document.addEventListener('keydown', ControlEvent);
        isControlsAdded = true;
    }
    mazeGeneratedBefore = true;
}
function WinGame(){
    document.removeEventListener('keydown', ControlEvent);
    isControlsAdded = false;
    document.getElementById("overlay").style.visibility = "visible";
    document.getElementById("winMsg").style.visibility = "visible";
    monsterArray.forEach(element => {
        clearInterval(element.intervalID)
    });
}
function LoseGame(){
    document.removeEventListener('keydown', ControlEvent);
    isControlsAdded = false;
    document.getElementById("overlay").style.visibility = "visible";
    document.getElementById("loseMsg").style.visibility = "visible";
    monsterArray.forEach(element => {
        clearInterval(element.intervalID)
    });
}
function Restart(){
    document.getElementById("overlay").style.visibility = "hidden";
    document.getElementById("winMsg").style.visibility = "hidden";
    document.getElementById("loseMsg").style.visibility = "hidden";
    GenerateMaze();
}
let chanceToSpawn = 10;
function SpawnMonster(cellArray,currentCell, mazeSize, _exitCell){
    let spawnRoll = Math.floor(Math.random()*100)+1
    if (spawnRoll <= chanceToSpawn && currentCell != _exitCell && currentCell != hero.currentCell){
        let cellIndex = currentCell.x+currentCell.y*mazeSize
        document.getElementById(`cell${cellIndex}`).innerHTML += `<div style="color: red;"id="monster${cellIndex}" class="${monsterID}">M</div>`;
        monsterArray.push(new Monster(currentCell, mazeSize, monsterID))
        monsterArray[monsterID].intervalID = setInterval(monsterArray[monsterID].Move.bind(monsterArray[monsterID]), 1000, cellArray)
        console.log(monsterArray[monsterID].currentCell)
        monsterID++; 
        chanceToSpawn = 5;
    } else {
        chanceToSpawn = Math.floor(chanceToSpawn + 25/(mazeSize*2));
    }
}