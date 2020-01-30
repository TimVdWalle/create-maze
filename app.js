/*********************************************************
 * 
 * INCLUDES / REQUIRES
 * 
*********************************************************/
var UnionFind = require('union-find-js');

/*********************************************************
 * 
 * CONFIG
 * 
*********************************************************/
 var mazeSize = 10;


/*********************************************************
 * 
 * CONSTANTS
 * 
*********************************************************/
 var codeBoth   = "─┼"      // both
 var codeLeft   = " ┼"      // right
 var codeBottom = "─┬"      // bottom
 var codeNone   = " ┌"      // none

 var borderLeft = "├"
 var borderTop  = "─┬"

 var removeTypeBottom   = 1
 var removeTypeRight    = 2
 var removeTypeBoth     = 3


 /*********************************************************
 * 
 * MAIN
 * 
*********************************************************/
console.log('Standalone app to create maze')

console.log("Creating full maze size " + mazeSize + " ...");
var maze = createFullMaze(mazeSize);

console.log("Removing walls in maze...")
maze = removeWalls(maze, mazeSize)
displayMaze(maze, mazeSize)

console.log("")


/*********************************************************
 * 
 * FUNCTIONS
 * 
*********************************************************/
function removeWalls(maze, mazeSize){ 
    uf = new UnionFind(mazeSize * mazeSize);

    // een aantal muren wegdoen in 1 keer, 
    // daarna checken of er een pad is van begin tot eind

    lastPos = calculateUnion(mazeSize-1, mazeSize-1, mazeSize)
    //debug(lastPos)
    var labelFirst = uf.find(0)
    var labelLast = uf.find(lastPos);
    while(labelFirst != labelLast){
        debug(labelFirst + " + " + labelLast)
        displayMaze(maze, mazeSize)

        for(i = 0; i < mazeSize; i++){
            var row = randomIntInc(0, mazeSize-1)
            var col = randomIntInc(0, mazeSize-1)
            var removeType = randomIntInc(1, 2)

            debug(removeType)

            maze = removeWall(maze, row, col, removeType)
            var labelFirst = uf.find(0);
            var labelLast = uf.find(lastPos);
        }
    }

    debug(labelFirst + " + " + labelLast)
    displayMaze(maze, mazeSize)
    

    //debug(label + " + " + label2)

    return maze;
}

function removeWall(maze, row, col, removeType){
    // BOTH
    if(removeType == removeTypeBoth){
        debug("removing both");

        maze = removeWall(maze, row, col, removeTypeBottom)
        maze = removeWall(maze, row, col, removeTypeRight)
    }

    // RIGHT
    if(removeType == removeTypeRight){
        debug("removing right");

        if(maze[row][col] == codeBoth){
            maze[row][col] = codeBottom
        } else if (maze[row][col] == codeBottom){
            maze[row][col] = codeBottom
        }else {
            maze[row][col] = codeNone
        }

        newUnion = calculateNewUnion(row, col, mazeSize, removeTypeRight)
        curUnion = calculateUnion(row, col, mazeSize)
        uf.union(curUnion, newUnion)
        //debug("union " + curUnion + " + " + newUnion)
    }

    // BOTTOM
    if(removeType == removeTypeBottom){
        debug("removing bottom");

        if(maze[row][col] == codeBoth){
            maze[row][col] = codeLeft
        } else if(maze[row][col] == codeLeft){
            maze[row][col] = codeLeft
        }else {
            maze[row][col] = codeNone
        }

        newUnion = calculateNewUnion(row, col, mazeSize, removeTypeBottom)
        curUnion = calculateUnion(row, col, mazeSize)
        uf.union(curUnion, newUnion)
        //debug("union " + curUnion + " + " + newUnion)
    }

    return maze;
}

function calculateNewUnion(row, col, mazeSize, removeType){
    if(removeType == removeTypeRight){
        if(col >= mazeSize-1){
            //debug("right 1")
            return calculateUnion(row, col, mazeSize)
        } else {
            //debug("right 2")
            return calculateUnion(row, col+1, mazeSize)
        }
    }

    if(removeType == removeTypeBottom){
        if(row >= mazeSize-1){
            //debug("bottom 1")
            return calculateUnion(row, col, mazeSize)
        } else {
            //debug("bottom 2")
            return calculateUnion(row+1, col, mazeSize)
        }
    }
}

function calculateUnion(row, col, mazeSize){
    return row * mazeSize + col;
}


 /*********************************************************
 * 
 * HELPER FUNCTIONS
 * 
*********************************************************/
function createFullMaze(mazeSize){
    maze = createArray(mazeSize, mazeSize);
    maze = fillArray(maze, mazeSize);

    return maze;
}

function displayMaze(maze, mazeSize){
    // bovenste rij


    console.log("")
    var row = "   "
    for(r = 0; r<mazeSize; r++){
        row += r + " "
    }
    console.log(row)

    var row = "   "
    for(r = 0; r<mazeSize; r++){
        row += borderTop
    }
    console.log(row)


    row = ""
    for(r = 0; r<mazeSize; r++){
        currentLine = r + " " + borderLeft;
        for(c = 0; c<mazeSize; c++){
            currentLine += maze[r][c]
        }
        console.log(currentLine);
    }

    console.log(row)
}

function debug(str){
    console.log(str);
}

function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
  }

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function fillArray(maze, mazeSize){
    for(r = 0; r<mazeSize; r++){
        for(c = 0; c<mazeSize; c++){
            maze[r][c] = codeBoth;
        }
    }

    return maze;
}

function tests(){

    // hardcoded tests
    //removeWall(maze, 0, 0, removeTypeRight)
    removeWall(maze, mazeSize-1, mazeSize-1, removeTypeRight)
    removeWall(maze, mazeSize-1, mazeSize-2, removeTypeRight)
    removeWall(maze, mazeSize-1, mazeSize-3, removeTypeRight)

    removeWall(maze, mazeSize-2, mazeSize-3, removeTypeBottom)

    removeWall(maze, 5, 5, removeTypeBoth)
    removeWall(maze, 6, 5, removeTypeBottom)
    removeWall(maze, 7, 5, removeTypeRight)
    removeWall(maze, 8, 5, removeTypeRight)
    removeWall(maze, 7, 5, removeTypeBottom)
    removeWall(maze, 8, 6, removeTypeRight)

    removeWall(maze, 4, 5, removeTypeBoth)
    removeWall(maze, 3, 5, removeTypeBoth)
    removeWall(maze, 2, 5, removeTypeBoth)

    removeWall(maze, 2, 4, removeTypeRight)
    removeWall(maze, 2, 3, removeTypeRight)
    removeWall(maze, 2, 2, removeTypeRight)
    removeWall(maze, 2, 1, removeTypeRight)
    removeWall(maze, 2, 0, removeTypeRight)

    removeWall(maze, 1, 0, removeTypeBottom)
    removeWall(maze, 0, 0, removeTypeBottom)
    

    unionPos = calculateUnion(5, 5, mazeSize)
    unionPos2 = calculateUnion(8, 5, mazeSize)

    unionPosLast = calculateUnion(mazeSize-1, mazeSize-1, mazeSize)
    unionPosFirst = calculateUnion(0, 0, mazeSize)
    debug("___")
    debug(uf.find(unionPos))
    debug(uf.find(unionPos2))
    debug("___")
    debug(uf.find(unionPosFirst))
    debug(uf.find(unionPosLast))
    // hardcoded tests einde
}