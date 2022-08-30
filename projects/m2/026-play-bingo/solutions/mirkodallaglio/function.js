//creates n elements inside an html tag. input: containerId: string - the id of the container
//numElem: number - the number of elements to create
//typeElem: OPTIONAL - string - DEFAULT: div - the type of element (p, div, tr, etc ..), 
//attribute: OPTIONAL - string - DEFAULT: id - the attribute of element (id, class), which will have a sequential number
//textAttr: OPTIONAL - string - DEFAULT: sequential number - the text for the attribute. 
//textValue: OPTIONAL - string - the text inside element + sequential number. 
function elementInHTMLContainer (containerId, numElem, typeElem, attribute, textAttr, textValue) {
    if(typeElem === undefined) typeElem = 'div';
    if(attribute === undefined) attribute = 'id';
    for(i=1; i <= numElem; i++){
        const div = document.createElement(typeElem);
        if(textValue !== undefined) {
            let txt = document.createTextNode(textValue + i);
            div.appendChild(txt);
        };
        (textAttr === undefined) ?  div.setAttribute(attribute, i) : div.setAttribute(attribute, textAttr + i);
        document.getElementById(containerId).appendChild(div);
    };
};

//shuffle element in arr
function shuffle (arr){
    const arrLength = arr.length;
    let out = '';
    let casualPos = 0;

    for(i=arrLength-1; i >= 0; i--){
        casualPos = Math.floor(Math.random() * (arrLength - i) + i);
        out = arr.splice(i, 1)[0];
        arr.splice(casualPos, 0,out);
    };
    return arr;
};

//the function generates n random numbers (qta) that are all different in a range (min, max), return an array or undefined if qta > max
function randomNumInRange (min, max, qta){
    let result = [];
    if(qta <= max) {for(i=1; result.length < qta; i++){
            let rndNum = Math.floor(Math.random() * (max - min +1) + min);
            if(!result.includes(rndNum)) result.push(rndNum);
        };
    }else return undefined
    return result;
};


//the function generates a bingo card,input: the maximum extractable number, number of table row - output: object
function bingoCard (max, row){
    const numForLetter = max / 5;
    let card = bingoKeys.reduce((acc, el) => ({ ...acc, [el]: []}), {}); 
    let acc = 0;
    for(value of Object.values(card)){
        value.push(acc+=1, acc+=numForLetter-1);
    };
    const result = {};
    for(prop in card){
        result[prop] = randomNumInRange(...card[prop], row);
    };
    return result;
};

//the function creates a vertical table HTML from an array object, inputs the html ID of the table tag and the object
function createBingoCard (tableId, obj){
    const table = document.getElementById(tableId);
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    for(prop in obj){       //loop to create the th \ tr structure
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(prop));
        thead.appendChild(th);
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
    };
    
    for(value of Object.values(obj)){       //it takes all the values and writes them vertically into the table
        let i = 1;
        value.forEach(el => {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(el));
            td.setAttribute('class', el);
            table.querySelector('tbody tr:nth-child('+i+')').appendChild(td);
            i++;
        });
    };
    return obj;
};

//delete old table and regen a new
function resetBingoCard(){
    table.innerHTML = "";
    cardTmp = createBingoCard('table', bingoCard(maxNumber, numForRow));
};

//looks for a value in an array of objects and replaces it with another
//input: the array of object - the value to look for, the value to replace
function replaceValueInArrObj (arr, search, replace){
    arr.forEach((el) => {
        for(value of Object.values(el)){
            const index = value.indexOf(search);
            if(index === -1) continue;
            else value.splice(index, 1, replace);
        };
    });
};

//look for five verticals, horizontals and diagonals across all bingo tables input:
//originArr: original array ,  arr: array modified with 0 in place of the extracted number
//output: array [index od table, array of all win number or 0 if is bingo, message]
function winnerSearch (originArr, arr){
    let orizzontalArr = [];
    let diagonalArr = [];
    let diagonalOrigin = [];
    let diagonalOrigin2 = [];
    let diagonalArr2 = [];
    let result = [];
    if(maxNumber - numExtraction.length >= 5)  {
        for(i=0; i < numForRow; i++){
            arr.forEach(el => {
                bingoKeys.forEach(ele => orizzontalArr.push(el[ele][i]));
            });
            for(rw = 0; rw < numCard; rw++) {
                if(orizzontalArr.splice(0,5).every(element => element === 0) && !tableWin.ROW) {
                    const rowWin = []
                    for(prop in originArr[rw]) {rowWin.push(originArr[rw][prop][i]);}
                    result.push([rw,rowWin, '!! WIN !! Five- number ROW']);
                };
            };
        };
        arr.forEach((el, index) => {
            let [x, y] = [0,4];
            bingoKeys.forEach(ele =>{
                diagonalArr.push(el[ele][x]);
                diagonalArr2.push(el[ele][y]);
                diagonalOrigin.push(originArr[index][ele][x]);
                diagonalOrigin2.push(originArr[index][ele][y]);
                x++; y--;
                if(el[ele].every((elem) => elem === 0) && !tableWin.COLUMN) {
                    result.push([index, originArr[index][ele],  '!! WIN !! Five-number COLUMN']);
                }
                
            });
            const diagonalWin = diagonalOrigin.splice(0,5);
            if(diagonalArr.splice(0,5).every(element => element === 0) && !tableWin.DIAGONAL) {
                result.push([index,diagonalWin, '!! WIN !! Five- number DIAGONAL']);
            };
            const diagonalWin2 = diagonalOrigin2.splice(0,5);
            if(diagonalArr2.splice(0,5).every(element => element === 0) && !tableWin.DIAGONAL) {
                result.push([index,diagonalWin2, '!! WIN !! Five- number DIAGONAL']);
            };
            
        });
    };
    if(maxNumber - numExtraction.length >= 25){
        arr.forEach((el, index) => {
            let cardSum = Object.values(el)
            .reduce(function(a,b) { return a.concat(b) })
            .reduce(function(a,b) { return a + b }); 
            if(cardSum === 0) result.push([index,cardSum, '!! WIN !! BINGO']);
        });
    };
    return result;
};

//
    


function autoPlay(nGame){
    startExec = performance.now();
    for(play= 0; play < nGame; play++){
        for(prop in tableWin) tableWin[prop] = false;
        
        allCard = [];
        allCardOriginal = [];
        cardTmp = bingoCard(maxNumber,numForRow);
        allCard.push(cardTmp);
        allCardOriginal = JSON.parse(JSON.stringify(allCard));
        numCard = 1;
        numExtraction = JSON.parse(JSON.stringify(shuffle(numberForExt)));

        for(game = 0; game < maxNumber; game++){
            const number = numExtraction.splice(0,1);
            replaceValueInArrObj(allCard,number[0],0);
            const result = winnerSearch(allCardOriginal, allCard);

            if(result.length > 0) result.forEach(el => {
                if (!tableWin.ROW && !tableWin.COLUMN && !tableWin.DIAGONAL){
                    statNCallsFive.push(maxNumber - numExtraction.length)
                };
                for(prop in tableWin){
                    if(!tableWin[prop] && el[2].endsWith(prop)) {
                        tableWin[prop] = true;
                        if(el[1] === 0) {
                            statNCallsBingo.push(maxNumber - numExtraction.length);
                            break;
                        }    
                    };
                };
            }); 
        };
    };
    endExec = performance.now();
};


//finds the minimum, maximum, and average value in an array of numbers
function minMaxAvrg (arr){
    const avg = arr.reduce((a,b) => a + b, 0) / arr.length;
    return [Math.min(...arr), Math.max(...arr), avg];
};

