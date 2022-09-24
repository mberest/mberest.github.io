
let regular_img_link = "https://i.imgur.com/BrJGaCS.png";
let regular_img_link_mouseover = "https://i.imgur.com/qoG6zpn.png";

document.addEventListener("DOMContentLoaded", ()=> {
    let regular_img = document.querySelector(".big-border img");
    regular_img.src = regular_img_link;

    regular_img.addEventListener("mouseover", e => {
        e.target.src = regular_img_link_mouseover;
    });
    regular_img.addEventListener("mouseout", e => {
        e.target.src = regular_img_link;
    });
});

