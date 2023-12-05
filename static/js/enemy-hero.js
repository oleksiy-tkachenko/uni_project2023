let lives;
let pressSize;
class Hero{
    constructor(_currentCell, _mazeSize) {
        this._currentCell = _currentCell
        this._mazeSize = _mazeSize
    }
    Move(direction, cellArray){
        let cellIndex = cellArray.indexOf(this._currentCell)
        document.getElementById(`cell${cellIndex}`).innerHTML= "";
        switch(direction){
            case "up":
                if(document.getElementById(`cell${cellIndex}`).style.borderTop){
                    this._currentCell = cellArray[cellIndex-this._mazeSize]
                }
                break;
            case "down":
                if(document.getElementById(`cell${cellIndex}`).style.borderBottom){
                    this._currentCell = cellArray[cellIndex+this._mazeSize]
                }
                break;
            case "left":
                if(document.getElementById(`cell${cellIndex}`).style.borderLeft){
                    this._currentCell = cellArray[cellIndex-1]
                }
                break;
            case "right":
                if(document.getElementById(`cell${cellIndex}`).style.borderRight){
                    this._currentCell = cellArray[cellIndex+1]
                }
                break;        
        }
        cellIndex = cellArray.indexOf(this._currentCell)
        if(document.getElementById(`cell${cellIndex}`).innerHTML=== '<div style="color: blue ;">E</div>'){
            WinGame();
        } else if(document.getElementById(`cell${cellIndex}`).innerText=== 'M'){
            this.Fight(cellIndex);
            
            
        }
        document.getElementById(`cell${cellIndex}`).innerHTML= '<div style="color: green;">@</div>';
    }
    Fight(cellIndex){
        let killedMonster = monsterArray[document.getElementById(`monster${cellIndex}`).className];
        clearInterval(killedMonster.intervalID)
        document.removeEventListener('keydown', ControlEvent)
        isControlsAdded = false;
        checkPadding = document.getElementById("rhytm-check").style.padding
        checkPadding = Number(checkPadding.replace("%", ""))
        document.getElementById("battleScreen").style.visibility = "visible";
        document.getElementById("rhytm-check").style.visibility = "visible";
        document.getElementById("overlay").style.visibility = "visible";
        setTimeout(SkillCheck, 500)
    }
    get currentCell(){
        return this._currentCell
    }
    set currentCell(_currentCell){
        this._currentCell = _currentCell
    }
}

class Monster{
    constructor(_currentCell, _mazeSize,_monsterID) {
        this._currentCell = _currentCell
        this._mazeSize = _mazeSize
        this._monsterID = _monsterID
    }
    Move(cellArray){
        let direction = randomVector(this._currentCell.x,this._currentCell.y,this._mazeSize)
        let cellIndex = cellArray.indexOf(this._currentCell);
        
        let nextCellIndex;
        switch(direction){
            case "up":
                if(document.getElementById(`cell${cellIndex}`).style.borderTop ){
                    nextCellIndex = cellIndex-this._mazeSize
                    this.CollisionCheck(cellArray, cellIndex, nextCellIndex);
                }
                break;
            case "down":
                if(document.getElementById(`cell${cellIndex}`).style.borderBottom ){
                    nextCellIndex = cellIndex+this._mazeSize
                    this.CollisionCheck(cellArray, cellIndex, nextCellIndex);
                }
                break;
            case "left":
                if(document.getElementById(`cell${cellIndex}`).style.borderLeft ){
                    nextCellIndex = cellIndex-1
                    this.CollisionCheck(cellArray, cellIndex, nextCellIndex);
                }
                break;
            case "right":
                if(document.getElementById(`cell${cellIndex}`).style.borderRight ){
                    nextCellIndex = cellIndex+1
                    this.CollisionCheck(cellArray, cellIndex, nextCellIndex);
                }
                break;        
        }
        
    }
    CollisionCheck(cellArray,cellIndex,nextCellIndex){
        if(document.getElementById(`cell${nextCellIndex}`).innerText!= "M"
        && document.getElementById(`cell${nextCellIndex}`).innerText!= "E"){
            this._currentCell = cellArray[nextCellIndex]
            if(document.getElementById(`cell${nextCellIndex}`).innerText == "@"){
                hero.Fight(cellIndex)
                document.getElementById(`cell${cellIndex}`).innerHTML= "";
                return;
            }
            document.getElementById(`cell${cellIndex}`).innerHTML= "";
            cellIndex = cellArray.indexOf(this._currentCell)
            document.getElementById(`cell${cellIndex}`).innerHTML= `<div style="color: red;"id="monster${cellIndex}" class="${this._monsterID}">M</div>`;
        }

    }
    get currentCell(){
        return this._currentCell
    }
    set currentCell(_currentCell){
        this._currentCell = _currentCell
    }
    get intervalID(){
        return this._intervalID
    }
    set intervalID(_intervalID){
        this._intervalID = _intervalID
    }
}
let startTime;
let pressTime;
let checkPadding;



function SkillCheck(){
    pressSize = 48.4
    document.addEventListener('keydown', FightControl)
    let aboba = setInterval(function battleShrink(){
        checkPadding -= 0.7
        if(checkPadding<=1){
            document.getElementById("rhytm-check").style.visibility="hidden";
            clearInterval(aboba)
            console.log(pressSize)
            if(pressSize <= 18 && pressSize >= 13){
                document.getElementById("rhytm-circle").style.borderColor = "green";
                lives = `${Number(document.getElementById("lives").innerText)}`
            } else {
                document.getElementById("rhytm-circle").style.borderColor = "red";
                lives = `${Number(document.getElementById("lives").innerText)-1}`
                document.getElementById("lives").innerText = lives
            }
            setTimeout(()=>{
                document.addEventListener('keydown', ControlEvent)
                isControlsAdded = true;
                document.getElementById("battleScreen").style.visibility = "hidden";
                document.getElementById("overlay").style.visibility = "hidden";
                document.getElementById("rhytm-check").style.padding = "48.4%";
                document.getElementById("rhytm-circle").style.borderColor = "black";
                if(lives<=0){
                    LoseGame();
                }
            }, 1000)
        }
        document.getElementById("rhytm-check").style.padding = `${checkPadding}%`
    },20)
}
