var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var mainState = {

        preload: function () {

            //set background
            game.stage.backgroundColor = '#71c5cf';

            //load bird
            game.load.image('bird', 'assets/bird.png');
            
            //load pipe
            game.load.image('pipe', 'assets/pipe.png');

        },

        create: function () {

            //set physics
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //display bird on screen
            this.bird = this.game.add.sprite(100, 245, 'bird');

            //add gravity
            game.physics.arcade.enable(this.bird);
            this.bird.body.gravity.y = 1000;
            this.bird.anchor.setTo(-0.2, 0.5);
            
            //create pipes
            this.pipes = game.add.group(); //create group
            this.pipes.enableBody = true; //add physics
            this.pipes.createMultiple(20, 'pipe'); //create 20 pipes

            //call jump function when spacebar pressed
            var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.jump, this);
            
            
            //call add one pipe 
            this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
            
            //score 
            this.score = 0;
            this.labelScore = game.add.text(20,20,"0", {font: "30px Arial",fill: "#ffffff"});

        },

        update: function () {

            if (this.bird.inWorld == false) {
                this.restartGame();
            }
            
            game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
            
            if (this.bird.angle < 20)
                this.bird.angle += 1;

        },

        jump: function () {
            
            if (this.bird.alive == false)
                return;

            this.bird.body.velocity.y = -350;
            
            //create animation on the bird
            var animation = game.add.tween(this.bird);
            
            //set animation to change the angle of sprite to -20 in 100 milliseconds
            animation.to({angle: -20}, 100);
            
            //start animation
            animation.start();
            
            //this can  also be addedd as game.add.tween(this.bird).to({angle: -20}, 100).start();
        },

        restartGame: function () {

            game.state.start('main');
        },   
    
        addOnePipe: function(x, y) { 
            //Get the first dead pipe
            var pipe = this.pipes.getFirstDead();
            
            //set new position
            pipe.reset(x, y);
    
            //Add velocity to the pipe to make it move left
            pipe.body.velocity.x = -200;
    
            //kill pipe when not visible
            pipe.checkWorldBounds = true;
            pipe.outOfBoundsKill = true;
        
        },
    
        addRowOfPipes: function() {
            
            //increase score
            this.score += 1;
            this.labelScore.text = this.score;
            
            //Pick hole position
            
            var hole = Math.floor(Math.random() * 5) + 1;
            
            //add 6 pipes
            for (var i=0; i<8;i++)
                if (i != hole && i  != hole + 1)
                    this.addOnePipe(400, i * 60 + 10);
            
        },
    
        hitPipe: function() {
            if (this.bird.alive == false)
                return;
            
            this.bird.alive = false;
            
            game.time.events.remove(this.timer);
            
            this.pipes.forEachAlive(function(p) {
                                    
                                    p.body.velocity.x = 0;
                                    
                                    
                                    }, this);
        
        
        },
          
    };

game.state.add('main', mainState);
game.state.start('main');
