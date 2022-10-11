
const regular_img_link = "https://i.imgur.com/BrJGaCS.png";
const regular_img_link_mouseenter = "https://i.imgur.com/qoG6zpn.png";
const logo = "https://i.imgur.com/NPQjL3F.png";

/**
 * Get black/white text color based on luminosity of background color. Not perfect, but best I could find.
 * adapted from https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
 * @param {string} backgroundColor '#' followed by 6 hex digits
 * @return {string} either "#000000" or "#FFFFFF"
 */
const blackOrWhite = backgroundColor=> {
    const red = {val: parseInt(backgroundColor[1] + backgroundColor[2], 16)};
    const green = {val: parseInt(backgroundColor[3] + backgroundColor[4], 16)};
    const blue = {val: parseInt(backgroundColor[5] + backgroundColor[6], 16)};
    for (const color of [red, green, blue]) {
        color.val /= 255.0;
        color.val = (color.val <= 0.04045) ? color.val / 12.92 :  Math.pow((color.val + 0.055) / 1.055, 2.4);
    }
    const L = 0.2126 * red.val + 0.7152 * green.val + 0.0722 * blue.val;
    return (L > 0.179) ? "#000000" : "#FFFFFF";
}

// convert an rgb color to hex (reduce function is awesome)
const rgbToHex = rgb=> "#" + rgb.match(/^rgb\((\d+), \s*(\d+), \s*(\d+)\)$/).slice(1).reduce((pv, cv)=> pv + ("0" + parseInt(cv).toString(16)).slice(-2), "");

// For sorting. If both are numbers use number compare otherwise use string compare
const compareFunc = (a, b)=> (isNaN(a) || isNaN(b)) ? a.localeCompare(b) : parseFloat(a) - parseFloat(b);

// sort ul or ol
const sortLists = listElements=> {
    listElements.forEach(listElement=> {
        const listItemValues = [];
        const listItems = listElement.children;
        for (let i = 0; i < listItems.length; i++) {
            if (listItems[i].tagName === "LI") listItemValues.push(listItems[i].textContent);
        }
        listItemValues.sort(compareFunc);
        for (let i = 0; i < listItemValues.length; i++) {
            listItems[i].innerHTML = listItemValues[i];
        }
    });
}


// adapted with heavy modification from https://stackoverflow.com/questions/55462632/javascript-sort-table-column-on-click
const sortTable = (colnum, table)=> {
    let reverse = false; // false means sort ascending
    const currentTH = table.querySelector(`th:nth-child(${colnum})`); // the TH that was clicked
    const firstCharCode = currentTH.textContent.charCodeAt(0); // get char code of first char
    if ([0x25B2, 0x25BC].includes(firstCharCode)) { // if clicked on "sort by" col th
        if (firstCharCode === 0x25B2) { // if col was ascending. make it ascending
            reverse = true;
            currentTH.innerHTML = String.fromCharCode(0x25BC) + currentTH.textContent.slice(1);
        }
        else { // col was descending, make it ascending
            currentTH.innerHTML = '<span style="position:relative; top:-2px;">&#x25B2;</span>' + currentTH.textContent.slice(1);
        }
    }
    else { //col clicked was not prior sorted
        table.querySelectorAll("th").forEach(th=> {
            const firstCharCode = th.textContent.charCodeAt(0);
            if ([0x25B2, 0x25BC].includes(firstCharCode)) { // if it was the prior "sort by" col
                th.innerHTML = th.textContent.slice(1); // remove triangle from th
            }
        });
        // add up-triangle to new "sort by" col th
        currentTH.innerHTML = '<span style="position:relative; top:-2px;">&#x25B2;</span>' + currentTH.textContent;
    }
    // now for the actual sorting
    const rows = Array.from(table.querySelectorAll("tr")).slice(1); // ignore header row
    const qs = `td:nth-child(${colnum})`; // set up the queryselector
    rows.sort( (r1,r2)=> {
        // get each row's relevant column
        const t1 = r1.querySelector(qs);
        const t2 = r2.querySelector(qs);
        return (reverse) ? compareFunc(t2.textContent, t1.textContent) : compareFunc(t1.textContent, t2.textContent);
    });
    // and then the magic part that makes the sorting appear on-page:
    rows.forEach(row => {
        (table.querySelector("tbody") || table).appendChild(row); // check if using tbody
    });
}


// returns a span element with current date and time
getTimestampSpan = ()=> {
    const timestamp = document.createElement("SPAN");
    timestamp.style.fontFamily = "Arial, Helvetica, sans-serif";
    timestamp.style.fontSize = "small";
    const d = new Date();
    timestamp.innerHTML = d.toLocaleString() + " ";
    return timestamp
}


// Stuff to do after content is loaded
document.addEventListener("DOMContentLoaded", ()=> {
    // for popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    // sort lists
    sortLists(document.querySelectorAll(".sort-list"));

    // change pictures when mouse hovers
    const images = document.querySelectorAll(".card img:not(#hello)");
    images.forEach(image=> {
        image.src = regular_img_link;
        image.addEventListener("mouseenter", ()=> {
            images.forEach(image=> image.src = regular_img_link_mouseenter);
        });
        image.addEventListener("mouseout", ()=> {
            images.forEach(image=> image.src = regular_img_link);
        });
    });
    document.querySelector(".navbar img").src = logo;


    // change background color of div when clicked
    const changeBackgroundElements = document.querySelectorAll(".change-background");
    changeBackgroundElements.forEach(changeBackgroundElement=> {
        changeBackgroundElement.addEventListener("click", ()=> {
            // changeBackgroundElement.style.backgroundColor = backgroundColors[++bgColorIndex % backgroundColors.length]
            const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
            changeBackgroundElement.style.backgroundColor = randomColor;
            changeBackgroundElement.style.color = blackOrWhite(randomColor)
        });
    });


    // alert user when clicking link
    document.querySelectorAll(".check-leave").forEach(anchor=> {
        anchor.addEventListener("click", event=> {
            const leave = confirm("Are you sure you want to leave my awesome website?");
            if (!leave) {
                event.preventDefault();
           }
       });
    });


    // table toggle button click
    const toggleButton = document.getElementById("toggle");
    const toggled = document.querySelectorAll(".toggled")
    const toggledElements = {};
    toggled.forEach(element=> toggledElements[element] = element.style.display);
    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            toggled.forEach(element => element.hidden = !element.hidden);
        });
    }


    // sort data tables
    const tables = document.querySelectorAll("table.data");
    tables.forEach(table=> {
        table.querySelectorAll("th").forEach((th, position)=> {
            th.addEventListener("click", ()=> sortTable(position+1, table));
        });
    });


    // Post comment
    const postComment = document.getElementById("post-comment");
    const comment = document.getElementById("comment");
    const comments = document.getElementById("comments");
    if (postComment && comment) {
        postComment.addEventListener("click", () => {
            comments.appendChild(getTimestampSpan());
            const newComment = document.createElement("SPAN");
            newComment.innerHTML = comment.value + "<br/>";
            comments.appendChild(newComment);
            comment.value = "";
        });
        comment.addEventListener("keypress", event => {
            if (event.key === "Enter") postComment.click();
        });
    }


    // change color of second column of data table to textContent
    const dataSecondColTDs = document.querySelectorAll(".data td:nth-child(2)");
    dataSecondColTDs.forEach(td=> {
        try {
            td.style.backgroundColor = td.textContent;
            td.style.color = blackOrWhite(rgbToHex(window.getComputedStyle(td).backgroundColor));
        }
        catch (e) { }
    });

    fetch('https://7te1h9vgtd.execute-api.us-east-1.amazonaws.com/prod?RideId=2', "referrerPolicy:", "unsafe-url")
        .then((response) => response.json())
        .then((data) => console.log(data));
});

