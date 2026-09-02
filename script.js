 "use strict";

const STORAGE_KEY = "expense_manager_data";

const CATEGORIES = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Other"
];

let expenses = [];

let expenseToDelete = null;

const expenseList =
    document.getElementById("expenseList");

const emptyState =
    document.getElementById("emptyState");

const expenseCount =
    document.getElementById("expenseCount");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortSelect =
    document.getElementById("sortSelect");

const expenseModal =
    document.getElementById("expenseModal");

const deleteModal =
    document.getElementById("deleteModal");

const expenseForm =
    document.getElementById("expenseForm");

const modalTitle =
    document.getElementById("modalTitle");

const message =
    document.getElementById("message");

function loadExpenses() {

    try {

        const savedData =
            localStorage.getItem(STORAGE_KEY);


        if (!savedData) {

            expenses = [];

            return;
        }


        const parsedData =
            JSON.parse(savedData);


        if (!Array.isArray(parsedData)) {

            throw new Error(
                "Stored expense data is invalid."
            );
        }


        expenses = parsedData;

    } catch (error) {

        console.error(
            "Error loading expenses:",
            error
        );

        expenses = [];

        showMessage(
            "Unable to load saved expenses.",
            "error"
        );
    }
}


function saveExpenses() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(expenses)
        );

    } catch (error) {

        console.error(
            "Error saving expenses:",
            error
        );

        showMessage(
            "Unable to save expenses.",
            "error"
        );
    }
}

function generateId() {

    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {

        return crypto.randomUUID();
    }


    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2)
    );
}

function getFormData() {

    return {

        title:
            document
                .getElementById("expenseTitle")
                .value
                .trim(),

        category:
            document
                .getElementById("expenseCategory")
                .value,

        amount:
            document
                .getElementById("expenseAmount")
                .value,

        date:
            document
                .getElementById("expenseDate")
                .value,

        description:
            document
                .getElementById("expenseDescription")
                .value
                .trim()
    };
}

function validateExpense(data) {

    const errors = {};

    const amount =
        Number(data.amount);

    if (data.title.length < 2) {

        errors.title =
            "Title must contain at least 2 characters.";
    }

    if (
        !CATEGORIES.includes(
            data.category
        )
    ) {

        errors.category =
            "Please select a valid category.";
    }

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        errors.amount =
            "Amount must be greater than 0.";
    }

    if (!data.date) {

        errors.date =
            "Date is required.";

    } else {

        const date =
            new Date(
                data.date + "T00:00:00"
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            errors.date =
                "Please enter a valid date.";
        }
    }

    if (
        data.description.length > 300
    ) {

        errors.description =
            "Description cannot exceed 300 characters.";
    }


    return errors;
}

function displayErrors(errors) {

    document.getElementById(
        "titleError"
    ).textContent =
        errors.title || "";


    document.getElementById(
        "categoryError"
    ).textContent =
        errors.category || "";


    document.getElementById(
        "amountError"
    ).textContent =
        errors.amount || "";


    document.getElementById(
        "dateError"
    ).textContent =
        errors.date || "";


    document.getElementById(
        "descriptionError"
    ).textContent =
        errors.description || "";
}


function clearErrors() {

    displayErrors({});
}

function addExpense(data) {

    const newExpense = {

        id: generateId(),

        title: data.title,

        category: data.category,

        amount: Number(
            data.amount
        ),

        date: data.date,

        description: data.description
    };


    expenses.unshift(
        newExpense
    );


    saveExpenses();

    render();


    showMessage(
        "Expense added successfully.",
        "success"
    );
}

function updateExpense(
    id,
    data
) {

    const index =
        expenses.findIndex(
            expense =>
                expense.id === id
        );


    if (index === -1) {

        showMessage(
            "Expense not found.",
            "error"
        );

        return;
    }


    expenses[index] = {

        ...expenses[index],

        title: data.title,

        category: data.category,

        amount: Number(
            data.amount
        ),

        date: data.date,

        description: data.description
    };


    saveExpenses();

    render();


    showMessage(
        "Expense updated successfully.",
        "success"
    );
}

function deleteExpense(id) {

    const originalLength =
        expenses.length;


    expenses =
        expenses.filter(
            expense =>
                expense.id !== id
        );


    if (
        expenses.length ===
        originalLength
    ) {

        showMessage(
            "Expense not found.",
            "error"
        );

        return;
    }


    saveExpenses();

    render();


    showMessage(
        "Expense deleted successfully.",
        "success"
    );
}

function getFilteredExpenses() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedCategory =
        categoryFilter.value;


    const filtered =
        expenses.filter(
            expense => {

                const matchesSearch =
                    expense.title
                        .toLowerCase()
                        .includes(
                            searchTerm
                        );


                const matchesCategory =
                    selectedCategory === "all" ||
                    expense.category ===
                    selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );
            }
        );


    return sortExpenses(
        filtered
    );
}

function sortExpenses(
    expenseListData
) {

    const sortType =
        sortSelect.value;


    return [
        ...expenseListData
    ].sort(
        (a, b) => {

            switch (sortType) {

                case "amount-asc":

                    return (
                        a.amount -
                        b.amount
                    );


                case "amount-desc":

                    return (
                        b.amount -
                        a.amount
                    );


                case "date-asc":

                    return (
                        new Date(
                            a.date
                        ) -
                        new Date(
                            b.date
                        )
                    );


                case "date-desc":

                    return (
                        new Date(
                            b.date
                        ) -
                        new Date(
                            a.date
                        )
                    );


                case "title-asc":

                    return a.title
                        .localeCompare(
                            b.title
                        );


                case "title-desc":

                    return b.title
                        .localeCompare(
                            a.title
                        );


                default:

                    return 0;
            }
        }
    );
}

function render() {

    updateStatistics();


    const filteredExpenses =
        getFilteredExpenses();


    expenseList.innerHTML =
        "";


    expenseCount.textContent =
        `${filteredExpenses.length} expense${
            filteredExpenses.length === 1
                ? ""
                : "s"
        } found`;


    if (
        filteredExpenses.length === 0
    ) {

        emptyState.classList.remove(
            "hidden"
        );

        return;
    }


    emptyState.classList.add(
        "hidden"
    );


    filteredExpenses.forEach(
        expense => {

            expenseList.insertAdjacentHTML(
                "beforeend",
                createExpenseCard(
                    expense
                )
            );
        }
    );
}

function createExpenseCard(
    expense
) {

    const formattedAmount =
        formatCurrency(
            expense.amount
        );


    const formattedDate =
        formatDate(
            expense.date
        );


    return `

        <article
            class="expense-card"
            data-id="${escapeHTML(expense.id)}"
        >

            <span class="category-badge">

                ${escapeHTML(
                    expense.category
                )}

            </span>


            <div class="expense-top">

                <h3 class="expense-title">

                    ${escapeHTML(
                        expense.title
                    )}

                </h3>

            </div>


            <div class="expense-amount">

                ${formattedAmount}

            </div>


            <p class="expense-date">

                📅 ${formattedDate}

            </p>


            <p class="expense-description">

                ${escapeHTML(
                    expense.description ||
                    "No description provided."
                )}

            </p>


            <div class="expense-actions">

                <button
                    class="edit-btn"
                    data-action="edit"
                    data-id="${escapeHTML(expense.id)}"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    data-action="delete"
                    data-id="${escapeHTML(expense.id)}"
                >
                    Delete
                </button>

            </div>

        </article>

    `;
}

function updateStatistics() {

    /* Total */

    const total =
        expenses.reduce(
            (
                sum,
                expense
            ) => {

                return (
                    sum +
                    Number(
                        expense.amount
                    )
                );
            },
            0
        );

    const now =
        new Date();


    const currentMonth =
        now.getMonth();


    const currentYear =
        now.getFullYear();


    const currentMonthTotal =
        expenses.reduce(
            (
                sum,
                expense
            ) => {

                const expenseDate =
                    new Date(
                        expense.date +
                        "T00:00:00"
                    );


                if (
                    expenseDate.getMonth() ===
                    currentMonth &&
                    expenseDate.getFullYear() ===
                    currentYear
                ) {

                    return (
                        sum +
                        Number(
                            expense.amount
                        )
                    );
                }


                return sum;
            },
            0
        );

    const average =
        expenses.length > 0
            ? total / expenses.length
            : 0;


    document.getElementById(
        "totalExpenses"
    ).textContent =
        formatCurrency(total);


    document.getElementById(
        "currentMonthExpenses"
    ).textContent =
        formatCurrency(
            currentMonthTotal
        );


    document.getElementById(
        "averageExpense"
    ).textContent =
        formatCurrency(average);
}

function formatCurrency(
    amount
) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    ).format(amount);
}

function formatDate(
    dateString
) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Invalid date";
    }


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}

function openAddModal() {

    expenseForm.reset();

    clearErrors();


    document.getElementById(
        "expenseId"
    ).value = "";


    document.getElementById(
        "expenseDate"
    ).value =
        getTodayDate();


    modalTitle.textContent =
        "Add Expense";


    expenseModal.classList.remove(
        "hidden"
    );


    document.getElementById(
        "expenseTitle"
    ).focus();
}

function openEditModal(id) {

    const expense =
        expenses.find(
            item =>
                item.id === id
        );


    if (!expense) {

        showMessage(
            "Expense not found.",
            "error"
        );

        return;
    }


    document.getElementById(
        "expenseId"
    ).value =
        expense.id;


    document.getElementById(
        "expenseTitle"
    ).value =
        expense.title;


    document.getElementById(
        "expenseCategory"
    ).value =
        expense.category;


    document.getElementById(
        "expenseAmount"
    ).value =
        expense.amount;


    document.getElementById(
        "expenseDate"
    ).value =
        expense.date;


    document.getElementById(
        "expenseDescription"
    ).value =
        expense.description;


    clearErrors();


    modalTitle.textContent =
        "Edit Expense";


    expenseModal.classList.remove(
        "hidden"
    );
}

function closeExpenseModal() {

    expenseModal.classList.add(
        "hidden"
    );

    expenseForm.reset();

    clearErrors();
}

function openDeleteModal(id) {

    const expense =
        expenses.find(
            item =>
                item.id === id
        );


    if (!expense) {

        showMessage(
            "Expense not found.",
            "error"
        );

        return;
    }


    expenseToDelete = id;


    deleteModal.classList.remove(
        "hidden"
    );
}

function closeDeleteModal() {

    deleteModal.classList.add(
        "hidden"
    );

    expenseToDelete = null;
}

function getTodayDate() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}

function showMessage(
    text,
    type
) {

    message.textContent =
        text;


    message.className =
        `message ${type}`;


    setTimeout(
        () => {

            message.classList.add(
                "hidden"
            );

        },
        3000
    );
}

function escapeHTML(
    value
) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}

expenseForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const data =
            getFormData();


        const errors =
            validateExpense(
                data
            );


        displayErrors(
            errors
        );


        if (
            Object.keys(errors)
                .length > 0
        ) {

            showMessage(
                "Please correct the highlighted fields.",
                "error"
            );

            return;
        }


        const id =
            document.getElementById(
                "expenseId"
            ).value;


        if (id) {

            updateExpense(
                id,
                data
            );

        } else {

            addExpense(
                data
            );
        }


        closeExpenseModal();
    }
);

document
    .getElementById(
        "addExpenseBtn"
    )
    .addEventListener(
        "click",
        openAddModal
    );


document
    .getElementById(
        "emptyAddBtn"
    )
    .addEventListener(
        "click",
        openAddModal
    );

document
    .getElementById(
        "closeModalBtn"
    )
    .addEventListener(
        "click",
        closeExpenseModal
    );


document
    .getElementById(
        "cancelBtn"
    )
    .addEventListener(
        "click",
        closeExpenseModal
    );
document
    .getElementById(
        "cancelDeleteBtn"
    )
    .addEventListener(
        "click",
        closeDeleteModal
    );


document
    .getElementById(
        "confirmDeleteBtn"
    )
    .addEventListener(
        "click",
        function () {

            if (
                expenseToDelete
            ) {

                deleteExpense(
                    expenseToDelete
                );
            }


            closeDeleteModal();
        }
    );
expenseList.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {

            return;
        }


        const action =
            button.dataset.action;


        const id =
            button.dataset.id;


        if (
            action === "edit"
        ) {

            openEditModal(
                id
            );
        }


        if (
            action === "delete"
        ) {

            openDeleteModal(
                id
            );
        }
    }
);
searchInput.addEventListener(
    "input",
    render
);
categoryFilter.addEventListener(
    "change",
    render
);
sortSelect.addEventListener(
    "change",
    render
);
expenseModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            expenseModal
        ) {

            closeExpenseModal();
        }
    }
);


deleteModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            deleteModal
        ) {

            closeDeleteModal();
        }
    }
);

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeExpenseModal();

            closeDeleteModal();
        }
    }
);


/* =====================================================
   APPLICATION START
===================================================== */

loadExpenses();

render();