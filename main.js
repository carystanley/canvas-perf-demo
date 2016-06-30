window.onload = function() {

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function loadImage(url, options) {
    options = options || {};
    var image = new Image();
    if (options.onload)
        image.on('load', options.onload);
    image.src = url;
    return image;
}

var world = [];

function rand(min, max) {
    return min + Math.random() * (max - min);
}

function randInt(min, max) {
    return Math.floor(rand(min, max));
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    world.forEach(function(entity) {
        context.drawImage(sprite, entity.frame * 115, 0, 115, 90, entity.x, entity.y, 115, 90);
	});

	context.font = "12px serif";
    context.fillText('Count = ' + world.length + ', FPS = ' + Math.round(averageFps) , 20, 20);
}

function update() {
    world.forEach(function(entity) {
		entity.x += entity.vx;
		entity.y += entity.vy;

		if (entity.x < 0 && entity.vx < 0) { entity.vx = -entity.vx; }
		if (entity.y < 0 && entity.vy < 0) { entity.vy = -entity.vy; }
		if (entity.x > canvas.width - 115 && entity.vx > 0) { entity.vx = -entity.vx; }
		if (entity.y > canvas.height - 90 && entity.vy > 0) { entity.vy = -entity.vy; }

		if (!entity.nextFrame) {
		    entity.nextFrame = Date.now() + entity.frameRate;
		}
		if (Date.now() > entity.nextFrame) {
		    entity.frame = (entity.frame + 1) % 4;
		    entity.nextFrame += entity.frameRate;
		}
	});
}

function addToWorld() {
    world.push({
        x: randInt(0, canvas.width - 115),
        y: randInt(0, canvas.height - 90),
        vx: rand(-2, 2),
        vy: rand(-2, 2),
        frame: randInt(0, 3),
        frameRate: randInt(100, 300)
	});
}

var i = 0;
var canvas = document.getElementById('mainCanvas');
var context = canvas.getContext('2d');
var sprite = loadImage('./spritesheet.png');

var lastCalledTime;
var fps = 0;
var averageFps = 60;
var smoothing = 0.9;

function mainloop(){
	i++;

    if (lastCalledTime) {
        delta = (Date.now() - lastCalledTime)/1000;
        lastCalledTime = Date.now();
        fps = 1/delta;
        averageFps = (averageFps * smoothing) + (fps * (1.0-smoothing));
    } else {
	    lastCalledTime = Date.now();
	}

    requestAnimFrame(mainloop);
    update();
    render();
    if (i % 5 === 0) {
		if (averageFps >= 59) {
		    addToWorld();
	    } else {
			world.pop();
		}
	}
};
mainloop();

};