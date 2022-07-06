let number = prompt('Calcolo somma singole cifre di un numero','Scrivi qui un numero di 4 cifre');

function isNumber (i){
    
    let parInt = parseInt(i);

    if(isNaN(parInt) || parInt === '' || parInt === null){
        return false;
    }
    if(i.length !== 4){
        return false;
    }
    if(i.length > parInt.length){
        return false;
    }

    return parInt;
};

let numSplitted = isNumber(number).toString().split('');
let numArray = numSplitted.map(Number);
let sum = 0;
let result = '';

for (i=0; i<4; i++){
    sum += numArray[i];
    result += numArray[i];
    if(i < 3) result += '+';
};

if (!isNumber(number) || number.length > numArray.length){
    alert('Qualcosa è andato storto, non hai inserito correttamente il numero... riprova');
}else{
    alert(result + '=' + sum);
};

