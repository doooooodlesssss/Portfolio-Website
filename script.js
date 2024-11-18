// const coords = {x: 0, y: 0};
// const circles = document.querySelectorAll(".circle");

// const colors=["#1f005c", "#1f005c", "#48005f", "#48005f", "#680060", "#680060", "#830060", "#830060", "#9c155f", "#9c155f", "#b22c5e", "#b22c5e", "#c5415d", "#c5415d", "#d5585c", "#d5585c", "#e36e5c", "#e36e5c", "#ef865e", "#ef865e", "#f89d63", "#f89d63", "#ffb56b", "#ffb56b"];

// circles.forEach(function(circle, index){
//     circle.x = 0;
//     circle.y = 0;
//     circle.style.backgroundColor = colors[index %colors.length];
// });

// window.addEventListener("mousemove", function(e){
//     coords.x=e.clientX;
//     coords.y=e.clientY;

// });

// function animateCircles(){
//     let x = coords.x;
//     let y = coords.y;

//     circles.forEach(function(circle, index){
//         circle.style.left = x-12+"px";
//         circle.style.top = y-12+"px";
//         circle.style.scale = (circles.length - index)/circles.length;
//         circle.x = x;
//         circle.y = y;

//         const nextCircle = circles[index+1] || circles[0];
//         x+=(nextCircle.x - x)*0.5;
//         y+=(nextCircle.y - y)*0.5;

//     });
//     requestAnimationFrame(animateCircles);
// }
// animateCircles();




const coords = {x: 0, y: 0};
const circles = document.querySelectorAll(".circle");
const trailer = document.getElementById('trailer');
const projAnchors = document.querySelectorAll('.projAnch');
let trailerCoords = {x: 0, y: 0};

circles.forEach(function(circle, index){
    circle.x = 0;
    circle.y = 0;
});

window.addEventListener("mousemove", function(e){
    coords.x = e.clientX;
    coords.y = e.clientY;
});

function animateElements(){
    let x = coords.x;
    let y = coords.y;

    circles.forEach(function(circle, index){
        circle.style.left = x - 12 + "px";
        circle.style.top = y - 12 + "px";
        circle.style.scale = (circles.length - index) / circles.length;
        circle.x = x;
        circle.y = y;

        const nextCircle = circles[index + 1] || circles[0];
        x += (nextCircle.x - x) * 0.5;
        y += (nextCircle.y - y) * 0.5;
    });

    // Update trailer position with lag effect
    trailerCoords.x += (coords.x - trailerCoords.x) * 0.2;
    trailerCoords.y += (coords.y - trailerCoords.y) * 0.2;
    trailer.style.left = `${trailerCoords.x}px`;
    trailer.style.top = `${trailerCoords.y}px`;

    requestAnimationFrame(animateElements);
}
animateElements();

projAnchors.forEach(anchor => {
    anchor.addEventListener('mouseenter', () => {
        circles.forEach(circle => circle.style.display = 'none');
        trailer.style.opacity = '1';
        
    });

    anchor.addEventListener('mouseleave', () => {
        circles.forEach(circle => circle.style.display = 'block');
        trailer.style.opacity = '0';
    });
});