let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ================================
// MENYIMPAN DATA
// ================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ================================
// MENAMBAHKAN TUGAS
// ================================

function addTask() {

    const taskInput =
        document.getElementById("taskInput");

    const dateInput =
        document.getElementById("dateInput");


    const title =
        taskInput.value.trim();

    const date =
        dateInput.value;


    // Cek nama tugas
    if (title === "") {

        alert(
            "Silakan masukkan tugas terlebih dahulu!"
        );

        return;
    }


    // Cek tanggal dan jam
    if (date === "") {

        alert(
            "Silakan pilih tanggal dan jam deadline!"
        );

        return;
    }


    // Membuat tugas baru
    const task = {

        id: Date.now(),

        title: title,

        date: date,

        completed: false

    };


    // Masukkan tugas ke array
    tasks.push(task);


    // Simpan
    saveTasks();


    // Kosongkan input
    taskInput.value = "";

    dateInput.value = "";


    // Tampilkan tugas
    displayTasks();

}


// ================================
// FORMAT TANGGAL + JAM INDONESIA
// ================================

function formatDateTime(dateTime) {

    const date = new Date(dateTime);


    return date.toLocaleString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric",

            hour: "2-digit",
            minute: "2-digit",

            hour12: false
        }
    );

}


// ================================
// MENAMPILKAN TUGAS
// ================================

function displayTasks() {

    const taskList =
        document.getElementById("taskList");


    taskList.innerHTML = "";


    let filteredTasks = tasks;


    // Filter belum selesai
    if (currentFilter === "pending") {

        filteredTasks =
            tasks.filter(
                task => !task.completed
            );

    }


    // Filter selesai
    if (currentFilter === "completed") {

        filteredTasks =
            tasks.filter(
                task => task.completed
            );

    }


    // Menampilkan setiap tugas
    filteredTasks.forEach(task => {

        const taskElement =
            document.createElement("div");


        taskElement.className = "task";


        if (task.completed) {

            taskElement.classList.add(
                "completed"
            );

        }


        const formattedDate =
            formatDateTime(task.date);


        taskElement.innerHTML = `

            <div class="task-info">

                <div class="task-title">
                    ${task.title}
                </div>

                <div class="task-date">
                    📅 Deadline:
                    ${formattedDate} WIB
                </div>

            </div>


            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed
                        ? "Batal"
                        : "Selesai"
                    }
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Hapus
                </button>

            </div>

        `;


        taskList.appendChild(
            taskElement
        );

    });


    // Update statistik
    updateStats();

}


// ================================
// SELESAI / BELUM SELESAI
// ================================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed =
                !task.completed;

        }

        return task;

    });


    saveTasks();

    displayTasks();

}


// ================================
// HAPUS TUGAS
// ================================

function deleteTask(id) {

    const confirmation =
        confirm(
            "Apakah kamu yakin ingin menghapus tugas ini?"
        );


    if (!confirmation) {

        return;

    }


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    displayTasks();

}


// ================================
// FILTER TUGAS
// ================================

function filterTasks(filter) {

    currentFilter = filter;

    displayTasks();

}


// ================================
// UPDATE STATISTIK
// ================================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    document.getElementById(
        "totalTask"
    ).textContent = total;


    document.getElementById(
        "completedTask"
    ).textContent = completed;


    document.getElementById(
        "pendingTask"
    ).textContent = pending;

}


// ================================
// JALANKAN SAAT WEBSITE DIBUKA
// ================================

displayTasks();