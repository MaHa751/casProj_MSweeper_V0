//*** Global Variables ***
var timer;
var maxVal;
var lost;
var size;
var mineCnt;
var fieldCnt2Win = 0;
var fieldCnt2WinMax;
var mineCountF = document.getElementById("mineCount");
var inpSizeF = document.getElementById("inputSize");
var stopB = document.getElementById("stopGameButton");

const picCellMineClick = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_clicked_mineFound.gif";
const picCellMine = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_mineFound.gif";
const picCell0 = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_clicked_0.gif";
const picCellx = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_clicked_";
const picCell = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_notClicked.gif";
const picCellFlag = "https://raw.githubusercontent.com/MaHa751/casProj_MSweeper/master/pics/cell_marked.gif";

const picLost = "http://martinadenardi.it/wp-content/uploads/2015/02/Facebook-Emoticons-TuttArt@-21-300x295.jpg";
// ***********************

//create Array with Mines
function getMineArr(qty) {
    var retArr = [];
    var minesCheckArr = [];
    //Prefill Array
    for (var k = 0; k < maxVal + 1; k += 1) {
        minesCheckArr[k] = [];
        for (var l = 0; l < maxVal + 1; l += 1) {
            minesCheckArr[k][l] = false;
        }
    }

    var cnt = 0;
    var r1 = 0;
    var r2 = 0;

    //Fill Mines into Array
    while (cnt < qty) {
        r1 = Math.round(Math.random() * Math.floor(maxVal));
        r2 = Math.round(Math.random() * Math.floor(maxVal));
        //console.log("R1: " + r1 + " R2: " + r2);
        if (minesCheckArr[r1][r2] === false) {
            minesCheckArr[r1][r2] = 0;
            cnt++;
        }
    }

    //Calculate MineCount in Neighbourhood
    for (k = 0; k < maxVal + 1; k += 1) {
        for (var l = 0; l < maxVal + 1; l += 1) {
            var mineSum = 0;
            if (minesCheckArr[k][l] !== 0) {
                for (var b = Math.max(k - 1, 0); b < Math.min(k + 2, maxVal + 1); b += 1) {
                    for (var v = Math.max(l - 1, 0); v < Math.min(l + 2, maxVal + 1); v += 1) {
                        if (minesCheckArr[b][v] === 0) mineSum++;
                    }
                }
                if (mineSum !== 0) {
                    minesCheckArr[k][l] = mineSum;
                } else { minesCheckArr[k][l] = "" }
            }
        }
    }
    //console.log(minesCheckArr);
    return minesCheckArr;
}

function randomPresettings() {
    //Fieldsize
    var inpSizeMaxVal=document.getElementById("inputSize").max;
    var fieldSizeRandom = Math.max(Math.round(Math.random() * Math.floor(inpSizeMaxVal-2)),2);

    //Minecount
    var mineCountRandom = Math.max(Math.round(Math.random() * Math.floor(0.3*Math.pow(fieldSizeRandom,2) - 1)),1);

    document.getElementById("inputSize").value = fieldSizeRandom;
    document.getElementById("mineCount").value = mineCountRandom;

    startGame();
}


//Check if the user-input is correct
function checkInput() {
    size = document.getElementById("inputSize").value;
    mineCnt = document.getElementById("mineCount").value;

    if (size > 0 && mineCnt > 0 && mineCnt < Math.pow(size, 2)) {
        var mines = [];
        maxVal = size - 1;
        mines = getMineArr(mineCnt);
        createGame(mines);
    } else {
        alert("Fehlerhafte Eingabe.")
    }
}

function startGame() {
    document.getElementById("msg2User").innerHTML = "";
    document.getElementById("msg2User").style.display = "none";

    checkInput();
}

//Check if you fit a mine
function checkMine(fieldID, mines) {
    var fieldIDStr = fieldID;
    var fieldIDArr = fieldIDStr.split("_");
    var x = fieldIDArr[1] * 1;
    var y = fieldIDArr[2] * 1;

    //console.log("x: " + x);
    //console.log("y: " + y);
    //console.log(mines);

    if (mines[x][y] === 0) {
        return true;
    } else if (mines[x][y] === "") {
        return false;
    } else {
        return mines[x][y];
    }
}

//Game lost -> Show all mines
function showAllMines(mines, withoutID) {
    for (var i = 0; i < mines.length; i += 1) {
        for (var j = 0; j < mines[i].length; j += 1) {
            if (withoutID !== "b_" + i + "_" + j) {
                if (mines[i][j] === 0) {
                    document.getElementById("b_" + i + "_" + j).src = picCellMine;
                } else if (mines[i][j] == "") {
                    document.getElementById("b_" + i + "_" + j).src = picCell0;
                } else {
                    var checkMineRet = checkMine("b_" + i + "_" + j, mines);
                    document.getElementById("b_" + i + "_" + j).src = picCellx + checkMineRet + ".gif";
                }
            }
        }
    }
    document.getElementById("msg2User").innerHTML = "Leider verloren!  :(  Nächster Versuch?";
    document.getElementById("msg2User").style.display = "inline-block";
    stopGame();
}

//you fit an empty space
function showAllEmptySpace(mines, fieldID2) {
    var fieldIDStr2 = fieldID2;
    var fieldIDArr2 = fieldIDStr2.split("_");
    var i = fieldIDArr2[1] * 1;     //Row
    var j = fieldIDArr2[2] * 1;     //Col

    for (var s = Math.max(j - 1, 0); s <= Math.min(j + 1, maxVal); s += 1) {
        for (var z = Math.max(i - 1, 0); z <= Math.min(i + 1, maxVal); z += 1) {
            if (s !== j || z !== i) {
                var newCheckField = "b_" + z + "_" + s;
                var pic = document.getElementById(newCheckField).src;
                if (pic == picCell) {
                    if (mines[z][s] == "") {
                        document.getElementById(newCheckField).src = picCell0;
                        fieldCnt2Win++;
                        if (fieldCnt2Win == fieldCnt2WinMax) gameWon();
                        showAllEmptySpace(mines, newCheckField);
                    } else if (mines[z][s] !== 0) {
                        var checkMineRet = checkMine(newCheckField, mines);
                        document.getElementById(newCheckField).src = picCellx + checkMineRet + ".gif";
                        fieldCnt2Win++;
                        if (fieldCnt2Win == fieldCnt2WinMax) gameWon();
                    }
                }
            }
        }
    }
}


//Show Timer while playing
function startTimer() {
    var time = 0;
    document.getElementById('labelForTimer').innerHTML = "Timer: ";
    timer = setInterval(function () {
        time++;
        document.getElementById("timer").innerHTML = time + " Sek.";
    }, 1000);
    return timer;
}

//stop the running game
function stopGame() {
    clearInterval(timer);
    document.getElementById("createGameButton").innerHTML = "Start";
    stopB.disabled = true;
    mineCountF.disabled=false;
    inpSizeF.disabled=false;
}

function gameWon() {
    document.getElementById("msg2User").innerHTML = "Gewonnen!  :)  Herzlichen Glückwunsch!";
    document.getElementById("msg2User").style.display = "inline-block";
    stopGame();
}

//Create a new Game
function createGame(mines) {

    var lost = false;
    fieldCnt2Win=0;
    var tBody = document.getElementById("gameTable");
    var line = [];
    fieldCnt2WinMax = size * size - mineCnt;    //How many fields must be clicked to win without hitting a mine

    //Stop and delete prior games
    stopGame();
    document.getElementById("gameTable").innerHTML = "";

    stopB.disabled = false;
    mineCountF.disabled = true;
    inpSizeF.disabled = true;

    document.getElementById("createGameButton").innerHTML = "Neustart";

    for (var i = 0; i < size; i += 1) {
        line[i] = document.createElement("tr");
    }

    for (var i = 0; i < size; i += 1) {
        for (var j = 0; j < size; j += 1) {
            line[i].appendChild(document.createElement("td")).appendChild(document.createElement("img"));
            line[i].children[j].children[0].src = picCell;
            line[i].children[j].children[0].id = "b_" + i + "_" + j;
            line[i].children[j].children[0].className = "buttonFieldClass";
            line[i].children[j].children[0].addEventListener("click", function (ev) {
                //console.log(this.id);
                ev.preventDefault();
                var checkMineRet = checkMine(this.id, mines);
                if (lost === false) {
                    if (checkMineRet === true) {
                        document.getElementById(this.id).src = picCellMineClick;
                        showAllMines(mines, this.id);
                        clearInterval(timer);   //Stop Timer
                        lost = true;
                    } else if (checkMineRet == "") {
                        document.getElementById(this.id).src = picCell0;
                        fieldCnt2Win++;
                        if (fieldCnt2Win == fieldCnt2WinMax) gameWon();
                        showAllEmptySpace(mines, this.id);
                    } else {
                        document.getElementById(this.id).src = (picCellx + checkMineRet + ".gif");
                        fieldCnt2Win++;
                        if (fieldCnt2Win == fieldCnt2WinMax) gameWon();
                    }
                }
            })
            line[i].children[j].children[0].addEventListener("contextmenu", function (ev) {
                ev.preventDefault();
                if (document.getElementById(this.id).src == picCell) {
                    document.getElementById(this.id).src = picCellFlag;
                } else if (document.getElementById(this.id).src == picCellFlag) {
                    document.getElementById(this.id).src = picCell
                }
                return false;
            });

            //console.log("i= " + i, "j= " + j)
        }

        tBody.appendChild(line[i]);
    }

    startTimer();

    //console.log("Minen [0][0]: " + mines[0][0]);
}

document.getElementById("inputSize").focus();
document.getElementById("mineCount").addEventListener("keypress", function (ev) {
    if (ev.key == "Enter") {
        ev.preventDefault();
        startGame();
    };
})
document.getElementById("createGameButton").addEventListener("click", startGame);
document.getElementById("stopGameButton").addEventListener("click", stopGame);
document.getElementById("randomGameButton").addEventListener("click", randomPresettings);