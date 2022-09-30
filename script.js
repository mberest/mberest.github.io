
const regular_img_link = "https://i.imgur.com/BrJGaCS.png";
const regular_img_link_mouseenter = "https://i.imgur.com/qoG6zpn.png";

// For sorting. If both are numbers use number compare otherwise use string compare
const compareFunc = (a, b)=> (isNaN(a) || isNaN(b)) ? a.localeCompare(b) : parseFloat(a) - parseFloat(b);

// sort ul or ol
const sortLists = listElements=> {
    listElements.forEach(listElement=> {
        const listItemValues = [];
        const listItems = listElement.children;
        for (let i = 0; i < listItems.length; i++) {
            if (listItems[i].tagName === "LI") listItemValues.push(listItems[i].innerHTML);
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
    let rows = Array.from(table.querySelectorAll(`tr`));
    rows = rows.slice(1); //ignore header row
    let qs = `td:nth-child(${colnum})`; // set up the queryselector
    rows.sort( (r1,r2)=> {
        // get each row's relevant column
        let t1 = r1.querySelector(qs);
        let t2 = r2.querySelector(qs);
        return (reverse) ? compareFunc(t2.textContent, t1.textContent) : compareFunc(t1.textContent, t2.textContent);
    });
    // and then the magic part that makes the sorting appear on-page:
    rows.forEach(row => table.appendChild(row));
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
    sortLists(document.querySelectorAll("UL, OL"));

    // change pictures when mouse hovers
    const images = document.querySelectorAll(".big-border img, .thumb img");
    images.forEach(image=> {
        image.src = regular_img_link;
        image.addEventListener("mouseenter", ()=> {
            images.forEach(image=> image.src = regular_img_link_mouseenter);
        });
        image.addEventListener("mouseout", ()=> {
            images.forEach(image=> image.src = regular_img_link);
        });
    });


    // change background color of div when clicked
    const changeBackgroundElements = document.querySelectorAll(".change-background");
    changeBackgroundElements.forEach(changeBackgroundElement=> {
        changeBackgroundElement.addEventListener("click", ()=> {
            // changeBackgroundElement.style.backgroundColor = backgroundColors[++bgColorIndex % backgroundColors.length]
            const randomColor = Math.floor(Math.random()*16777215).toString(16);
            const red = {val: parseInt(randomColor[0] + randomColor[1], 16)};
            const green = {val: parseInt(randomColor[2] + randomColor[3], 16)};
            const blue = {val: parseInt(randomColor[4] + randomColor[5], 16)};
            changeBackgroundElement.style.backgroundColor = "#" + randomColor;
            // adapted from https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
            [red, green, blue].forEach(color=> {
                color.val /= 255.0;
                color.val = (color.val <= 0.04045) ? color.val / 12.92 :  Math.pow((color.val + 0.055) / 1.055, 2.4);
            });
            const L = 0.2126 * red.val + 0.7152 * green.val + 0.0722 * blue.val;
            changeBackgroundElement.style.color = (L > 0.179) ? "#000000" : "#FFFFFF";
        });
    });


    // alert user when clicking link
    const anchors = document.querySelectorAll("a");
    anchors.forEach(anchor=> {
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
    toggleButton.addEventListener("click", ()=> {
        toggled.forEach(element=> element.style.display = (element.style.display == "none") ? toggledElements[element] : "none");
    });


    // sort table
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
    postComment.addEventListener("click", ()=> {
        comments.appendChild(getTimestampSpan());
        const newComment = document.createElement("SPAN");
        newComment.innerHTML = comment.value + "<br/>";
        comments.appendChild(newComment);
        comment.value = "";
    });
    comment.addEventListener("keypress", event=> {
        if (event.key === "Enter") postComment.click();
    });
});

