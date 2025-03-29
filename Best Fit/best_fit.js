document.getElementById("back").onclick = function () {
    window.location.href = "../index.html";
};

let size = 0;
document.getElementById("numOfFrames").addEventListener("input", function () {
    size = this.value;

    let div = document.getElementById("output_fit");
    div.innerHTML = "";
    // Fill the output div with the frames
    for (let i = 0; i < size; i++) {
        let frame = document.createElement("div");
        frame.className = "memFrame";
        div.append(frame);
    }

    div.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // 5 columns
});

let memory = new Array(size);

document.getElementById("randSize").onclick = function () {
    let Frames = document.getElementsByClassName("memFrame");
    for (let i = 0; i < size; i++) {
        memory[i] = {
            size: (Math.floor(Math.random() * 7) + 2) * 10,
            used: false,
        };
        Frames[i].innerHTML = memory[i].size;
    }
};

let submit = document.createElement("button");
submit.innerText = "Submit";

document.getElementById("manualSize").onclick = function () {
    let div = document.getElementById("frameSizes");
    div.innerHTML = "";
    for (let i = 0; i < size; i++) {
        let input = document.createElement("input");
        input.type = "number"; // Set input type to number
        input.placeholder = `Frame ${i + 1} Size`; // Add a placeholder
        input.className = "frameInput"; // Optional: Add a class for styling
        input.style.marginRight = "10px"; // Add spacing between inputs

        div.appendChild(input); // Append the input to the div
    }
    div.append(submit);
};

submit.onclick = function () {
    let FrameSizes = document.getElementsByClassName("frameInput");
    let Frames = document.getElementsByClassName("memFrame");
    for (let i = 0; i < size; i++) {
        Frames[i].innerHTML = FrameSizes[i].value;
        memory[i].size = parseInt(FrameSizes[i].value);
    }
};

let numOfProc = 0;
let processes = [];

document.getElementById("numOfProcess").addEventListener("input", function () {
    numOfProc = this.value;

    let div = document.getElementById("processContainer");
    div.innerHTML = "";

    for (let i = 0; i < numOfProc; i++) {
        let input = document.createElement("input");
        input.type = "number"; // Set input type to number
        input.placeholder = `Process ${i + 1} Size`; // Add a placeholder
        input.className = "procInput"; // Optional: Add a class for styling
        input.style.marginRight = "10px"; // Add spacing between inputs

        div.appendChild(input);
    }
});

document.getElementById("submitProc").onclick = function () {
    let procInputs = document.getElementsByClassName("procInput");
    for (let i = 0; i < numOfProc; i++) {
        processes[i] = parseInt(procInputs[i].value);
    }

    let allocation = new Array(size);
    let allocatedflags = new Array(size).fill(false);

    for (let i = 0; i < numOfProc; i++) {
        let proc = processes[i];
        let temp = 1000000;
        let idx = -1;
        let flag = false;
        for (let j = 0; j < memory.length; j++) {
            if (proc == memory[j].size && !allocatedflags[j]) {
                allocation[j] = i;
                allocatedflags[j] = true;
                flag = true;
                memory[j].used = true;
                updateMemoryDisplay();
                break;
            } else if (proc < memory[j].size && !allocatedflags[j]) {
                let diff = memory[j].size - proc;
                if (diff < temp) {
                    temp = diff;
                    idx = j;
                }
            }
        }
        if (!flag) {
            if (idx == -1) {
                console.log(
                    `Process ${
                        i + 1
                    } cannot be allocated to any frame as it's larger than all available frames.`
                );
            } else {
                allocation[idx] = i;
                allocatedflags[idx] = true;
                memory[idx].size -= proc; // Update memory after allocation
                memory.splice(idx, 0, { size: proc, used: true });
                size += 1;
                updateMemoryDisplay(); // Update the HTML display
            }
        }
    }
};

function updateMemoryDisplay() {
    let div = document.getElementById("output_fit");
    div.innerHTML = ""; // Clear existing frames

    for (let i = 0; i < memory.length; i++) {
        let frame = document.createElement("div");
        frame.className = "memFrame";
        frame.innerHTML = memory[i].size;
        if (memory[i].used) {
            frame.style.backgroundColor = "#004d40";
            frame.style.color = "#fff";
        }
        div.append(frame);
    }

    div.style.gridTemplateColumns = `repeat(${memory.length}, 1fr)`; // Adjust grid columns
}
