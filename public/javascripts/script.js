let t1 = gsap.timeline({
    repeat: -1,
    repeatDelay: .5, // Loop infinitely
    yoyo: true,
});

// t1.from("box, box1, box2",{
//     delay: 0.5,
//     skewX: -10,
//     skewY: 10,
//     stagger: 0.4,
//     y: 50,
//     x: -20,
//     opacity: 0,
// });

t1.from(".box", {y: 100, duration: 1});
t1.from(".box1", {y: 100, duration: 1});
t1.from(".box2", {y: 100, duration: 1});