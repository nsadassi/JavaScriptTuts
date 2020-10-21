console.log('Hello World !');

function ageInDays(){
    if(document.getElementById('ageInDays'))reset();
    let dob = prompt('Enter your Date of Birth (MM/DD/YYYY)');
    let diffInDays = null;

    if(dob==""){
        diffInDays = 0;
    }
    else{
        var dobDate = new Date(dob);
        var today = new Date();
        var toDate = new Date((today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear());

        let difInTime = today.getTime() - dobDate.getTime();
        diffInDays = parseInt(difInTime / (1000 * 3600 * 24), 10);
    }

    var createH1 = document.createElement("h1");
    var textResponse = document.createTextNode('You are '+ diffInDays + ' days old !');

    createH1.setAttribute('id', 'ageInDays');
    createH1.appendChild(textResponse);
    document.getElementById('result').appendChild(createH1);
}

function reset(){
    if(document.getElementById('ageInDays')){
        document.getElementById('ageInDays').remove();
    }
}

function generateCat(){
    var createImg = document.createElement('img');
    var imgContainer = document.getElementById('image-div');
    createImg.src = "https://thecatapi.com/api/images/get?format=src&type=gif&size=small";
    imgContainer.appendChild(createImg);
}
//<img src="https://thecatapi.com/api/images/get?format=src&type=gif&size=small">

function resetCats(){
    location.reload();
}

function rpsgame(userChoice){
    var humanChoice = userChoice.id;
    var botChoice = botRandomChoice();

    result = decideWinner(humanChoice, botChoice);
    
    var message = resultMessage(result);

    rpsFrontEnd(humanChoice, botChoice, message);
}

function botRandomChoice(){
    return ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
}

function decideWinner(humanChoice, botChoice){
    rpsDecisions = {
        'rock' : {'rock' : 0.5, 'paper' : 0, 'scissors' : 1},
        'paper' : {'rock' : 1, 'paper' : 0.5, 'scissors' : 0},
        'scissors' : {'rock' : 0, 'paper' : 1, 'scissors' : 0.5}
    }

    var result = rpsDecisions[humanChoice][botChoice];
    return [result, Math.abs(1-result)];
}

function resultMessage(result){
    if(result[0] === result[1]) return {"message" : "Its a Draw.", "color" : 'black'};
    else return result[0] > result[1] ? {"message" : "You Won !", "color" : '#9ed667'} : {"message" : "You Lost.", "color" : '#DC4A4A'};
}

function rpsFrontEnd(humanChoice, botChoice, message){
    var imageBase = {
        'rock' : document.getElementById('rock').src,
        'paper' : document.getElementById('paper').src,
        'scissors' : document.getElementById('scissors').src
    }
    document.getElementById('rock').remove();
    document.getElementById('scissors').remove();
    document.getElementById('paper').remove();

    var humanDiv = document.createElement('div');
    var botDiv = document.createElement('div');
    var messageDiv = document.createElement('div');

    humanDiv.innerHTML = "<img src='"+imageBase[humanChoice]+"' height='150' width='150' style='box-shadow: 10px 20px 39px 0px rgba(0,0,0,0.56)'>";
    botDiv.innerHTML = "<img src='"+imageBase[botChoice]+"' height='150' width='150' style='box-shadow: 10px 20px 39px 0px rgba(0,0,0,0.56)'>";
    messageDiv.innerHTML = "<h2  style='color :"+message['color']+"'>"+message['message']+ "</h2> <button class='btn btn-secondary' id='cat-resetor' onclick='resetCats()'>Reset</button>";

    document.getElementById('flex-box-rps-div').appendChild(humanDiv);
    document.getElementById('flex-box-rps-div').appendChild(messageDiv);
    document.getElementById('flex-box-rps-div').appendChild(botDiv);
}

var allButtons = [] //document.getElementsByTagName('button');
var originalClassCopy = [];
// for(let i=0;i<allButtons.length;i++){
//     originalClassCopy.push(allButtons[i].classList[1]);
// }

function changeButtonColor(option){
    allButtons = document.getElementsByTagName('button');
    for(let i=0;i<allButtons.length;i++){
        originalClassCopy.push(allButtons[i].classList[1]);
    }
    if(option.value==='red' || option.value==='green'){
        changeRedOrGreen(option.value);
    }
    else if(option.value==='random'){
        changeRandom();
    }
    else{
        resetButtons();
    }
}

function changeRedOrGreen(optionColor){
    var setColor = optionColor==='red' ? 'btn-danger' : 'btn-success';
    for(let i=0;i<allButtons.length;i++){
        allButtons[i].classList.remove(allButtons[i].classList[1]);
        allButtons[i].classList.add(setColor);
    }
}

function resetButtons(){
    for(let i=0;i<allButtons.length;i++){
        allButtons[i].classList.remove(allButtons[i].classList[1]);
        allButtons[i].classList.add(originalClassCopy[i]);
    }
}

function changeRandom(){
    var choices = ['btn-danger', 'btn-warning', 'btn-primary', 'btn-success']
    for(let i=0;i<allButtons.length;i++){
        allButtons[i].classList.remove(allButtons[i].classList[1]);
        allButtons[i].classList.add(originalClassCopy[Math.floor(Math.random() * 4)]);
    }
}

document.querySelector('#blackjack-hit').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-deal').addEventListener('click', blackjackDeal);

let blackjackGame = {
    'humanData' : {'humanScore' : '#human-blackjack-current-score', 'div' : '#human-box', 'score' : 0},
    'botData' : {'botScore' : '#dealer-blackjack-current-score', 'div' : '#dealer-box', 'score' : 0},
    'cardsNumbers' : ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A',],
    'cardShapes' : ['C', 'S', 'D', 'H'],
    'cardMap' : {'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'K':10, 'Q':10, 'J':10, 'A':[1, 11] },
};


const HUMAN = blackjackGame['humanData'];
const DEALER = blackjackGame['botData'];

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const loseSound = new Audio('static/sounds/aww.mp3');



function blackjackHit(){
    let newCard = randomCardSelector();
    showCard(HUMAN, newCard);
}

function showCard(player, card){
    let cardImage = document.createElement('img');
    cardImage.src = `static/images/${card}.png`;
    cardImage.setAttribute('width', '85px');
    cardImage.setAttribute('height', '120px');

    document.querySelector(player['div']).appendChild(cardImage);
    hitSound.play();
}

function blackjackDeal(){
    let playerImages = document.querySelector('#human-box').querySelectorAll('img');
    let botImages = document.querySelector('#dealer-box').querySelectorAll('img');

    for(var i=0;i<playerImages.length;i++){
        playerImages[i].remove();
    }

    for(var i=0;i<botImages.length;i++){
        botImages[i].remove();
    }
}

function randomCardSelector(){
    let cardNo = blackjackGame['cardsNumbers'][Math.floor(Math.random()*13)];
    let cardShape = blackjackGame['cardShapes'][Math.floor(Math.random()*4)];
    return ''+cardNo+cardShape;
}

function updateScore(card, player){
    let cardval = card.substring(0, card.length - 1);
    player['score'] += blackjackGame['cardMap'][cardval];

}

function showScore(player){
    document.querySelector(player['human-blackjack-current-score']).textContent = "";
}