/* ========================================
   FIREBASE
======================================== */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDHyRmJ9pYhBP4hMuuQDY-XkYYydpoWz3c",
    authDomain: "groom-bride-wedding-2026.firebaseapp.com",
    projectId: "groom-bride-wedding-2026",
    storageBucket: "groom-bride-wedding-2026.firebasestorage.app",
    messagingSenderId: "738737147419",
    appId: "1:738737147419:web:47d64bbeda233269c132be",
    measurementId: "G-XZ6WYXJ4HF"
};


let db = null;


/* ========================================
   INITIALIZE FIREBASE SAFELY
======================================== */

try {

    const app = initializeApp(firebaseConfig);

    db = getFirestore(app);

    console.log("Firebase connected successfully.");

} catch (error) {

    console.error(
        "Firebase initialization failed:",
        error
    );

}


/* ========================================
   MUSIC
======================================== */

const music =
    document.getElementById("weddingMusic");


if (music) {

    music.volume = 0.45;

    const playMusic = () => {

        music.play().catch(() => {
            // Browser blocked autoplay.
        });

    };


    playMusic();


    document.addEventListener(
        "click",
        playMusic,
        { once: true }
    );

}


/* ========================================
   REVEAL ANIMATION
======================================== */

document
    .querySelectorAll(".reveal")
    .forEach((element) => {

        element.classList.add("visible");

    });


/* ========================================
   COUNTDOWN
======================================== */

const weddingDate =
    new Date(
        "2026-10-23T19:30:00+03:00"
    ).getTime();


const daysElement =
    document.getElementById("days");

const hoursElement =
    document.getElementById("hours");

const minutesElement =
    document.getElementById("minutes");

const secondsElement =
    document.getElementById("seconds");


function updateCountdown() {

    const now = Date.now();

    const difference =
        weddingDate - now;


    if (difference <= 0) {

        if (daysElement)
            daysElement.textContent = "00";

        if (hoursElement)
            hoursElement.textContent = "00";

        if (minutesElement)
            minutesElement.textContent = "00";

        if (secondsElement)
            secondsElement.textContent = "00";

        return;
    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (difference %
                (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (difference %
                (1000 * 60 * 60)) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (difference %
                (1000 * 60)) /
            1000
        );


    if (daysElement)
        daysElement.textContent =
            String(days).padStart(2, "0");


    if (hoursElement)
        hoursElement.textContent =
            String(hours).padStart(2, "0");


    if (minutesElement)
        minutesElement.textContent =
            String(minutes).padStart(2, "0");


    if (secondsElement)
        secondsElement.textContent =
            String(seconds).padStart(2, "0");

}


updateCountdown();


setInterval(
    updateCountdown,
    1000
);


/* ========================================
   GUEST BOOK ELEMENTS
======================================== */

const guestName =
    document.getElementById("guestName");

const guestComment =
    document.getElementById("guestComment");

const sendComment =
    document.getElementById("sendComment");

const commentForm =
    document.getElementById("commentForm");

const commentSuccess =
    document.getElementById("commentSuccess");

const commentsList =
    document.getElementById("commentsList");

const emptyComments =
    document.getElementById("emptyComments");


/* ========================================
   ADD COMMENT
======================================== */

async function submitComment() {

    if (!db) {

        alert(
            "The guest book is temporarily unavailable. Please try again later."
        );

        return;
    }


    const name =
        guestName?.value.trim() || "";

    const message =
        guestComment?.value.trim() || "";


    if (!name) {

        alert("Please enter your name.");

        guestName?.focus();

        return;
    }


    if (!message) {

        alert("Please write your message.");

        guestComment?.focus();

        return;
    }


    if (name.length < 2) {

        alert(
            "Please enter a valid name."
        );

        guestName?.focus();

        return;
    }


    if (message.length < 2) {

        alert(
            "Please write a longer message."
        );

        guestComment?.focus();

        return;
    }


    if (sendComment) {

        sendComment.disabled = true;

        sendComment.textContent =
            "SENDING...";
    }


    try {

        await addDoc(
            collection(db, "comments"),
            {
                name: name,
                message: message,
                createdAt: serverTimestamp()
            }
        );


        if (commentForm)
            commentForm.style.display =
                "none";


        if (commentSuccess)
            commentSuccess.style.display =
                "block";


        if (guestName)
            guestName.value = "";


        if (guestComment)
            guestComment.value = "";


    } catch (error) {

        console.error(
            "Error adding comment:",
            error
        );


        alert(
            "Something went wrong. Please try again."
        );

    } finally {

        if (sendComment) {

            sendComment.disabled = false;

            sendComment.textContent =
                "♥ SEND YOUR WISH";
        }

    }

}


/* ========================================
   SEND BUTTON
======================================== */

if (sendComment) {

    sendComment.addEventListener(
        "click",
        submitComment
    );

}


/* ========================================
   CTRL + ENTER
======================================== */

if (guestComment) {

    guestComment.addEventListener(
        "keydown",
        (event) => {

            if (
                event.ctrlKey &&
                event.key === "Enter"
            ) {

                submitComment();

            }

        }
    );

}


/* ========================================
   LOAD COMMENTS
======================================== */

function loadComments() {

    if (!db || !commentsList)
        return;


    const commentsQuery =
        query(
            collection(db, "comments"),
            orderBy(
                "createdAt",
                "desc"
            ),
            limit(50)
        );


    onSnapshot(
        commentsQuery,

        (snapshot) => {

            commentsList.innerHTML = "";


            if (snapshot.empty) {

                const empty =
                    document.createElement("div");

                empty.className =
                    "empty-comments";


                empty.innerHTML = `
                    <span>❦</span>
                    <p>Be the first to leave a message.</p>
                `;


                commentsList.appendChild(
                    empty
                );

                return;
            }


            snapshot.forEach(
                (doc) => {

                    const data =
                        doc.data();


                    const item =
                        document.createElement("div");

                    item.className =
                        "comment-item";


                    const name =
                        document.createElement("h4");

                    name.textContent =
                        data.name || "Guest";


                    const message =
                        document.createElement("p");

                    message.textContent =
                        data.message || "";


                    const date =
                        document.createElement("small");


                    if (
                        data.createdAt &&
                        typeof data.createdAt.toDate ===
                        "function"
                    ) {

                        date.textContent =
                            data.createdAt
                                .toDate()
                                .toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    }
                                );

                    } else {

                        date.textContent =
                            "Recently";
                    }


                    item.appendChild(name);

                    item.appendChild(message);

                    item.appendChild(date);


                    commentsList.appendChild(
                        item
                    );

                }
            );

        },

        (error) => {

            console.error(
                "Error loading comments:",
                error
            );

        }
    );

}


loadComments();


/* ========================================
   FINAL SAFETY
======================================== */

window.addEventListener(
    "error",
    (event) => {

        console.error(
            "Page error:",
            event.error
        );

    }
);


console.log(
    "Mohamed & Alaa Wedding Invitation loaded."
);
