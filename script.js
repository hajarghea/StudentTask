// ============================================
// DATA
// ============================================

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];


let currentFilter = "all";

let editTaskId = null;


// ============================================
// SIMPAN DATA
// ============================================

function saveTasksToStorage() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ============================================
// SIMPAN / TAMBAH / EDIT TUGAS
// ============================================

function saveTask() {

    const course =
        document.getElementById(
            "courseInput"
        ).value;


    const title =
        document.getElementById(
            "taskInput"
        ).value.trim();


    const date =
        document.getElementById(
            "dateInput"
        ).value;


    const time =
        document.getElementById(
            "timeInput"
        ).value;


    // ========================================
    // VALIDASI
    // ========================================

    if (course === "") {

        alert(
            "Silakan pilih mata kuliah!"
        );

        return;

    }


    if (title === "") {

        alert(
            "Silakan masukkan nama tugas!"
        );

        return;

    }


    if (date === "") {

        alert(
            "Silakan pilih tanggal deadline!"
        );

        return;

    }


    if (time === "") {

        alert(
            "Silakan pilih jam deadline!"
        );

        return;

    }


    // ========================================
    // MODE EDIT
    // ========================================

    if (editTaskId !== null) {

        tasks =
            tasks.map(
                task => {

                    if (
                        task.id === editTaskId
                    ) {

                        return {

                            ...task,

                            course: course,

                            title: title,

                            date: date,

                            time: time

                        };

                    }

                    return task;

                }
            );


        alert(
            "Tugas berhasil diperbarui!"
        );


        cancelEdit();

    }


    // ========================================
    // MODE TAMBAH
    // ========================================

    else {

        const newTask = {

            id: Date.now(),

            course: course,

            title: title,

            date: date,

            time: time,

            completed: false

        };


        tasks.push(newTask);

    }


    saveTasksToStorage();

    clearForm();

    displayTasks();

}


// ============================================
// BERSIHKAN FORM
// ============================================

function clearForm() {

    document.getElementById(
        "courseInput"
    ).value = "";


    document.getElementById(
        "taskInput"
    ).value = "";


    document.getElementById(
        "dateInput"
    ).value = "";


    document.getElementById(
        "timeInput"
    ).value = "";

}


// ============================================
// FORMAT TANGGAL INDONESIA
// ============================================

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "id-ID",
        {

            day: "numeric",

            month: "long",

            year: "numeric"

        }
    );

}


// ============================================
// STATUS DEADLINE
// ============================================

function getDeadlineStatus(task) {

    // Jika selesai
    if (task.completed) {

        return {

            className:
                "status-completed",

            icon: "✅",

            text: "Tugas selesai"

        };

    }


    const now =
        new Date();


    const deadline =
        new Date(
            `${task.date}T${task.time}`
        );


    // ========================================
    // TERLAMBAT
    // ========================================

    if (
        deadline.getTime() <
        now.getTime()
    ) {

        return {

            className:
                "status-late",

            icon: "⚠️",

            text: "Terlambat"

        };

    }


    // ========================================
    // TANGGAL HARI INI
    // ========================================

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    // ========================================
    // TANGGAL BESOK
    // ========================================

    const tomorrow =
        new Date(today);

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    // Tanggal deadline
    const deadlineDate =
        new Date(deadline);

    deadlineDate.setHours(
        0,
        0,
        0,
        0
    );


    // ========================================
    // DEADLINE HARI INI
    // ========================================

    if (
        deadlineDate.getTime() ===
        today.getTime()
    ) {

        return {

            className:
                "status-today",

            icon: "🔴",

            text: "Deadline hari ini"

        };

    }


    // ========================================
    // DEADLINE BESOK
    // ========================================

    if (
        deadlineDate.getTime() ===
        tomorrow.getTime()
    ) {

        return {

            className:
                "status-tomorrow",

            icon: "🟠",

            text: "Deadline besok"

        };

    }


    // ========================================
    // MASIH AMAN
    // ========================================

    return {

        className:
            "status-safe",

        icon: "🟢",

        text: "Masih aman"

    };

}


// ============================================
// TAMPILKAN TUGAS
// ============================================

function displayTasks() {

    const taskList =
        document.getElementById(
            "taskList"
        );


    taskList.innerHTML = "";


    // ========================================
    // PENCARIAN
    // ========================================

    const search =
        document.getElementById(
            "searchInput"
        ).value
            .toLowerCase()
            .trim();


    let filteredTasks =
        tasks.filter(
            task => {

                const course =
                    task.course ||
                    "";


                const title =
                    task.title ||
                    "";


                return (

                    course
                        .toLowerCase()
                        .includes(search)

                    ||

                    title
                        .toLowerCase()
                        .includes(search)

                );

            }
        );


    // ========================================
    // FILTER STATUS
    // ========================================

    if (
        currentFilter === "pending"
    ) {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    !task.completed
            );

    }


    if (
        currentFilter === "completed"
    ) {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.completed
            );

    }


    // ========================================
    // JIKA TIDAK ADA TUGAS
    // ========================================

    if (
        filteredTasks.length === 0
    ) {

        taskList.innerHTML = `

            <div class="empty-task">

                📋 Tidak ada tugas ditemukan.

            </div>

        `;

        updateStats();

        return;

    }


    // ========================================
    // TAMPILKAN TUGAS
    // ========================================

    filteredTasks.forEach(
        task => {

            const taskElement =
                document.createElement(
                    "div"
                );


            taskElement.className =
                "task";


            if (task.completed) {

                taskElement.classList.add(
                    "completed"
                );

            }


            const formattedDate =
                formatDate(
                    task.date
                );


            const deadlineStatus =
                getDeadlineStatus(
                    task
                );


            taskElement.innerHTML = `

                <div class="task-info">

                    <div class="course-name">

                        📚 ${
                            task.course ||
                            "Mata Kuliah"
                        }

                    </div>


                    <div class="task-title">

                        ${
                            task.title
                        }

                    </div>


                    <div class="task-date">

                        📅 ${formattedDate}

                        &nbsp;&nbsp;

                        🕐 ${task.time} WIB

                    </div>


                    <div
                        class="
                            deadline-status
                            ${deadlineStatus.className}
                        "
                    >

                        ${deadlineStatus.icon}

                        ${deadlineStatus.text}

                    </div>

                </div>


                <div class="task-actions">

                    <button
                        class="complete-btn"
                        onclick="
                            toggleTask(${task.id})
                        "
                    >

                        ${
                            task.completed
                                ? "Batal"
                                : "Selesai"
                        }

                    </button>


                    <button
                        class="edit-btn"
                        onclick="
                            editTask(${task.id})
                        "
                    >

                        ✏️ Edit

                    </button>


                    <button
                        class="delete-btn"
                        onclick="
                            deleteTask(${task.id})
                        "
                    >

                        🗑️ Hapus

                    </button>

                </div>

            `;


            taskList.appendChild(
                taskElement
            );

        }
    );


    updateStats();

}


// ============================================
// EDIT TUGAS
// ============================================

function editTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (!task) {

        return;

    }


    // Masukkan data ke form

    document.getElementById(
        "courseInput"
    ).value =
        task.course;


    document.getElementById(
        "taskInput"
    ).value =
        task.title;


    document.getElementById(
        "dateInput"
    ).value =
        task.date;


    document.getElementById(
        "timeInput"
    ).value =
        task.time;


    // Simpan ID tugas yang diedit

    editTaskId = id;


    // Ubah judul form

    document.getElementById(
        "formTitle"
    ).textContent =
        "✏️ Edit Tugas";


    // Ubah tombol

    document.getElementById(
        "saveButton"
    ).textContent =
        "💾 Simpan Perubahan";


    // Tampilkan tombol batal

    document.getElementById(
        "cancelButton"
    ).style.display =
        "block";


    // Scroll ke form

    document.getElementById(
        "formTitle"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


// ============================================
// BATAL EDIT
// ============================================

function cancelEdit() {

    editTaskId = null;


    document.getElementById(
        "formTitle"
    ).textContent =
        "➕ Tambah Tugas";


    document.getElementById(
        "saveButton"
    ).textContent =
        "+ Tambah Tugas";


    document.getElementById(
        "cancelButton"
    ).style.display =
        "none";


    clearForm();

}


// ============================================
// TANDAI SELESAI
// ============================================

function toggleTask(id) {

    tasks =
        tasks.map(
            task => {

                if (
                    task.id === id
                ) {

                    return {

                        ...task,

                        completed:
                            !task.completed

                    };

                }


                return task;

            }
        );


    saveTasksToStorage();

    displayTasks();

}


// ============================================
// HAPUS TUGAS
// ============================================

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Apakah kamu yakin ingin menghapus tugas ini?"
        );


    if (!confirmDelete) {

        return;

    }


    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );


    saveTasksToStorage();

    displayTasks();

}


// ============================================
// FILTER
// ============================================

function filterTasks(filter) {

    currentFilter =
        filter;

    displayTasks();

}


// ============================================
// STATISTIK + PROGRESS
// ============================================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const pending =
        total - completed;


    // ========================================
    // STATISTIK
    // ========================================

    document.getElementById(
        "totalTask"
    ).textContent =
        total;


    document.getElementById(
        "completedTask"
    ).textContent =
        completed;


    document.getElementById(
        "pendingTask"
    ).textContent =
        pending;


    // ========================================
    // PROGRESS
    // ========================================

    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    document.getElementById(
        "progressText"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "progressFill"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "progressDetail"
    ).textContent =

        `${completed} dari ${total} tugas selesai`;

}


// ============================================
// UPDATE STATUS DEADLINE OTOMATIS
// ============================================

setInterval(
    displayTasks,
    60000
);


// ============================================
// JALANKAN SAAT WEBSITE DIBUKA
// ============================================

displayTasks();