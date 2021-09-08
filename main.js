// window.onload = function() {
(function(){
  //MODELO
  self.Board = function(width,height){
    this.width = width;
    this.height = height;
    this.playing = false;
    this.game_over = false;
    this.bars = [];
    this.ball = null;
  }

  self.Board.prototype = {
    get elements(){
      var elements = this.bars.map(function(bar){return bar;});
      elements.push(this.ball);
      return elements;
    }
  }
})();

  (function(){
    self.Bar = function(x,y,width,height,board){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.board = board;
      this.board.bars.push(this);
      this.kind = "rectangle";
      this.speed = 30;
      }

      self.Bar.prototype = {
        down: function(){
          this.y += this.speed;
        },
        up: function(){
          this.y -= this.speed;
        },
        toString: function(){
          return "x: " + this.x + " y: "+ this.y;
        }
      }
  })();

  (function(){
    self.Ball = function(x,y,radius,board){
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.speed_y = 0;
      this.speed_x = 2;
      this.board = board;
      this.direction = 1;

      board.ball = this;
      this.kind = "circle";
    }
    self.Ball.prototype = {
      move: function(){
        this.x += (this.speed_x * this.direction);
        this.y += (this.speed_y);
      }
    }
  })();

  (function(){
    //VISTA 
  self.BoardView = function(canvas,board){
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.ctx = canvas.getContext("2d");
    
  }

  self.BoardView.prototype = {
    clean: function(){
      this.ctx.clearRect(0,0,this.board.width,this.board.height);
    },
    draw: function(){
      for(var i = this.board.elements.length-1; i >=0; i--){
        var el = this.board.elements[i]
        draw(this.ctx,el);
      }
    },
    play: function(){
      this.clean();
      this.draw();
      this.board.ball.move();
    }
  }

  function draw(ctx,element){
    // console.log(element.kind);
    // if(element !== null && element.hasOwnProperty("kind")){
      switch(element.kind){
        case "rectangle":
          ctx.fillRect(element.x,element.y,element.width,element.height);
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(element.x,element.y,element.radius,0,7);
          ctx.fill();
          ctx.closePath();
          break;
      }
    }
  // }
  })();

  var board = new Board(400,280);
  var bar = new Bar(20,200,10,60,board);
  var bar2 = new Bar(370,200,10,60,board);
  var canvas = document.getElementById('canvas');
  var board_view = new BoardView(canvas,board);
  var ball = new Ball(200,100,5,board);
  console.log(ball);

  window.requestAnimationFrame(main);
  setTimeout(function(){
    ball.direction = -1;
  },2000);

  document.addEventListener("keydown",function(ev){
    ev.preventDefault();
    if(ev.keyCode == 38){
      bar.up();
    }
    else if(ev.keyCode == 40){
      bar.down();
    }else if(ev.keyCode == 87){
      bar2.up();
    }
    else if(ev.keyCode == 83){
      bar2.down();
    }
    
    console.log(bar.toString());
  })

  self.addEventListener("load",main);

  function main(){
    //CONTROLADOR
    board_view.play();
    window.requestAnimationFrame(main);
  }


// }