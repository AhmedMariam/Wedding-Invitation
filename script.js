"use strict";


/* =========================================
   FIREBASE
========================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";


import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


/* =========================================
   NEW FIREBASE PROJECT
   groom-bride-wedding-2026
========================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyDyHRm9JpYhBP4hMuuQDY-XkYYydpoWz3c",

    authDomain:
        "groom-bride-wedding-2026.firebaseapp.com",

    projectId:
        "groom-bride-wedding-2026",

    storageBucket:
        "groom-bride-wedding-2026.firebasestorage.app",

    messagingSenderId:
        "738737147419",

    appId:
        "1:738737147419:web:47d64bbeda233269c132be",

    measurementId:
        "G-XZ6WY XJ4HF"
};


/* =========================================
   INITIALIZE
========================================= */

const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


/* =========================================
   MUSIC
========================================= */

const weddingMusic =
    document.getElementById("weddingMusic");


async function playWeddingMusic() {

    if (!weddingMusic) {
        return;
    }

    try {

        weddingMusic.volume = 0.55;

        await weddingMusic.play();

        removeMusicListeners();

    } catch (error) {

        console.log(
            "Autoplay blocked. Waiting for user interaction."
        );

    }
}


function removeMusicListeners() {

    document.removeEventListener(
        "click",
        playWeddingMusic
    );

    document.removeEventListener(
        "touchstart",
        playWeddingMusic
    );

    document.removeEventListener(
        "keydown",
        playWeddingMusic
    );
}


window.addEventListener(
    "load",
    playWeddingMusic
);


document.addEventListener(
    "click",
    playWeddingMusic
);


document.addEventListener(
    "touchstart",
    playWeddingMusic,
    { passive: true }
);


document.addEventListener(
    "keydown",
    playWeddingMusic
);


/* =========================================
   REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach((element) => {

    revealObserver.observe(element);

});


/* =========================================
   HERO INTRO
========================================= */

window.addEventListener(
    "load",
    () => {

        const heroElements =
            document.querySelectorAll(
                ".hero .reveal"
            );


        heroElements.forEach(
            (element, index) => {

                setTimeout(
                    () => {

                        element.classList.add(
                            "visible"
                        );

                    },
                    200 + index * 180
                );

            }
        );

    }
);


/* =========================================
   COUNTDOWN
========================================= */

const daysElement =
    document.getElementById("days");


const hoursElement =
    document.getElementById("hours");


const minutesElement =
    document.getElementById("minutes");


const secondsElement =
    document.getElementById("seconds");


const weddingDate =
    new Date(
        "2026-10-23T19:30:00+03:00"
    );


function twoDigits(number) {

    return String(number)
        .padStart(2, "0");

}


function updateCountdown() {

    const now =
        new Date();


    const distance =
        weddingDate.getTime()
        -
        now.getTime();


    if (distance <= 0) {

        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        return;
    }


    const days =
        Math.floor(
            distance /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    const hours =
        Math.floor(
            (
                distance /
                (
                    1000 *
                    60 *
                    60
                )
            ) % 24
        );


    const minutes =
        Math.floor(
            (
                distance /
                (
                    1000 *
                    60
                )
            ) % 60
        );


    const seconds =
        Math.floor(
            (
                distance /
                1000
            ) % 60
        );


    daysElement.textContent =
        twoDigits(days);


    hoursElement.textContent =
        twoDigits(hours);


    minutesElement.textContent =
        twoDigits(minutes);


    secondsElement.textContent =
        twoDigits(seconds);

}


updateCountdown();


setInterval(
    updateCountdown,
    1000
);


/* =========================================
   GUEST BOOK
========================================= */

const guestName =
    document.getElementById(
        "guestName"
    );


const guestComment =
    document.getElementById(
        "guestComment"
    );


const sendComment =
    document.getElementById(
        "sendComment"
    );


const commentForm =
    document.getElementById(
        "commentForm"
    );


const commentSuccess =
    document.getElementById(
        "commentSuccess"
    );


const commentsList =
    document.getElementById(
        "commentsList"
    );


const emptyComments =
    document.getElementById(
        "emptyComments"
    );


/* =========================================
   FIRESTORE
========================================= */

const commentsCollection =
    collection(
        db,
        "comments"
    );


const commentsQuery =
    query(
        commentsCollection,
        orderBy(
            "createdAt",
            "desc"
        )
    );


/* =========================================
   DISPLAY COMMENTS
========================================= */

function createCommentElement(comment) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "comment-item";


    const name =
        document.createElement(
            "h4"
        );


    name.textContent =
        comment.name;


    const message =
        document.createElement(
            "p"
        );


    message.textContent =
        comment.message;


    const date =
        document.createElement(
            "small"
        );


    if (
        comment.createdAt &&
        typeof comment.createdAt.toDate ===
        "function"
    ) {

        date.textContent =
            comment.createdAt
                .toDate()
                .toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

    } else {

        date.textContent =
            "Just now";

    }


    article.appendChild(name);

    article.appendChild(message);

    article.appendChild(date);


    return article;
}


/* =========================================
   LIVE COMMENTS
========================================= */

onSnapshot(

    commentsQuery,

    (snapshot) => {

        commentsList.innerHTML = "";


        if (snapshot.empty) {

            commentsList.appendChild(
                emptyComments
            );

            return;
        }


        snapshot.forEach(
            (documentSnapshot) => {

                const comment =
                    documentSnapshot.data();


                commentsList.appendChild(
                    createCommentElement(
                        comment
                    )
                );

            }
        );

    },

    (error) => {

        console.error(
            "Firebase error:",
            error
        );

        commentsList.innerHTML = "";

        commentsList.appendChild(
            emptyComments
        );

    }

);


/* =========================================
   SEND COMMENT
========================================= */

sendComment.addEventListener(
    "click",
    async () => {

        const name =
            guestName.value.trim();


        const message =
            guestComment.value.trim();


        if (!name) {

            guestName.focus();

            return;
        }


        if (!message) {

            guestComment.focus();

            return;
        }


        if (
            name.length > 50 ||
            message.length > 300
        ) {

            return;
        }


        try {

            sendComment.disabled =
                true;


            sendComment.textContent =
                "SENDING...";


            await addDoc(
                commentsCollection,
                {
                    name: name,
                    message: message,
                    createdAt:
                        serverTimestamp()
                }
            );


            guestName.value = "";

            guestComment.value = "";


            commentForm.style.display =
                "none";


            commentSuccess.style.display =
                "block";


            setTimeout(
                () => {

                    commentSuccess.style.display =
                        "none";

                    commentForm.style.display =
                        "block";

                },
                3000
            );


        } catch (error) {

            console.error(
                "Error sending comment:",
                error
            );


            alert(
                "Something went wrong. Please try again."
            );


        } finally {

            sendComment.disabled =
                false;

            sendComment.textContent =
                "♥ SEND YOUR WISH";

        }

    }
);


/* =========================================
   CTRL + ENTER
========================================= */

guestComment.addEventListener(
    "keydown",
    (event) => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            sendComment.click();

        }

    }
);
