"use strict";


/* ========================================
   FIREBASE IMPORTS
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
   NEW WEDDING PROJECT
======================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyDHyRmJpYhBP4hMuuQDY-XkYYydpoWz3c",

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
        "G-XZ6WYXJ4HF"

};


/* ========================================
   INITIALIZE FIREBASE SAFELY
======================================== */

let db = null;


try {

    const app =
        initializeApp(firebaseConfig);


    db =
        getFirestore(app);


    console.log(
        "Firebase initialized successfully."
    );


} catch (error) {

    console.error(
        "Firebase initialization error:",
        error
    );

}


/* ========================================
   BACKGROUND WEDDING MUSIC
======================================== */

const weddingMusic =
    document.getElementById(
        "weddingMusic"
    );


async function playWeddingMusic() {

    if (!weddingMusic) {
        return;
    }


    try {

        weddingMusic.volume =
            0.55;


        await weddingMusic.play();


        removeMusicListeners();


    } catch (error) {

        /*
            المتصفح ممكن يمنع
            Autoplay.

            في الحالة دي هنحاول
            التشغيل بعد أول تفاعل.
        */

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


/* محاولة التشغيل عند تحميل الصفحة */

window.addEventListener(
    "load",
    playWeddingMusic
);


/* التشغيل بعد أول تفاعل */

document.addEventListener(
    "click",
    playWeddingMusic
);


document.addEventListener(
    "touchstart",
    playWeddingMusic,
    {
        passive: true
    }
);


document.addEventListener(
    "keydown",
    playWeddingMusic
);


/* ========================================
   REVEAL ON SCROLL
======================================== */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


function showAllRevealElements() {

    revealElements.forEach(
        (element) => {

            element.classList.add(
                "visible"
            );

        }
    );

}


/*
    لو IntersectionObserver
    مش مدعوم، نظهر كل العناصر.
*/

if (
    "IntersectionObserver"
    in window
) {

    const revealObserver =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -35px 0px"
            }

        );


    revealElements.forEach(
        (element) => {

            revealObserver.observe(
                element
            );

        }
    );


} else {

    showAllRevealElements();

}


/* ========================================
   HERO INTRO
======================================== */

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

                    180 +
                    index * 180
                );

            }
        );

    }
);


/* ========================================
   PHOTO LIGHTBOX
   SAFE VERSION
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


/*
    لو الـ Gallery موجودة
    نشغل الـ Lightbox.
*/

if (
    galleryItems.length > 0
    &&
    lightbox
    &&
    lightboxImage
) {

    galleryItems.forEach(
        (item) => {

            item.addEventListener(
                "click",
                () => {

                    const image =
                        item.dataset.image;


                    if (!image) {
                        return;
                    }


                    lightboxImage.src =
                        image;


                    lightbox.classList.add(
                        "active"
                    );


                    document.body.style.overflow =
                        "hidden";

                }
            );

        }
    );

}


/* ========================================
   CLOSE LIGHTBOX
======================================== */

function closeLightbox() {

    if (!lightbox) {
        return;
    }


    lightbox.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";


    if (lightboxImage) {

        setTimeout(
            () => {

                lightboxImage.src =
                    "";

            },

            350
        );

    }

}


if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


if (lightbox) {

    lightbox.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );

}


/* ========================================
   ESC KEY FOR LIGHTBOX
======================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
            &&
            lightbox
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
    document.getElementById(
        "days"
    );


const hoursElement =
    document.getElementById(
        "hours"
    );


const minutesElement =
    document.getElementById(
        "minutes"
    );


const secondsElement =
    document.getElementById(
        "seconds"
    );


/*
    Wedding:

    Friday
    23 October 2026
    7:30 PM
    Egypt / Cairo
*/

const weddingDate =
    new Date(
        "2026-10-23T19:30:00+03:00"
    );


function twoDigits(number) {

    return String(number)
        .padStart(2, "0");

}


function updateCountdown() {

    /*
        لو عناصر الـ Countdown
        مش موجودة، نخرج بدون Error.
    */

    if (
        !daysElement
        ||
        !hoursElement
        ||
        !minutesElement
        ||
        !secondsElement
    ) {

        return;

    }


    const now =
        new Date();


    const distance =
        weddingDate.getTime()
        -
        now.getTime();


    /*
        لو معاد الفرح وصل
        أو عدى.
    */

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
            )
            %
            24
        );


    const minutes =
        Math.floor(
            (
                distance /
                (
                    1000 *
                    60
                )
            )
            %
            60
        );


    const seconds =
        Math.floor(
            (
                distance /
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


/* تشغيل الـ Countdown فورًا */

updateCountdown();


/* تحديث كل ثانية */

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

let commentsCollection = null;


if (db) {

    try {

        commentsCollection =
            collection(
                db,
                "comments"
            );

    } catch (error) {

        console.error(
            "Firestore collection error:",
            error
        );

    }

}


/* ========================================
   VALIDATION
======================================== */

function showInputError(
    element
) {

    if (!element) {
        return;
    }


    element.style.borderColor =
        "#ac626c";


    element.focus();


    setTimeout(
        () => {

            element.style.borderColor =
                "";

        },

        1300
    );

}


/* ========================================
   CREATE COMMENT ELEMENT
======================================== */

function createCommentElement(
    comment
) {

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
        comment.name ||
        "Guest";


    const message =
        document.createElement(
            "p"
        );


    message.textContent =
        comment.message ||
        "";


    const date =
        document.createElement(
            "small"
        );


    /*
        Format Firebase Timestamp
    */

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
                        day:
                            "2-digit",

                        month:
                            "short",

                        year:
                            "numeric"
                    }
                );

    } else {

        date.textContent =
            "Just now";

    }


    article.appendChild(
        name
    );


    article.appendChild(
        message
    );


    article.appendChild(
        date
    );


    return article;

}


/* ========================================
   SHOW EMPTY COMMENTS
======================================== */

function showEmptyComments() {

    if (
        !commentsList
        ||
        !emptyComments
    ) {

        return;

    }


    commentsList.innerHTML =
        "";


    commentsList.appendChild(
        emptyComments
    );

}


/* ========================================
   LOAD COMMENTS FROM FIREBASE
======================================== */

if (
    commentsCollection
    &&
    commentsList
) {

    try {

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

                commentsList.innerHTML =
                    "";


                if (
                    snapshot.empty
                ) {

                    if (
                        emptyComments
                    ) {

                        commentsList.appendChild(
                            emptyComments
                        );

                    }

                    return;

                }


                snapshot.forEach(
                    (
                        documentSnapshot
                    ) => {

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
                    "Error loading comments:",
                    error
                );


                showEmptyComments();

            }

        );

    } catch (error) {

        console.error(
            "Firestore query error:",
            error
        );


        showEmptyComments();

    }

} else {

    /*
        Firebase مش متاح.
        الموقع نفسه يفضل شغال.
    */

    showEmptyComments();

}


/* ========================================
   BUTTON LOADING STATE
======================================== */

function setButtonLoading(
    isLoading
) {

    if (!sendComment) {
        return;
    }


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

if (
    sendComment
    &&
    guestName
    &&
    guestComment
) {

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


            if (
                name.length > 50
            ) {

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


            if (
                message.length > 300
            ) {

                showInputError(
                    guestComment
                );

                return;

            }


            /*
                لو Firebase مش شغال
            */

            if (
                !commentsCollection
            ) {

                alert(
                    "خدمة التهنئة غير متاحة حاليًا. حاول مرة أخرى."
                );

                return;

            }


            /* ========================================
               SEND TO FIRESTORE
            ======================================== */

            try {

                setButtonLoading(
                    true
                );


                await addDoc(

                    commentsCollection,

                    {

                        name:
                            name,

                        message:
                            message,

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


                if (
                    commentForm
                ) {

                    commentForm.style.display =
                        "none";

                }


                if (
                    commentSuccess
                ) {

                    commentSuccess.style.display =
                        "block";

                }


                setTimeout(
                    () => {

                        if (
                            commentSuccess
                        ) {

                            commentSuccess.style.display =
                                "none";

                        }


                        if (
                            commentForm
                        ) {

                            commentForm.style.display =
                                "block";

                        }

                    },

                    3000
                );


            } catch (error) {

                console.error(
                    "Error sending comment:",
                    error
                );


                alert(
                    "حصلت مشكلة أثناء إرسال التهنئة. حاول مرة أخرى."
                );


            } finally {

                setButtonLoading(
                    false
                );

            }

        }

    );

}


/* ========================================
   CTRL + ENTER TO SEND
======================================== */

if (guestComment) {

    guestComment.addEventListener(

        "keydown",

        (event) => {

            if (
                event.ctrlKey
                &&
                event.key === "Enter"
            ) {

                if (sendComment) {

                    sendComment.click();

                }

            }

        }

    );

}


/* ========================================
   FINAL SAFETY
======================================== */

/*
    تأكيد إن الصفحة ظاهرة
    حتى لو حصل Error في Firebase
    أو أي جزء اختياري.
*/

document
    .querySelectorAll(
        ".reveal"
    )
    .forEach(
        (element) => {

            /*
                لو العنصر لسه مستخبي
                والـ Observer لم يشتغل،
                نخليه ظاهر بعد فترة قصيرة.
            */

            setTimeout(
                () => {

                    element.classList.add(
                        "visible"
                    );

                },

                1500
            );

        }
    );


console.log(
    "Wedding website script loaded successfully."
);
