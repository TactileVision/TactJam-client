
let canStatic = document.getElementById('silhouette-static');
let canInteract = document.getElementById('silhouette-interactive');
let img = new Image();
img.src = "images/silhouette2.jpg";
img.onload = () => {
    // const w = img.width*0.9, h = img.height*0.9;
    // TODO need to find a better way here -- not hardcoded
    const w = 640, h = 420;
    console.log("Canvases dimension: " + w + " " + h);
    canStatic.width = w;
    canStatic.height = h;
    canInteract.width = w;
    canInteract.height = h;

    // canStatic.getContext('2d').drawImage(img, 0, 0, w, h);
    canStatic.getContext('2d').drawImage(img, 0, 0, img.width*0.5, img.height*0.5);
    drawEllipses();
}

let ellipses = [ { x: 20, y: 20, r: 10, color: 'red' }, { x: 40, y: 20, r: 10, color: 'blue'}, { x: 60, y: 20, r: 10, color: 'green'} ];
let ellFocused = null;

// get mouse position on canvas
let mouse = { pos: [0,0], pressed: false }; // states: 0: no button pressed, 1: left button down
canInteract.onmousemove = (e) => {
    const oldPos = [mouse.pos[0], mouse.pos[1]];
    if(e.offsetX) {
        mouse.pos[0] = e.offsetX;
        mouse.pos[1] = e.offsetY;
    }
    else if(e.layerX) {
        mouse.pos[0] = e.layerX;
        mouse.pos[1] = e.layerY;
    }

    // to remove, for debug purpose
    drawEllipses();
    console.log(mouse.pos);

    if(mouse.pressed && ellFocused !== null) {
        ellFocused.x += mouse.pos[0] - oldPos[0];
        ellFocused.y += mouse.pos[1] - oldPos[1];
        console.log(mouse.pos[0], oldPos[0]);
        drawEllipses();
    }
};

canInteract.onmousedown = () => {
    mouse.pressed = true;
    // check whether an ellipse is below the mouse cursor
    let i = 0;
    while(i < ellipses.length && Math.pow(mouse.pos[0] - ellipses[i].x, 2) + Math.pow(mouse.pos[1] - ellipses[i].y, 2) > Math.pow(ellipses[i].r, 2)) { i++; }
    if(i < ellipses.length) {
        ellFocused = ellipses[i];
    } else {
        ellFocused = null;
    }
}
canInteract.onmouseup = () => { mouse.pressed = false; }

canInteract.onclick = () => {
    drawEllipses();
};

function drawEllipses() {
    let ctx = canInteract.getContext('2d');
    ctx.clearRect(0, 0, canInteract.width, canInteract.height);
    ellipses.forEach((e) => {
        ctx.beginPath();
        ctx.ellipse(e.x, e.y, e.r, e.r, 0, 0, Math.PI*2);
        ctx.fillStyle = e.color;
        ctx.fill();
    });
    // useful to show position of pointer and debug strange canvas sizes
    // if(mouse.pos !== undefined) {
    //     ctx.beginPath();
    //     ctx.ellipse(mouse.pos[0], mouse.pos[1], 10, 10, 0, 0, Math.PI*2);
    //     ctx.fillStyle = 'black';
    //     ctx.fill();
    // }
}
