let kosti = [];
let walks = localStorage.getItem("walks");
let dice = [];
// коммит для миси
//[Начало] Создать игроков 
let countPlayers = +localStorage.getItem('countPlayers');
if(countPlayers == 0){
  //Указать количество игроков
  let countPlayers = prompt('Количество игроков');
  //Создать обекты с игроками
  let objPlayers = {};
  for(i = 1;i <= countPlayers;i++){
    //Добавить имя игрока
    let NamePromt = prompt('Игрок #' + i + 'Как вас величать ?');
    //Создать "количиство X" обектов с свойствами игроков
    objPlayers[`player${i}`] = createPlayers (i,NamePromt,0,inGame = false,barell = false);     
  };
  
  //Делает "строку" из обектов с игроками
  let jsonPlayersString = JSON.stringify(objPlayers);
  //Записывает строку в память 
  localStorage.setItem('players',jsonPlayersString);
  console.log(jsonPlayersString); 
  //Количество всех игроков 
  localStorage.setItem('countPlayers',countPlayers);
  //Ход на даный момент
  localStorage.setItem(`walks`, 1); 
  window.location.reload();
 
};
//бросить 
let brosit = document.querySelector('#brosit');
brosit.addEventListener('click',()=>{
    for(let i = 0;i < 5; i++){
      dice[i] = randomInteger(1,6); //создается случайный масив 
      document.querySelector(`#kub${i + 1}`).innerHTML = dice[i]; //добавляем в кнопки хтмл значение масива
      kosti[i] = document.querySelector(`#kub${i + 1}`); //создаем масив с елементами dom 
       
    }
    console.log(dice);
    console.log(kosti);
    
});

//Сохранить
let save = document.querySelector('#save');
save.addEventListener('click',()=>{
  let setCube = []; //пустой масив для добавления выбраных кубиков
  //Наполняет масив выбраными кубиками
  for(let i = 0;i < 5; i++){
    if(kosti[i].dataset.status == 1){
      setCube.push(kosti[i].innerHTML);
    };        
  };
  let score = arrayFilter(setCube); //Подсчитать очки
  
  //Отвечает за score в памяти
  if(localStorage.getItem('score')){
    let scoreInMemory = +localStorage.getItem('score'); //Очки в памяти
    let scoreResult = +scoreInMemory + +score; //Сложыть очки
    console.log(scoreResult,'//Сложыть очки');
    localStorage.setItem('score', scoreResult); //Записать сложеные очки в память
  }
  else{
    localStorage.setItem('score', score); //Записать очки если null
  }

  //меняет статус кубика с 1 на 2
  for(let i = 0;i < 5; i++){
      kosti[i] = document.querySelector(`#kub${i+1}`);
      if(kosti[i].dataset.status == 1){
        kosti[i].dataset.status = 2;
      };
      //Если все кости в статусе 2 перезагрузка страницы
      if(kosti[0].dataset.status == 2 && kosti[1].dataset.status == 2
          && kosti[2].dataset.status == 2 && kosti[3].dataset.status == 2
          && kosti[4].dataset.status == 2){
          document.location.reload();
      };
    }; 

  //Бочка
  let jsonObjPlayers = JSON.parse(localStorage.getItem('players'));  //достать из памяти (players "JsonString") и сделать обектом
  let calcTotalScore = jsonObjPlayers[`player${localStorage.getItem('walks')}`].score + +localStorage.getItem('score'); //Посчитать общий счет
    //Залез на бочку
  if(calcTotalScore >= 300 && jsonObjPlayers[`player${localStorage.getItem('walks')}`].barell == false){
    jsonObjPlayers[`player${localStorage.getItem('walks')}`].barell = true; //именить бочку "barell" на true
    localStorage.setItem('players',JSON.stringify(jsonObjPlayers)); //сделать json и перезаписать в память
    console.log('на бочке');
  };

    //Выграл или упал с бочки
  if(jsonObjPlayers[`player${localStorage.getItem('walks')}`].barell == true){
    console.log('на бочке true');
  }  
  console.log(calcTotalScore,'Общий счет score и playerScore');
  document.querySelector('#score').innerHTML = score;
  document.querySelector('#countPlayer').innerHTML = jsonObjPlayers[`player${localStorage.getItem('walks')}`].name;
});

//Закончить ход
let finish = document.querySelector('#finish')
finish.addEventListener('click',()=>{
  //достать из памяти (players "JsonString") и сделать обектом
  let jsonObjPlayers = JSON.parse(localStorage.getItem('players'));
  score = +localStorage.getItem(`score`); //Получить очки из памяти счет
  walks = +localStorage.getItem('walks'); //Получить номер игрока

  //Если игрок не в игре
  if(inGame() == false){
    //Если набронно 105 или больше изменить inGame на true
    if(localStorage.getItem('score') >= 105 ){
      //Изменить inGame на true у player[x]
      jsonObjPlayers[`player${localStorage.getItem('walks')}`].inGame = true;
      jsonObjPlayers[`player${localStorage.getItem('walks')}`].score = 105;
      //сделать json и перезаписать в память
      localStorage.setItem('players',JSON.stringify(jsonObjPlayers));
      localStorage.removeItem('score'); //Удалить времяный счет
      alert('Вошли в игру');
      nextPlayer(); //Поменять игрока walks = X  
      document.location.reload(); //перезагрузить страницу
    }else{
      alert('Не хватило очков для входа в игру!');  
      localStorage.removeItem('score'); //Удалить времяный счет
      nextPlayer(); //Поменять игрока walks = X
      document.location.reload(); //перезагрузить страницу
    };
  }
  //Если игрок в игре
  else{
    //изменить счет игрока в обекте (player{x})
    jsonObjPlayers[`player${walks}`].score += score;
    //Сделать обект (JSON 'строкой') и записать в память
    let jsonStringPlayers = localStorage.setItem('players',JSON.stringify(jsonObjPlayers));
    console.log(jsonStringPlayers);
    localStorage.removeItem('score'); //Удалить времяный счет
    nextPlayer(); //Поменять игрока walks = X
    document.location.reload(); //перезагрузить страницу
  };
  document.querySelector('#countPlayer').innerHTML = localStorage.getItem('name');
 });

//Ничего не выпало
let next = document.querySelector("#next");
next.addEventListener('click',()=>{
  localStorage.removeItem('score');
  nextPlayer(); 
  document.location.reload();
});

//изменить статус кубика при нажатие
for(let i = 0;i < 5; i++){
    kosti[i] = document.querySelector(`#kub${i+1}`);
    kosti[i].addEventListener('click',()=>{
    if(kosti[i].dataset.status == 0){
        kosti[i].dataset.status = 1;
    }else if(kosti[i].dataset.status == 1){
        kosti[i].dataset.status = 0;
    }          
});
};

document.querySelector('#score').innerHTML = localStorage.getItem('score');
//Насобирал игрок нужное количество очков или нет? (В игре или нет)
function inGame(){
  //Получить из памяти всех игроков в JSON формате
  let getPlayersFromMemoryInJson = localStorage.getItem('players');
  //спарсить всех игроков и получить всех игроков со свойствами в обект
  let getPlayersFromJson = JSON.parse(getPlayersFromMemoryInJson);

  //Вернуть "true" если в игре или "false" если не в игре 
  return getPlayersFromJson[`player${localStorage.getItem('walks')}`].inGame;
};
console.log(inGame());
//возвращает объект с заполненными параметрами игроков
function createPlayers (id,name,score,inGame,barell){
  return{
    id,
    name,
    score,
    inGame,
    barell,
  }
};

//Переключает игрока NEXT
function nextPlayer(){
  let walks = +localStorage.getItem('walks'); 
  if(walks == countPlayers){
    localStorage.setItem('walks', 1);  
  }else{
    walks += 1;
    localStorage.setItem('walks', walks);
  }
};

//рандом
function randomInteger(min, max) {
  //Cлучайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

//Счетчик очков
function arrayFilter(arrayFilter){
  //Количиство совпадений
  function kubFilter(arrayKub,num){
    let arrayKubFilter = arrayKub.filter(a => a == num);
    return arrayKubFilter.length;
  }
  
    let result = 0;
    // проверки на "1" [?][?][?][?][?]
    if(kubFilter(arrayFilter,1) == 1){
      alert("10");
      result += 10;
    }
    if(kubFilter(arrayFilter,1) == 2){
      alert("20");
      result += 20;
    }
    if(kubFilter(arrayFilter,1) == 3){
      alert("100");
      result += 100;
    }
    if(kubFilter(arrayFilter,1) == 4){
      alert("200");
      result += 200;
    }
    if(kubFilter(arrayFilter,1) == 5){
      alert("1000");
      result += 1000;
    }
    // проверки на "5" [?][?][?][?][?]
    if(kubFilter(arrayFilter,5) == 1){
      alert("5");
      result += 5;
    }
    if(kubFilter(arrayFilter,5) == 2){
      alert("10");
      result += 10;
    }
    if(kubFilter(arrayFilter,5) == 3){
      alert("50");
      result += 50;
    }
    if(kubFilter(arrayFilter,5) == 4){
      alert("100");
      result += 100;
    }
    if(kubFilter(arrayFilter,5) == 5){
      alert("500");
      result += 500;
    }
    // проверки на "2" [?][?][?][?][?]
    if(kubFilter(arrayFilter,2) == 3){
      alert("20");
      result += 20;
    }
    if(kubFilter(arrayFilter,2) == 4){
      alert("40");
      result += 40;
    }
    if(kubFilter(arrayFilter,2) == 5){
      alert("200");
      result += 200;
    }
    // проверки на "3" [?][?][?][?][?]
    if(kubFilter(arrayFilter,3) == 3){
      alert("30");
      result += 30;
    }
    if(kubFilter(arrayFilter,3) == 4){
      alert("60");
      result += 60;
    }
    if(kubFilter(arrayFilter,3) == 5){
      alert("300");
      result += 300;
    }
    // проверки на "4" [?][?][?][?][?]
    if(kubFilter(arrayFilter,4) == 3){
      alert("40");
      result += 40;
    }
    if(kubFilter(arrayFilter,4) == 4){
      alert("80");
      result += 80;
    }
    if(kubFilter(arrayFilter,4) == 5){
      alert("400");
      result += 400;
    }
    // проверки на "6" [?][?][?][?][?]
    if(kubFilter(arrayFilter,6) == 3){
      alert("60");
      result += 60;
    }
    if(kubFilter(arrayFilter,6) == 4){
      alert("120");
      result += 120;
    }
    if(kubFilter(arrayFilter,6) == 5){
      alert("600");
      result += 600; 
    }
    
    //проверка12345
    if (arrayFilter.some(bone => bone == 1) && //Помоги запихнуть это в цыкл
      arrayFilter.some(bone => bone == 2) &&
      arrayFilter.some(bone => bone == 3) &&
      arrayFilter.some(bone => bone == 4) &&
      arrayFilter.some(bone => bone == 5)) {
      result += 150;
    }

    if (arrayFilter.some(bone => bone == 6) && //Помоги запихнуть это в цыкл
      arrayFilter.some(bone => bone == 2) &&
      arrayFilter.some(bone => bone == 3) &&
      arrayFilter.some(bone => bone == 4) &&
      arrayFilter.some(bone => bone == 5)) {
      result += 250;
    }

    let boneStat = {}; //ассоциативный массив значение: сколько раз выпало

    //функция создания boneStat
    function boneCalc(arr) {
      for (let i = 0; i < arr.length; i++) {
       if (boneStat[arr[i]])
         boneStat[arr[i]]++; // если елемент масива повторяется добавляем 1
       else boneStat[arr[i]] = 1;
     }
    }
  
    boneCalc(arrayFilter);
  
    let chance = [];
    for (let key in boneStat) {
      if (boneStat[key] === 2) {
        chance.push(key);
      }
    }
    if (chance.length === 2) {
      for (let i = 0; i < 5; i++) {
        if(kosti[i].dataset.status == 0){
          kosti[i].dataset.status == 0;
        }
        
      }
      alert(chance.join(", "));
    }
      return result;
    }





