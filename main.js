(function(){
  //MODEL
  self.Board = function(width,height){
    this.width = width;
    this.height = height;
    this.playing = false;
    this.game_over = false;
    this.bars = [];
    this.ball = null;
    this.playing = false;
    this.upperLimit = 0;
    this.lowerLimit = 400;
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
      this.speed = 20;
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
      toString: function(){
        return "x: " + this.x + " y: "+ this.y;
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
      },
      collisionBoard(bar) {
        // Reacts to the collision with a bar received as parameter
        console.log("EN COLISION")
        console.log(this.x)
        let relative_intersect_y = this.x /2;
    
        let normalized_intersect_y = relative_intersect_y / 1;
    
        this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
        this.speed_y = this.speed * -Math.sin(this.bounce_angle);
        this.speed_x = this.speed * Math.cos(this.bounce_angle);
        
        if (this.x > this.board.width / 2) this.direction = -1;
        else this.direction = 1;
      }
    }
  })();

  (function(){
    //VIEW
  self.BoardView = function(canvas,board){
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.ctx = canvas.getContext("2d");
    this.sc1 = "1";
    this.sc2 = "1";
    this.in = true;
  }
  self.BoardView.prototype = {
    clean: function(){
      this.ctx.clearRect(0,0,this.board.width,this.board.height);
    },
    draw: function(){
      this.ctx.font = "bold 20px Courier New";
      this.ctx.textAlign = "start";
      this.ctx.fillText("Score 1", 110,20);
      this.ctx.fillText("Score 2", 210,20);
      this.score1 = this.ctx.fillText(this.sc1.toString(), 140,40);
      this.score2 =this.ctx.fillText(this.sc2.toString(), 245,40);
      for(var i = this.board.elements.length-1; i >=0; i--){
        var el = this.board.elements[i]
        draw(this.ctx,el);
      }
    },
    change_scores: function(score1,score2){
      score1 = score1.toString();
      score2 = score2.toString();
      this.sc1 = score1;
      this.sc2 = score2; 
    },
    check_collisions() {
      
      for (let i = this.board.bars.length - 1; i >= 0; i--) {
        this.in = true;
        let bar = this.board.bars[i];
        if (hit(bar, this.board.ball)) {
          this.board.ball.collisions(bar);
        }if (hit(this.board, this.board.ball) && this.in) {
          if(this.board.ball.x <= 0 && this.in){
            this.sc2 = parseInt(this.sc2);
            let score1 = this.sc1;
            let score2 = this.sc2 + 1;
            this.change_scores(score1,score2);
            this.in = false;
            this.board.playing = !board.playing;
            this.board.ball.x = 200;
            this.board.bars[0].y = 100;
            this.board.bars[1].y = 100;
          }else if(this.board.ball.x >= 380 && this.in){
            this.sc1 = parseInt(this.sc1);
            let score1 = this.sc1 +1;
            let score2 = this.sc2;
            this.change_scores(score1,score2);
            this.in = false;
            this.board.playing = !board.playing;
            this.board.ball.x = 200;
            this.board.bars[0].y = 100;
            this.board.bars[1].y = 100;
          }else if(this.board.ball.y <= 0 ||  this.board.ball.y >= 276){
            this.board.ball.collisionBoard(this.board);
            this.in = false;
          }
        }
      }
    },
    play: function(){
      if(this.board.playing){
        this.clean();
        this.draw();
        this.check_collisions();
        this.board.ball.move();
      }
    }
  }
  function hit(a, b) {
    //Check if a collides with b
    var hit = false;
    //Horizontals collisions
    if (b.x + b.width >= a.x && b.x < a.x + a.width) {
      //vertical collisions
      if (b.y + b.height >= a.y && b.y < a.y + a.height) hit = true;
    }
    if(b.y <= 0 ||  b.y >= 276){
      hit = true;
    }
    if(b.x <= 0 ||  b.x >= 400){
      hit = true;
    }
    
    //Check if a collides with b
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
      if (b.y <= a.y && b.y + b.height >= a.y + a.height) hit = true;
    }
    //Check if b collides with a
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
      //vertical collisions
      if (a.y <= b.y && a.y + a.height >= b.y + b.height) hit = true;
    }
    return hit;
  }

  function draw(ctx,element){
    // Draw the bars and ball on canvas
      switch(element.kind){
        case "rectangle":
          ctx.fillRect(element.x,element.y,element.width,element.height);
          ctx.fillStyle = '#009900';
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(element.x,element.y,element.radius,0,7);
          ctx.fill();
          ctx.closePath();
          ctx.fillStyle = '#009900';
          break;
      }
    }
  })();

  //Objects creation
  var board = new Board(400,280);
  var bar = new Bar(20,100,10,60,board);
  var bar2 = new Bar(370,100,10,60,board);
  var canvas = document.getElementById('canvas');
  var board_view = new BoardView(canvas,board);
  var ball = new Ball(200,130,5,board);
  console.log(ball);

  board_view.draw();

  window.requestAnimationFrame(main);

  // Keyboard event to move the ball
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
    
    console.log("Bar position: "+bar.toString());
    console.log("Bar2 position: "+bar2.toString());
    console.log("Ball position: "+ball.toString());
  })

  self.addEventListener("load",main);

  function main(){
    //CONTROLLER
    board_view.play();
    window.requestAnimationFrame(main);
  }
