function runEqualityExample() {

    const loose = 5 == "5";
    const strict = 5 === "5";

    document.getElementById("equalityOutput").innerHTML = `
        5 == "5" → ${loose}<br>
        5 === "5" → ${strict}
    `;
}

let count = 0;

function runClosureExample() {

    count++;

    document.getElementById("closureOutput").innerHTML =
        `Closure Counter: ${count}`;
}

function runEventLoopExample() {

    const output =
        document.getElementById("eventLoopOutput");

    output.innerHTML = "A";

    setTimeout(() => {

        output.innerHTML += "<br>B";

    }, 0);

    output.innerHTML += "<br>C";
}

function runPromiseExample() {

    const output =
        document.getElementById("promiseOutput");

    output.innerHTML = "Promise is running...";

    const myPromise = new Promise((resolve, reject) => {

        setTimeout(() => {

            const success = true;

            if (success) {
                resolve("Task completed successfully!");
            } else {
                reject("Task failed!");
            }

        }, 1000);

    });

    myPromise

        .then(result => {

            output.innerHTML = result;

        })

        .catch(error => {

            output.innerHTML = error;

        });
}


function runArrayMethods() {

    const numbers = [1, 2, 3, 4];

    // map
    const mapped = numbers.map(x => x * 2);

    // filter
    const filtered = numbers.filter(x => x > 2);

    // reduce
    const reduced =
        numbers.reduce((total, x) => total + x, 0);

    // forEach
    let forEachResult = [];

    numbers.forEach(x => {
        forEachResult.push(x);
    });

    document.getElementById("arrayOutput").innerHTML = `
        <strong>map():</strong> ${mapped.join(", ")}<br><br>

        <strong>filter():</strong> ${filtered.join(", ")}<br><br>

        <strong>reduce():</strong> ${reduced}<br><br>

        <strong>forEach():</strong> ${forEachResult.join(", ")}
    `;
}

const taskList =
    document.getElementById("taskList");

taskList.addEventListener("click", function(event) {

    if (event.target.tagName === "LI") {

        document.getElementById(
            "delegationOutput"
        ).innerHTML =
            `You clicked: ${event.target.textContent}`;

    }

});


function runMapExample() {

    const numbers = [1, 2, 3, 4];

    const result =
        numbers.map(x => x * 2);

    document.getElementById("mapOutput").innerHTML =
        `Result: [${result.join(", ")}]`;
}

function runThisExample() {

    const person = {

        name: "Khadija",

        getName: function() {
            return this.name;
        }

    };

    const result = person.getName();

    document.getElementById("thisOutput").innerHTML =
        `Correct result: ${result}`;
}

async function loadTasks() {

    const status =
        document.getElementById("apiStatus");

    const results =
        document.getElementById("taskResults");

    status.innerHTML =
        "Sending GET request to /api/tasks/...";

    results.innerHTML = "";

    try {

        const response =
            await fetch("/api/tasks/");

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }

        const tasks =
            await response.json();

        status.innerHTML =
            "Tasks loaded successfully.";

        tasks.forEach(task => {

            const taskElement =
                document.createElement("div");

            taskElement.className =
                "api-task";

            taskElement.innerHTML = `
                <h3>${task.title}</h3>

                <p>
                    ${task.description || ""}
                </p>
            `;

            results.appendChild(taskElement);

        });

    } catch (error) {

        status.innerHTML =
            `Error: ${error.message}`;

        /*
         * Demo data is displayed when your API
         * is not running, so you can still see
         * how the rendering works.
         */

        const demoTasks = [

            {
                title: "Learn JavaScript",
                description:
                    "Practice JavaScript concepts."
            },

            {
                title: "Build Website",
                description:
                    "Create a professional website."
            },

            {
                title: "Practice Fetch API",
                description:
                    "Learn how to request data from an API."
            }

        ];

        demoTasks.forEach(task => {

            const taskElement =
                document.createElement("div");

            taskElement.className =
                "api-task";

            taskElement.innerHTML = `
                <h3>${task.title}</h3>

                <p>
                    ${task.description}
                </p>
            `;

            results.appendChild(taskElement);

        });

    }
}

console.log(
    "JavaScript Core Concepts project loaded successfully!"
);