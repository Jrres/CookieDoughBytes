const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  INTRO: 5,
  
};
class background{
  constructor(){
    this.position={
      x:0,y:0,
    }
  this.getbg = document.getElementById('backgroundimage');
  this.getintro = document.getElementById('introid');
  }
}
class Paddle {
  constructor(game) {
    this.gameWidth = game.gameWidth;

    this.width = 150;
    this.height = 20;

    this.maxSpeed = 7;
    this.speed = 0;
    this.speedY=0;

    this.position = {
      x: game.gameWidth / 2 - this.width / 2,
      y: game.gameHeight - this.height - 10
    };
  }
  reset(){
    this.position = {
      x: game.gameWidth / 2 - this.width / 2,
      y: game.gameHeight - this.height - 10
    };
  }
  moveforward(){
    this.speedY= this.maxSpeed;
  }
  moveBackward(){
    this.speedY= -this.maxSpeed;
  }

  moveLeft() {
    this.speed = -this.maxSpeed;
  }

  moveRight() {
    this.speed = this.maxSpeed;
  }

  stop() {
    this.speed = 0;
    this.speedY=0;
  }
  reset(){
    this.position = {
      x: game.gameWidth / 2 - this.width / 2,
      y: game.gameHeight - this.height - 10
    };
}

  draw(ctx) {
    ctx.fillStyle = "#0ff";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(deltaTime) {
    this.position.x += this.speed;
    this.position.y += this.speedY;//changed y direction
    if (this.position.x < 0) this.position.x = 0;

    if (this.position.x + this.width > this.gameWidth)
      this.position.x = this.gameWidth - this.width;
  }
}
//bat
  class Bat {
  constructor(game) {
    this.image = document.getElementById("img_bat");

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.friction = .99;
    this.game = game;
    this.size = 50;
    this.reset();
  }

  reset() {
    let inc= 4;
    this.position = { x: Math.round(Math.random()*(15)+120), y: 400 };
    this.speed = { x: inc, y: -inc };
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  update(deltaTime) {
    this.position.x += this.speed.x*this.friction;
    this.position.y += this.speed.y*this.friction;

    // wall on left or right
    if (this.position.x + this.size > this.gameWidth || this.position.x < 0) {
      this.speed.x = -this.speed.x;
    }

    // wall on top
    if (this.position.y < 0) {
      this.speed.y = -this.speed.y;
    }

    // bottom of game
    if (this.position.y + this.size > this.gameHeight) {
      this.game.lives--;
      this.reset();
    }

    if (detectCollision(this, this.game.paddle)) {
      this.speed.y = -this.speed.y;
      this.position.y = this.game.paddle.position.y - this.size;
    }
  }
}


function detectCollision(bat, gameObject) {
  let bottomOfbat = bat.position.y + bat.size;
  let topOfbat = bat.position.y;

  let topOfObject = gameObject.position.y;
  let leftSideOfObject = gameObject.position.x;
  let rightSideOfObject = gameObject.position.x + gameObject.width;
  let bottomOfObject = gameObject.position.y + gameObject.height;

  if (
    bottomOfbat >= topOfObject &&
    topOfbat <= bottomOfObject &&
    bat.position.x >= leftSideOfObject &&
    bat.position.x + bat.size <= rightSideOfObject
  ) {
    return true;
  } else {
    return false;
  }
}

//paddle


//levels
function buildLevel(game, level) {//ISSUEsssss---------------------------------<
  let bricks = [];

  level.forEach((row, rowIndex) => {
    row.forEach((brick, brickIndex) => {
      if (brick === 1) {
        let position = {
          x: 23 * brickIndex,
          y: 40 + 24 * rowIndex
        };
        bricks.push(new Brick(game, position))
      }
    });
  });
  return bricks;
}
class LevelCreate{//level builder
  constructor(){
 this.level = [];
this.level.length = Math.round(Math.random()*(16) + 20);
  for(let rows = 0;rows<7;rows++){
     this.level[rows] = [];
    for(let cols = 0;cols<this.level.length;cols++){
      this.level[rows][cols]=Math.round(Math.random());
    }
  }
}
}

class Brick {
  constructor(game, position) {
    this.image = document.getElementById("img_purpstone");

    this.game = game;

    this.position = position;
    this.width = 60;
    this.height = 60;

    this.markedForDeletion = false;
    
    
    this.pop=false; 
    this.radius = {//blast radius
      x: this.position.x*3,
      y:this.position.y*3,
    }
  }
  update() {
    if (detectCollision(this.game.bat, this)) {
      this.game.bat.speed.y = -this.game.bat.speed.y;

      this.markedForDeletion = true;
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

class InputHandler {
  constructor(paddle, game) {
    document.addEventListener("keydown", event => {
      switch (event.keyCode) {
        case 37:
          paddle.moveLeft();
          break;

        case 39:
          paddle.moveRight();
          break;

        case 27:
          game.togglePause();
          break;

        case 32:
          game.start();
          break;

        case 40://w
          paddle.moveforward();
          break;

        case 38: 
          paddle.moveBackward();
          break;
      }
    });

    document.addEventListener("keyup", event => {
      switch (event.keyCode) {
        case 37://<
          if (paddle.speed < 0 || paddle.speedY< 0 ) 
          paddle.stop();
          break;

        case 39://>
          if (paddle.speed > 0  || paddle.speedY> 0) 
          paddle.stop();
          break;

        case 40://w
          if (paddle.speedY > 0 ||  paddle.speed > 0)
          paddle.stop();
          break;

        case 38: 
          if (paddle.speedY < 0 || paddle.speed < 0) 
          paddle.stop();
          break;
      }
    });
  }
}
class Game {

  constructor(gameWidth, gameHeight, bricksPerRow) {
    this.delcount =0;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.background = new background();
    this.gamestate = GAMESTATE.MENU;
    this.bat = new Bat(this);
    this.paddle = new Paddle(this);
    this.sizeof =0; 
    this.gameObjects = [];
    this.bricks = [];
    this.lives = 3;
    this.imagehearts = document.getElementById("hearts");
    this.levels = [new LevelCreate()];
    this.currentLevel = 0;
    this.currentlives=3;
    this.timer =0;
    this.delay=false;
    var indice=0;

    new InputHandler(this.paddle, this);
  }

  
  start() {//before game runs do an intro duction scene 
    if(this.currentLevel===0){
    var audio = new Audio('song.mp3');
    audio.volume = 0.2;
    audio.currentTime=14;
    audio.play();
    }
    if(this.gamestate===GAMESTATE.GAMEOVER){

    audio.currentTime = 0;
    }
    if (
      this.gamestate !== GAMESTATE.MENU &&
      this.gamestate !== GAMESTATE.NEWLEVEL
    )
      return;

      this.bricks = buildLevel(this, this.levels[this.currentLevel].level);
 //levels arr right HEEEEERRRRRREEEEE
    this.sizeof = this.bricks.length;
    this.match = Math.round(Math.random()*(20)+5);


    this.bat.reset();
 
    this.gameObjects = [this.bat, this.paddle];   
    this.background;
    if(this.currentLevel===0){
    this.gamestate = GAMESTATE.INTRO;
    setTimeout(() => {  this.gamestate = GAMESTATE.RUNNING;}, 2000);  
     } else 
    this.gamestate = GAMESTATE.RUNNING;
  }
  update(deltaTime) {
    if (this.lives === 0) this.gamestate = GAMESTATE.GAMEOVER;

    if (
      this.gamestate === GAMESTATE.PAUSED ||
      this.gamestate === GAMESTATE.MENU ||
      this.gamestate === GAMESTATE.GAMEOVER ||
      this.gamestate === GAMESTATE.INTRO
    )
      return;
    
    if (this.bricks.length === 0) {
      this.currentLevel++;
      this.gamestate = GAMESTATE.NEWLEVEL;
      this.levels.push(new LevelCreate());
      this.bricks = buildLevel(this, this.levels[this.currentLevel].level);
      this.paddle.reset();
      this.start();
    }

    [...this.gameObjects, ...this.bricks].forEach(object =>
      object.update(deltaTime)
    );
    
    this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);
  
      if(this.bricks.length< this.sizeof)
      this.delcount=this.sizeof-this.bricks.length;
    

    if( this.delcount%this.match ==0 && this.delcount !=0){

    this.bricks = this.bricks.splice(Math.round(Math.random()*+5),Math.round(Math.random()*(10)+3)); //splice(location to remove or add, num eles removed, what replacements(optional) can be any new obj?)
   
   
  }//blow up animation effect
  }
  draw(ctx) {
    ctx.drawImage(
      this.background.getbg,
      this.background.position.x,
      this.background.position.y,
      800,
      800,
    );
    [...this.gameObjects, ...this.bricks].forEach(object => object.draw(ctx));
    var str = "Level \n"+this.currentLevel ;
    var bricksline = "Cookies = " + this.bricks.length;
    var lives = "Lives = " + this.lives;


      if(this.lives!=this.currentlives){
        this.currentlives=this.lives;
        for( let i =10;i>0;i--){
    
        ctx.fillStyle = "rgba(255,0,0,0.5)";
        }
        for( let i =0;i<10;i++){
  
          ctx.fillStyle = "rgba(255,0,0,0.5)";
          }
        ctx.fill();
      }
    for(let i =0;i<this.lives;i++){
    ctx.drawImage(
      this.imagehearts,
      0+i*80,
      0,
      200,
      100
    );
    }
    ctx.fillText(bricksline, this.gameWidth -80, this.gameHeight-20);
    ctx.fillText(str, this.gameWidth -87, this.gameHeight);
    ctx.fillText(lives, this.gameWidth -79, this.gameHeight-40);

    if(this.currentLevel!=0){

      ctx.drawImage(
        this.imagehearts,
        this.gameHeight/2,
        this.gameWidth,
        100,
        100
      );
    }

    if(this.gamestate == GAMESTATE.INTRO){
      ctx.drawImage(
        this.background.getintro,
        this.background.position.x,
        this.background.position.y,
        1980,
        1080,
      );
      ctx.drawImage(
        this.bat.image,
        this.gameHeight/2,
        this.gameWidth/2,
        200,
        200
      );
      ctx.fillStyle = "rgba(200,105,30,.2)";
      ctx.fill();
      ctx.font = "20px verdana";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText("This is Mr steal ya Cookies", this.gameWidth / 2, this.gameHeight / 2);
      ctx.fillText("Dont let him take all your nutritious and delicious snacks", this.gameWidth / 2, (this.gameHeight +50)/ 2);
      ctx.fillText("and launch his ass back to his cookies", this.gameWidth / 2, (this.gameHeight +100)/ 2);
      
    
    }
    if (this.gamestate === GAMESTATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
    }

    if (this.gamestate === GAMESTATE.MENU) {//start game 
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(
        "Press SPACEBAR To Start",
        this.gameWidth / 2,
        this.gameHeight / 2
      );
    }
    if (this.gamestate === GAMESTATE.GAMEOVER) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
    }
  }

  togglePause() {
    if (this.gamestate == GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }
}



var canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");
 

    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    ctx.fillRect(0,0,100,100);
    ctx.fillStyle="blue";
    let game = new Game(GAME_WIDTH, GAME_HEIGHT);
    
  
 function gameLoop(timestamp) {
  let lastTime = 0;
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  game.update(deltaTime);
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

//main


//collsion

const switcher = document.querySelector('.btn');
 switcher.addEventListener('click', function() {
    
    var className = document.body.className;
    if(className == "fadeWhite") {
        document.body.className="fadeBlack";
        document.getElementById("btn").textContent = "Dark";

    }
    else {
        
        document.body.className="fadeWhite";
        document.getElementById("btn").textContent = "Light"; 

    }


});




