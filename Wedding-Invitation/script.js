"use strict";


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
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


/* ========================================
   FIREBASE CONFIG
======================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyCxv19Fw1A58cQV08t0xEoICEtURF6wydM",

    authDomain:
        "wedding-invitation-55bca.firebaseapp.com",

    projectId:
        "wedding-invitation-55bca",

    storageBucket:
        "wedding-invitation-55bca.firebasestorage.app",

    messagingSenderId:
        "690183976618",

    appId:
        "1:690183976618:web:4cbf61c25a3ccbd38082d3"

};


/* ========================================
   INITIALIZE FIREBASE
======================================== */

const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


/* ========================================
   REVEAL ON SCROLL
======================================== */

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
            threshold: 0.12,

            rootMargin:
                "0px 0px -35px 0px"
        }

    );


revealElements.forEach((element) => {

    revealObserver.observe(element);

});


/* ========================================
   HERO INTRO
======================================== */

window.addEventListener("load", () => {

    const heroElements =
        document.querySelectorAll(
            ".hero .reveal"
        );


    heroElements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add(
                    "visible"
                );

            }, 180 + index * 180);

        }
    );

});


/* ========================================
   PHOTO LIGHTBOX
======================================== */

const galleryItems =
    document.querySelectorAll(
        ".gallery-item"
    );


const lightbox =
    document.getElementById(
        "lightbox"
    );


const lightboxImage =
    document.getElementById(
        "lightboxImage"
    );


const lightboxClose =
    document.getElementById(
        "lightboxClose"
    );


galleryItems.forEach((item) => {

    item.addEventListener(
        "click",
        () => {

            const image =
                item.dataset.image;


            lightboxImage.src =
                image;


            lightbox.classList.add(
                "active"
            );


            document.body.style.overflow =
                "hidden";

        }
    );

});


function closeLightbox() {

    lightbox.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";


    setTimeout(() => {

        lightboxImage.src = "";

    }, 350);

}


lightboxClose.addEventListener(
    "click",
    closeLightbox
);


lightbox.addEventListener(
    "click",
    (event) => {

        if (
            event.target === lightbox
        ) {

            closeLightbox();

        }

    }
);


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
            &&
            lightbox.classList.contains(
                "active"
            )
        ) {

            closeLightbox();

        }

    }
);


/* ========================================
   COUNTDOWN
======================================== */

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
        "2026-08-21T19:00:00+03:00"
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

        daysElement.textContent =
            "00";

        hoursElement.textContent =
            "00";

        minutesElement.textContent =
            "00";

        secondsElement.textContent =
            "00";

        return;

    }


    const days =
        Math.floor(
            distance
            /
            (
                1000
                *
                60
                *
                60
                *
                24
            )
        );


    const hours =
        Math.floor(
            (
                distance
                /
                (
                    1000
                    *
                    60
                    *
                    60
                )
            )
            %
            24
        );


    const minutes =
        Math.floor(
            (
                distance
                /
                (
                    1000
                    *
                    60
                )
            )
            %
            60
        );


    const seconds =
        Math.floor(
            (
                distance
                /
                1000
            )
            %
            60
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


/* ========================================
   GUEST BOOK
======================================== */

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


/* ========================================
   FIRESTORE COLLECTION
======================================== */

const commentsCollection =
    collection(
        db,
        "comments"
    );


/* ========================================
   VALIDATION
======================================== */

function showInputError(element) {

    element.style.borderColor =
        "#ac626c";


    element.focus();


    setTimeout(() => {

        element.style.borderColor =
            "";

    }, 1300);

}


/* ========================================
   CREATE COMMENT ELEMENT
======================================== */

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


    /* ========================================
       FORMAT FIREBASE DATE
    ======================================== */

    if (
        comment.createdAt
        &&
        typeof comment.createdAt.toDate
        ===
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


/* ========================================
   SHOW EMPTY COMMENTS
======================================== */

function showEmptyComments() {

    commentsList.innerHTML = "";


    commentsList.appendChild(
        emptyComments
    );

}


/* ========================================
   LOAD COMMENTS FROM FIREBASE
======================================== */

const commentsQuery =
    query(
        commentsCollection,
        orderBy(
            "createdAt",
            "desc"
        )
    );


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


        snapshot.forEach((documentSnapshot) => {

            const comment =
                documentSnapshot.data();


            commentsList.appendChild(
                createCommentElement(
                    comment
                )
            );

        });

    },

    (error) => {

        console.error(
            "Error loading comments:",
            error
        );


        showEmptyComments();

    }

);


/* ========================================
   BUTTON LOADING STATE
======================================== */

function setButtonLoading(isLoading) {

    sendComment.disabled =
        isLoading;


    if (isLoading) {

        sendComment.dataset.originalText =
            sendComment.innerHTML;


        sendComment.textContent =
            "جاري إرسال التهنئة...";

    } else {

        sendComment.innerHTML =
            sendComment.dataset.originalText
            ||
            "♥ إرسال التهنئة";

    }

}


/* ========================================
   SEND COMMENT TO FIREBASE
======================================== */

sendComment.addEventListener(

    "click",

    async () => {

        const name =
            guestName.value.trim();


        const message =
            guestComment.value.trim();


        /* ========================================
           NAME VALIDATION
        ======================================== */

        if (!name) {

            showInputError(
                guestName
            );

            return;

        }


        if (name.length > 50) {

            showInputError(
                guestName
            );

            return;

        }


        /* ========================================
           MESSAGE VALIDATION
        ======================================== */

        if (!message) {

            showInputError(
                guestComment
            );

            return;

        }


        if (message.length > 300) {

            showInputError(
                guestComment
            );

            return;

        }


        /* ========================================
           SEND TO FIRESTORE
        ======================================== */

        try {

            setButtonLoading(true);


            await addDoc(

                commentsCollection,

                {

                    name: name,

                    message: message,

                    createdAt:
                        serverTimestamp()

                }

            );


            /* ========================================
               SUCCESS
            ======================================== */

            guestName.value =
                "";


            guestComment.value =
                "";


            commentForm.style.display =
                "none";


            commentSuccess.style.display =
                "block";


            setTimeout(() => {

                commentSuccess.style.display =
                    "none";


                commentForm.style.display =
                    "block";

            }, 3000);


        } catch (error) {

            console.error(
                "Error sending comment:",
                error
            );


            alert(
                "حصلت مشكلة أثناء إرسال التهنئة. حاول مرة أخرى."
            );


        } finally {

            setButtonLoading(false);

        }

    }

);


/* ========================================
   CTRL + ENTER TO SEND
======================================== */

guestComment.addEventListener(

    "keydown",

    (event) => {

        if (
            event.ctrlKey
            &&
            event.key === "Enter"
        ) {

            sendComment.click();

        }

    }

);