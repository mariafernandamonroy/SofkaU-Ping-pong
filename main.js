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
    this.playing = false;
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
      this.speed_x = 1;
      this.board = board;
      this.direction = 1;
      this.bounce_angle = 0;
      this.max_bounce_angle = Math.PI /2;
      this.speed = 2; 

      board.ball = this;
      this.kind = "circle";
    }
    self.Ball.prototype = {
      move: function(){
        this.x += (this.speed_x * this.direction);
        this.y += (this.speed_y);
      },
      get width(){
        return this.radius * 2;
      },
      get height(){
        return this.radius * 2;
      },
      collisions(bar) {
        // Reacts to the collision with a bar received as parameter
        let relative_intersect_y = bar.y + bar.height / 2 - this.y;
    
        let normalized_intersect_y = relative_intersect_y / (bar.height / 2);
    
        this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
    
        this.speed_y = this.speed * -Math.sin(this.bounce_angle);
        this.speed_x = this.speed * Math.cos(this.bounce_angle);
    
        if (this.x > this.board.width / 2) this.direction = -1;
        else this.direction = 1;
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
    check_collisions() {
      for (let i = this.board.bars.length - 1; i >= 0; i--) {
        let bar = this.board.bars[i];
        if (hit(bar, this.board.ball)) {
          this.board.ball.collisions(bar);
        }
      }
    },
    play: function(){
      if(this.board.playing){
        this.clean();
        this.draw();
        this,this.check_collisions();
        this.board.ball.move();
      }
    }
  }
  function hit(a, b) {
    //Revisa si a colisiona con b
    var hit = false;
    //Colisiones hirizontales
    if (b.x + b.width >= a.x && b.x < a.x + a.width) {
      //Colisiona verticales
      if (b.y + b.height >= a.y && b.y < a.y + a.height) hit = true;
    }
  
    //Colisión de a con b
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
      if (b.y <= a.y && b.y + b.height >= a.y + a.height) hit = true;
    }
  
    //Colision b con a
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
      //Colisiona verticales
      if (a.y <= b.y && a.y + a.height >= b.y + b.height) hit = true;
    }
    return hit;
  }

  function draw(ctx,element){
    // console.log(element.kind);
    // if(element !== null && element.hasOwnProperty("kind")){
      switch(element.kind){
        case "rectangle":
          ctx.fillRect(element.x,element.y,element.width,element.height);
          ctx.fillStyle = '#FF0000';
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(element.x,element.y,element.radius,0,7);
          ctx.fill();
          ctx.closePath();
          ctx.fillStyle = '#FF0000';
          break;
      }
    }
  // }
  })();

  var board = new Board(400,280);
  var bar = new Bar(20,100,10,60,board);
  var bar2 = new Bar(370,100,10,60,board);
  var canvas = document.getElementById('canvas');
  var board_view = new BoardView(canvas,board);
  var ball = new Ball(200,130,5,board);
  console.log(ball);

  board_view.draw();

  window.requestAnimationFrame(main);


  document.addEventListener("keydown",function(ev){
    
    if(ev.keyCode == 38){
      ev.preventDefault();
      bar.up();
    }
    else if(ev.keyCode == 40){
      ev.preventDefault();
      bar.down();
    }else if(ev.keyCode == 87){
      ev.preventDefault();
      bar2.up();
    }
    else if(ev.keyCode == 83){
      ev.preventDefault();
      bar2.down();
    }else if(ev.keyCode === 32){
      ev.preventDefault();
      board.playing = !board.playing;
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