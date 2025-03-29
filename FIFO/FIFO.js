document.getElementById("back").onclick = function () {
    window.location.href = "../index.html";
};

function runFIFO() {
    const referenceString = document
        .getElementById("referenceString")
        .value.split(",")
        .map(Number);
    const frameCount = parseInt(document.getElementById("frameCount").value);
    const frames = new Array(frameCount).fill(null);
    const output = document.getElementById("output");
    output.innerHTML = "";

    let pageFaults = 0;
    let pointer = 0;

    referenceString.forEach((page, index) => {
        setTimeout(() => {
            if (!frames.includes(page)) {
                frames[pointer] = page;
                pointer = (pointer + 1) % frameCount;
                pageFaults++;
                displayFrames(frames, true, index);
            } else {
                displayFrames(frames, false, index);
            }
            if (index === referenceString.length - 1) {
                output.innerHTML += `<p>Total Page Faults: ${pageFaults}</p>`;
            }
        }, index * 500); // Delay each step by 500ms
    });
}

function displayFrames(frames, isPageFault, index) {
    const output = document.getElementById("output");
    let frameDiv = document.createElement("div");
    frameDiv.className = "frame-container";
    output.appendChild(frameDiv);

    frames.forEach((frame) => {
        const frameElement = document.createElement("div");
        frameElement.className = "frame";
        if (isPageFault && frame !== null) {
            frameElement.classList.add("page-fault");
            frameElement.classList.add("animate");
            setTimeout(() => frameElement.classList.remove("animate"), 300); // Remove animation class after 300ms
        }
        frameElement.textContent = frame !== null ? frame : "";
        frameDiv.appendChild(frameElement);
    });
}

// function generateRandomReferenceString() {
//     const length = Math.floor(Math.random() * 15) + 10; // Generate between 10-25 page references
//     const maxPageNumber = 9; // Pages will be between 0-9
//     const referenceString = [];

//     for (let i = 0; i < length; i++) {
//         referenceString.push(Math.floor(Math.random() * (maxPageNumber + 1)));
//     }

//     document.getElementById('referenceString').value = referenceString.join(',');
// }
