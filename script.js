// ==================================================
// DATA
// ==================================================

let tasks =
    JSON.parse(
        localStorage.getItem("studentTasks")
    ) || [];


let currentFilter = "all";

let editTaskId = null;


// Kalender

let calendarDate = new Date();


// ==================================================
// SIMPAN DATA
// ==================================================

function saveData() {

    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );

}


// ==================================================
// TAMBAH / EDIT TUGAS
// ==================================================

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


    const priority =
        document.getElementById(
            "priorityInput"
        ).value;


    if (!course) {

        alert(
            "Silakan pilih mata kuliah!"
        );

        return;

    }


    if (!title) {

        alert(
            "Silakan masukkan nama tugas!"
        );

        return;

    }


    if (!date) {

        alert(
            "Silakan pilih tanggal deadline!"
        );

        return;

    }


    if (!time) {

        alert(
            "Silakan pilih jam deadline!"
        );

        return;

    }


    // ==============================================
    // EDIT
    // ==============================================

    if (editTaskId !== null) {

        tasks =
            tasks.map(
                task => {

                    if (
                        task.id === editTaskId
                    ) {

                        return {

                            ...task,

                            course,

                            title,

                            date,

                            time,

                            priority

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


    // ==============================================
    // TAMBAH
    // ==============================================

    else {

        tasks.push({

            id: Date.now(),

            course,

            title,

            date,

            time,

            priority,

            completed: false

        });

    }


    saveData();

    clearForm();

    displayTasks();

    renderCalendar();

}


// ==================================================
// CLEAR FORM
// ==================================================

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


    document.getElementById(
        "priorityInput"
    ).value = "medium";

}


// ==================================================
// FORMAT TANGGAL INDONESIA
// ==================================================

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


// ==================================================
// PRIORITAS
// ==================================================

function getPriority(priority) {

    if (priority === "high") {

        return {

            text: "🔴 Prioritas Tinggi",

            className:
                "priority-high"

        };

    }


    if (priority === "low") {

        return {

            text: "🟢 Prioritas Rendah",

            className:
                "priority-low"

        };

    }


    return {

        text: "🟡 Prioritas Sedang",

        className:
            "priority-medium"

    };

}


// ==================================================
// STATUS DEADLINE
// ==================================================

function getDeadlineStatus(task) {

    if (task.completed) {

        return {

            text: "✅ Tugas selesai",

            className:
                "status-completed"

        };

    }


    const now =
        new Date();


    const deadline =
        new Date(
            `${task.date}T${task.time}`
        );


    // Terlambat

    if (
        deadline.getTime() <
        now.getTime()
    ) {

        return {

            text: "⚠️ Terlambat",

            className:
                "status-late"

        };

    }


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const tomorrow =
        new Date(today);

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    const deadlineDate =
        new Date(deadline);

    deadlineDate.setHours(
        0,
        0,
        0,
        0
    );


    if (
        deadlineDate.getTime() ===
        today.getTime()
    ) {

        return {

            text: "🔴 Deadline hari ini",

            className:
                "status-today"

        };

    }


    if (
        deadlineDate.getTime() ===
        tomorrow.getTime()
    ) {

        return {

            text: "🟠 Deadline besok",

            className:
                "status-tomorrow"

        };

    }


    return {

        text: "🟢 Masih aman",

        className:
            "status-safe"

    };

}


// ==================================================
// TAMPILKAN TUGAS
// ==================================================

function displayTasks() {

    const list =
        document.getElementById(
            "taskList"
        );


    list.innerHTML = "";


    const search =
        document.getElementById(
            "searchInput"
        ).value
            .toLowerCase()
            .trim();


    const sort =
        document.getElementById(
            "sortInput"
        ).value;


    let filtered =
        tasks.filter(
            task => {

                return (

                    task.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    task.course
                        .toLowerCase()
                        .includes(search)

                );

            }
        );


    // Filter status

    if (
        currentFilter === "pending"
    ) {

        filtered =
            filtered.filter(
                task =>
                    !task.completed
            );

    }


    if (
        currentFilter === "completed"
    ) {

        filtered =
            filtered.filter(
                task =>
                    task.completed
            );

    }


    // ==================================================
    // SORTING
    // ==================================================

    if (sort === "nearest") {

        filtered.sort(
            (a, b) => {

                return getDeadline(a)
                    - getDeadline(b);

            }
        );

    }


    if (sort === "farthest") {

        filtered.sort(
            (a, b) => {

                return getDeadline(b)
                    - getDeadline(a);

            }
        );

    }


    if (sort === "name") {

        filtered.sort(
            (a, b) =>

                a.title.localeCompare(
                    b.title
                )

        );

    }


    if (sort === "priority") {

        const order = {

            high: 1,

            medium: 2,

            low: 3

        };


        filtered.sort(
            (a, b) =>

                order[a.priority]
                -
                order[b.priority]

        );

    }


    // ==================================================
    // KOSONG
    // ==================================================

    if (
        filtered.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-task">

                📋 Tidak ada tugas ditemukan.

            </div>

        `;

        updateStats();

        return;

    }


    // ==================================================
    // TAMPILKAN
    // ==================================================

    filtered.forEach(
        task => {

            const priority =
                getPriority(
                    task.priority
                );


            const status =
                getDeadlineStatus(
                    task
                );


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "task";


            if (
                task.completed
            ) {

                element.classList.add(
                    "completed"
                );

            }


            element.innerHTML = `

                <div class="task-info">

                    <div class="course-name">

                        📚 ${task.course}

                    </div>


                    <div class="task-title">

                        ${task.title}

                    </div>


                    <div class="task-date">

                        📅 ${formatDate(task.date)}

                        &nbsp;&nbsp;

                        🕐 ${task.time} WIB

                    </div>


                    <span
                        class="priority ${priority.className}"
                    >

                        ${priority.text}

                    </span>


                    <span
                        class="
                            deadline-status
                            ${status.className}
                        "
                    >

                        ${status.text}

                    </span>

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
                            ? "↩ Batal"
                            : "✅ Selesai"
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


            list.appendChild(
                element
            );

        }
    );


    updateStats();

}


// ==================================================
// DEADLINE DATE
// ==================================================

function getDeadline(task) {

    return new Date(
        `${task.date}T${task.time}`
    ).getTime();

}


// ==================================================
// STATISTIK
// ==================================================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const pending =
        tasks.filter(
            task =>
                !task.completed
        ).length;


    const late =
        tasks.filter(
            task => {

                return (

                    !task.completed

                    &&

                    getDeadline(task)
                    <
                    Date.now()

                );

            }
        ).length;


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


    document.getElementById(
        "lateTask"
    ).textContent =
        late;


    // Progress

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


// ==================================================
// EDIT
// ==================================================

function editTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (!task) return;


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


    document.getElementById(
        "priorityInput"
    ).value =
        task.priority;


    editTaskId =
        id;


    document.getElementById(
        "formTitle"
    ).textContent =
        "✏️ Edit Tugas";


    document.getElementById(
        "saveButton"
    ).textContent =
        "💾 Simpan Perubahan";


    document.getElementById(
        "cancelButton"
    ).style.display =
        "block";


    document.getElementById(
        "formTitle"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


// ==================================================
// BATAL EDIT
// ==================================================

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


// ==================================================
// SELESAI
// ==================================================

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


    saveData();

    displayTasks();

    renderCalendar();

}


// ==================================================
// HAPUS
// ==================================================

function deleteTask(id) {

    if (
        !confirm(
            "Yakin ingin menghapus tugas ini?"
        )
    ) {

        return;

    }


    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );


    saveData();

    displayTasks();

    renderCalendar();

}


// ==================================================
// FILTER
// ==================================================

function filterTasks(filter) {

    currentFilter =
        filter;

    displayTasks();

}


// ==================================================
// KALENDER
// ==================================================

function renderCalendar() {

    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();


    const monthNames = [

        "Januari",

        "Februari",

        "Maret",

        "April",

        "Mei",

        "Juni",

        "Juli",

        "Agustus",

        "September",

        "Oktober",

        "November",

        "Desember"

    ];


    document.getElementById(
        "calendarTitle"
    ).textContent =

        `${monthNames[month]} ${year}`;


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    let startDay =
        firstDay.getDay();


    // Senin sebagai hari pertama

    startDay =
        startDay === 0
        ? 6
        : startDay - 1;


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const calendar =
        document.getElementById(
            "calendarDays"
        );


    calendar.innerHTML = "";


    // Hari kosong

    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "calendar-day";

        calendar.appendChild(
            empty
        );

    }


    // Tanggal

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.className =
            "calendar-day";


        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        const dateTasks =
            tasks.filter(
                task =>
                    task.date === dateString
            );


        // Hari ini

        const today =
            new Date();


        if (

            day ===
                today.getDate()

            &&

            month ===
                today.getMonth()

            &&

            year ===
                today.getFullYear()

        ) {

            element.classList.add(
                "today"
            );

        }


        if (
            dateTasks.length > 0
        ) {

            element.classList.add(
                "has-task"
            );

        }


        element.innerHTML = `

            ${day}

            ${
                dateTasks.length > 0
                ? `<span class="task-dot"></span>`
                : ""
            }

        `;


        element.onclick =
            function() {

                showDateTasks(
                    dateString
                );

            };


        calendar.appendChild(
            element
        );

    }

}


// ==================================================
// KALENDER SEBELUMNYA
// ==================================================

function previousMonth() {

    calendarDate.setMonth(
        calendarDate.getMonth() - 1
    );

    renderCalendar();

}


// ==================================================
// KALENDER BERIKUTNYA
// ==================================================

function nextMonth() {

    calendarDate.setMonth(
        calendarDate.getMonth() + 1
    );

    renderCalendar();

}


// ==================================================
// TAMPILKAN TUGAS PADA TANGGAL
// ==================================================

function showDateTasks(date) {

    const box =
        document.getElementById(
            "selectedDateTasks"
        );


    const dateTasks =
        tasks.filter(
            task =>
                task.date === date
        );


    box.innerHTML = `

        <h3>
            📅 ${formatDate(date)}
        </h3>

    `;


    if (
        dateTasks.length === 0
    ) {

        box.innerHTML += `

            <p>
                Tidak ada tugas pada tanggal ini.
            </p>

        `;

        return;

    }


    dateTasks.forEach(
        task => {

            box.innerHTML += `

                <div class="calendar-task">

                    <strong>
                        📚 ${task.course}
                    </strong>

                    <br>

                    ${task.title}

                    <br>

                    🕐 ${task.time} WIB

                </div>

            `;

        }
    );

}


// ==================================================
// DARK MODE
// ==================================================

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    const dark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "darkMode",
        dark
    );


    document.getElementById(
        "darkButton"
    ).textContent =
        dark
        ? "☀️"
        : "🌙";

}


// ==================================================
// LOAD DARK MODE
// ==================================================

function loadDarkMode() {

    const dark =
        localStorage.getItem(
            "darkMode"
        );


    if (dark === "true") {

        document.body.classList.add(
            "dark"
        );


        document.getElementById(
            "darkButton"
        ).textContent =
            "☀️";

    }

}


// ==================================================
// NOTIFIKASI DEADLINE
// ==================================================

function requestNotificationPermission() {

    if (
        "Notification" in window
    ) {

        Notification.requestPermission();

    }

}


// ==================================================
// CEK DEADLINE
// ==================================================

function checkNotifications() {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission !==
        "granted"
    ) {

        return;

    }


    const today =
        new Date();


    tasks.forEach(
        task => {

            if (
                task.completed
            ) {

                return;

            }


            const deadline =
                new Date(
                    `${task.date}T${task.time}`
                );


            const difference =
                deadline - today;


            const oneDay =
                24 * 60 * 60 * 1000;


            // Deadline kurang dari 24 jam

            if (
                difference > 0
                &&
                difference <= oneDay
            ) {

                const notificationKey =
                    `notif-${task.id}-${task.date}-${task.time}`;


                if (
                    !localStorage.getItem(
                        notificationKey
                    )
                ) {

                    new Notification(
                        "🔔 StudentTask",
                        {

                            body:
                                `${task.title} - ${task.course} deadline kurang dari 24 jam.`

                        }
                    );


                    localStorage.setItem(
                        notificationKey,
                        "true"
                    );

                }

            }

        }
    );

}


// ==================================================
// JALANKAN NOTIFIKASI
// ==================================================

function enableNotifications() {

    if (
        "Notification" in window
    ) {

        Notification.requestPermission()
            .then(
                permission => {

                    if (
                        permission ===
                        "granted"
                    ) {

                        alert(
                            "🔔 Notifikasi berhasil diaktifkan!"
                        );

                        checkNotifications();

                    }

                }
            );

    }

}


// ==================================================
// AUTO REFRESH STATUS
// ==================================================

setInterval(
    function() {

        displayTasks();

        renderCalendar();

        checkNotifications();

    },
    60000
);


// ==================================================
// TAMBAHKAN TOMBOL NOTIFIKASI
// ==================================================

const header =
    document.querySelector(
        ".header-top"
    );


const notificationButton =
    document.createElement(
        "button"
    );


notificationButton.className =
    "dark-button";


notificationButton.textContent =
    "🔔";


notificationButton.title =
    "Aktifkan notifikasi";


notificationButton.onclick =
    enableNotifications;


header.appendChild(
    notificationButton
);


// ==================================================
// START
// ==================================================

loadDarkMode();

displayTasks();

renderCalendar();

checkNotifications();