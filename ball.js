var width = 300;
var height = 240;
var canvas = ctx = false;
var frameRate = 1/40; // Seconds
var frameDelay = frameRate * 1000; // ms
var loopTimer = false;

/*
 * Experiment with values of mass, radius, restitution,
 * gravity (ag), and density (rho)!
 *
 * Changing the constants literally changes the environment
 * the ball is in.
 *
 * Some settings to try:
 * the moon: ag = 1.6
 * water: rho = 1000, mass 5
 * beach ball: mass 0.05, radius 30
 * lead ball: mass 10, restitution -0.05
 */
var ball = {
    position: {x: width/2, y: 0},
    velocity: {x: 10, y: 0},
    mass: 0.1, //kg
    radius: 15, // 1px = 1cm
    restitution: -1.0
    };

var Cd = 0.47;  // Dimensionless
var rho = 1.22; // kg / m^3
var A = Math.PI * ball.radius * ball.radius / (10000); // m^2
var ag = 9.81;  // m / s^2
var mouse = {x: 0, y: 0, isDown: false};

function getMousePosition(e) {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
}
var mouseDown = function(e) {
    if (e.which == 1) {
        getMousePosition(e);
        mouse.isDown = true;
        ball.position.x = mouse.x;
        ball.position.y = mouse.y;
    }
}
var mouseUp = function(e) {
    if (e.which == 1) {
        mouse.isDown = false;
        ball.velocity.y = (ball.position.y - mouse.y) /10;
        ball.velocity.x = (ball.position.x - mouse.x) / 10;
    }
}

var setup = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");




    canvas.onmousemove = getMousePosition;
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;

    ctx.fillStyle = 'red';
    ctx.strokeStyle = '#000000';
    loopTimer = setInterval(loop, frameDelay);
}
var loop = function() {


    if ( ! mouse.isDown) {
        // Do physics
            // Drag force: Fd = -1/2 * Cd * A * rho * v * v
        var Fx = -0.5 * Cd * A * rho * ball.velocity.x * ball.velocity.x * ball.velocity.x / Math.abs(ball.velocity.x);
        var Fy = -0.5 * Cd * A * rho * ball.velocity.y * ball.velocity.y * ball.velocity.y / Math.abs(ball.velocity.y);

        Fx = (isNaN(Fx) ? 0 : Fx);
        Fy = (isNaN(Fy) ? 0 : Fy);

            // Calculate acceleration ( F = ma )
        var ax = Fx / ball.mass;
        var ay = ag + (Fy / ball.mass);
            // Integrate to get velocity
        ball.velocity.x += ax*frameRate;
        ball.velocity.y += ay*frameRate;

            // Integrate to get position
        ball.position.x += ball.velocity.x*frameRate*100;
        ball.position.y += ball.velocity.y*frameRate*100;
    }
    // Handle collisions
    if (ball.position.y > height - ball.radius) {
        ball.velocity.y *= ball.restitution;
        ball.position.y = height - ball.radius;
    }
    if (ball.position.x > width - ball.radius) {
        ball.velocity.x *= ball.restitution;
        ball.position.x = width - ball.radius;
    }
    if (ball.position.x < ball.radius) {
        ball.velocity.x *= ball.restitution;
        ball.position.x = ball.radius;
    }
    // Draw the ball


    ctx.clearRect(0,0,width,height);

    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,width,height)
    ctx.fillStyle = "red";

    ctx.translate(ball.position.x, ball.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();

    ctx.restore();



    // Draw the slingshot
    if (mouse.isDown) {
        ctx.beginPath();
        ctx.moveTo(ball.position.x, ball.position.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        ctx.closePath();
    }

}
    setup();
