document.getElementById("back").onclick = function () {
    window.location.href = "../index.html";
};

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    refer(page) {
        if (!this.cache.has(page)) {
            if (this.cache.size === this.capacity) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
        } else {
            this.cache.delete(page);
        }
        this.cache.set(page, true);
        this.display();
    }

    display() {
        const frames = document.getElementById("frames");
        frames.innerHTML = "";
        this.cache.forEach((_, key) => {
            const frame = document.createElement("div");
            frame.className = "frame";
            frame.innerText = key;
            frames.appendChild(frame);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const lru = new LRUCache(3);
    const referenceString = [
        7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1,
    ];
    referenceString.forEach((page) => lru.refer(page));
});

function runLRU() {
    const referenceString = document
        .getElementById("referenceString")
        .value.split(",")
        .map(Number);
    const frameCount = parseInt(document.getElementById("frameCount").value);
    const output = document.getElementById("output");
    output.innerHTML = "";

    let frames = new Array(frameCount).fill(null);
    let recentlyUsed = new Array(frameCount).fill(-1); // Tracks when each frame was last used
    let pageFaults = 0;

    referenceString.forEach((page, index) => {
        setTimeout(() => {
            let isPageFault = false;

            // Check if page is already in frames
            const frameIndex = frames.indexOf(page);

            if (frameIndex === -1) {
                // Page fault
                isPageFault = true;
                pageFaults++;

                // Find the least recently used frame
                let lruIndex = 0;
                for (let i = 1; i < frameCount; i++) {
                    if (recentlyUsed[i] < recentlyUsed[lruIndex]) {
                        lruIndex = i;
                    }
                }

                // Replace the LRU frame
                frames[lruIndex] = page;
                recentlyUsed[lruIndex] = index;
            } else {
                // Update the recently used index for the page
                recentlyUsed[frameIndex] = index;
            }

            displayFrames(frames, isPageFault, index);

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
