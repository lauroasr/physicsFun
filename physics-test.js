onload = function() {
    var canvas = document.getElementById('viewport');
    var context = canvas.getContext("2d");

    Physics(function (world) {
        /* create a renderer */
        var renderer = Physics.renderer('canvas', {
            el: 'viewport',
            width: innerWidth,
            height: innerHeight - 5,
            meta: false, // don't display meta data
            styles: {
                // set colors for the circle bodies
                'circle' : {
                    strokeStyle: 'grey',
                    lineWidth: 1,
                    fillStyle: 'black',
                    angleIndicator: 'grey'
                }
            }
        });
        // add the renderer
        world.add(renderer);

        /* create the bounds of the simulation */
        var viewportBounds = Physics.aabb(0, 0, canvas.width - 1, canvas.height - 1);

        // constrain objects to these bounds
        world.add(Physics.behavior('edge-collision-detection', {
            aabb: viewportBounds,
            restitution: 0.5,
            cof: 1
        }));

        /* add gravity */
        var gravity = Physics.behavior('constant-acceleration');
        world.add(gravity);

        addEventListener('devicemotion', function deviceMotionHandler(event) {
            var acceleration = event.accelerationIncludingGravity;
            gravity.setAcceleration({ x: acceleration.x * -0.0005, y: acceleration.y * 0.0005 });
        });

        /* create a ball */
        var ball = Physics.body('circle', {
            x: 50, // x-coordinate
            y: 30, // y-coordinate
            vx: 0.2, // velocity in x-direction
            vy: 0.01, // velocity in y-direction
            radius: 150
        });
        // add the circle to the world
        world.add(ball);

        /* make elements collide with walls */
        // ensure objects bounce when edge collision is detected
        world.add(Physics.behavior('body-impulse-response'));
        /* make elements collide with each other */
        world.add( Physics.behavior('body-collision-detection'));
        world.add( Physics.behavior('sweep-prune'));

        /* the game loop */
        // subscribe to the ticker
        Physics.util.ticker.subscribe(function (time, dt) {
            world.step(time);
            world.render();
            // Note: FPS ~= 1000/dt
        });

        // start the ticker
        Physics.util.ticker.start();


        canvas.onclick = function () {
            /* create a ball */
            world.add(Physics.body('circle', {
                x: 50, // x-coordinate
                y: 30, // y-coordinate
                vx: .5, // velocity in x-direction
                vy: 1, // velocity in y-direction
                radius: Math.random() * 100 + 100
            }));
        }
    });
};



