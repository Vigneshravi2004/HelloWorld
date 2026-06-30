/*=========================================================
        PREMIUM PORTFOLIO
        cursor.js
        (CORRECTED / DEDUPLICATED)
=========================================================*/

"use strict";

/*=========================================================
    CURSOR ELEMENTS
=========================================================*/

const cursor = document.querySelector(".cursor");
const cursorBlur = document.querySelector(".cursor-blur");

/*=========================================================
    MOBILE DETECTION
=========================================================*/

const isMobile = window.matchMedia("(pointer: coarse)").matches;

/*=========================================================
    BAIL OUT EARLY WHEN THIS SCRIPT CAN'T DO ANYTHING
    (fixed: the original had ZERO null checks on `cursor`/
    `cursorBlur` anywhere — every single listener below
    (mousemove, mousedown, blur, scroll, etc.) called
    cursor.classList.add(...) directly. If .cursor or
    .cursor-blur don't exist in the HTML, the very first
    mousemove throws and silently kills this script. It also
    kept attaching dozens of listeners on mobile/touch
    devices even though it had already hidden the elements,
    wasting work on devices that don't benefit from a custom
    cursor at all. Now both cases bail out up front.)
=========================================================*/

if (!cursor || !cursorBlur) {

    console.warn("Custom cursor elements (.cursor / .cursor-blur) not found — cursor script not started.");

} else if (isMobile) {

    cursor.style.display = "none";
    cursorBlur.style.display = "none";
    console.log("%cCustom cursor disabled on touch device", "color:#6C63FF;");

} else {

/*=========================================================
    CURSOR POSITION
=========================================================*/

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;

let blurX = 0;
let blurY = 0;

/*=========================================================
    MOUSE TRACKING
=========================================================*/

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.classList.add("visible");
    cursorBlur.classList.add("visible");
});

/*=========================================================
    HIDE / SHOW CURSOR ON WINDOW ENTER/LEAVE
=========================================================*/

window.addEventListener("mouseleave", () => {
    cursor.classList.remove("visible");
    cursorBlur.classList.remove("visible");
});

window.addEventListener("mouseenter", () => {
    cursor.classList.add("visible");
    cursorBlur.classList.add("visible");
});

/*=========================================================
    CURSOR CLICK STATE
=========================================================*/

window.addEventListener("mousedown", () => {
    cursor.classList.add("click");
});

window.addEventListener("mouseup", () => {
    cursor.classList.remove("click");
});

/*=========================================================
    CURSOR STATE HELPERS
=========================================================*/

function addCursorState(state) {
    cursor.classList.add(state);
}

function removeCursorState(state) {
    cursor.classList.remove(state);
}

/*=========================================================
    WINDOW BLUR / FOCUS
=========================================================*/

window.addEventListener("blur", () => {
    cursor.style.opacity = 0;
    cursorBlur.style.opacity = 0;
});

window.addEventListener("focus", () => {
    cursor.style.opacity = 1;
    cursorBlur.style.opacity = 1;
});

/*=========================================================
    HOVERABLE ELEMENTS
=========================================================*/

const hoverElements = document.querySelectorAll(
    "a, button, .btn, .project-card, .skill-card, .certificate-card"
);

hoverElements.forEach(element => {
    element.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
        cursorBlur.classList.add("hover");
    });

    element.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
        cursorBlur.classList.remove("hover");
    });
});

/*=========================================================
    BUTTON SCALE
    (fixed: this never actually worked. animateCursor() runs
    every frame and unconditionally overwrites
    cursor.style.transform with the translate3d position —
    so appending " scale(2)" to that string got blown away
    on the very next animation frame, before the browser
    ever painted it. A CSS class toggle is the correct way
    to layer an extra transform on top of a value that's
    being driven by rAF every frame; the actual scale rule
    needs to live in CSS, e.g. .cursor.btn-hover { transform: ... scale(2); }
    composed in animateCursor below.)
=========================================================*/

let buttonHoverScale = false;

document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("mouseenter", () => {
        buttonHoverScale = true;
    });

    button.addEventListener("mouseleave", () => {
        buttonHoverScale = false;
    });
});

/*=========================================================
    IMAGE MODE
=========================================================*/

document.querySelectorAll("img").forEach(image => {
    image.addEventListener("mouseenter", () => {
        cursor.classList.add("image");
        cursorBlur.classList.add("image");
    });

    image.addEventListener("mouseleave", () => {
        cursor.classList.remove("image");
        cursorBlur.classList.remove("image");
    });
});

/*=========================================================
    TEXT MODE
=========================================================*/

document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span").forEach(text => {
    text.addEventListener("mouseenter", () => {
        cursor.classList.add("text");
    });

    text.addEventListener("mouseleave", () => {
        cursor.classList.remove("text");
    });
});

/*=========================================================
    PROJECT CARD MODE + LABEL
    (merged the two separate .project-card mouseenter/leave
    listener blocks from the original — one toggled the
    "project" class, the other toggled the cursor label —
    into a single pass over the same NodeList)
=========================================================*/

const cursorLabel = document.createElement("div");
cursorLabel.className = "cursor-label";
document.body.appendChild(cursorLabel);

document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
        cursor.classList.add("project");
        cursorLabel.textContent = "View";
        cursorLabel.classList.add("show");
    });

    card.addEventListener("mouseleave", () => {
        cursor.classList.remove("project");
        cursorLabel.classList.remove("show");
    });
});

window.addEventListener("mousemove", () => {
    cursorLabel.style.left = mouseX + "px";
    cursorLabel.style.top = mouseY + "px";
});

/*=========================================================
    HERO SOCIAL ICONS
=========================================================*/

document.querySelectorAll(".hero-social a").forEach(icon => {
    icon.addEventListener("mouseenter", () => {
        cursor.classList.add("social");
    });

    icon.addEventListener("mouseleave", () => {
        cursor.classList.remove("social");
    });
});

/*=========================================================
    INPUT FOCUS
=========================================================*/

document.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("focus", () => {
        cursor.classList.add("input");
    });

    input.addEventListener("blur", () => {
        cursor.classList.remove("input");
    });
});

/*=========================================================
    MAGNETIC BUTTONS
=========================================================*/

document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("mousemove", (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.18}px,${y * 0.18}px)`;
    });

    button.addEventListener("mouseleave", () => {
        button.style.transform = "";
    });
});

/*=========================================================
    MAGNETIC LINKS
=========================================================*/

document.querySelectorAll("a").forEach(link => {
    link.addEventListener("mousemove", (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        link.style.transform = `translate(${x * 0.08}px,${y * 0.08}px)`;
    });

    link.addEventListener("mouseleave", () => {
        link.style.transform = "translate(0,0)";
    });
});

/*=========================================================
    CURSOR RIPPLE EFFECT
=========================================================*/

window.addEventListener("click", (e) => {
    const ripple = document.createElement("div");
    ripple.className = "cursor-ripple";
    ripple.style.left = e.clientX + "px";
    ripple.style.top = e.clientY + "px";

    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 700);
});

/*=========================================================
    CURSOR TRAIL SETUP
=========================================================*/

const trailDots = [];
const trailCount = 10;

for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement("div");
    dot.className = "cursor-trail";
    document.body.appendChild(dot);

    trailDots.push({ element: dot, x: 0, y: 0 });
}

/*=========================================================
    CURSOR IDLE MODE
=========================================================*/

let idleTimer;

function resetIdle() {
    clearTimeout(idleTimer);

    cursor.classList.remove("idle");
    cursorBlur.classList.remove("idle");

    idleTimer = setTimeout(() => {
        cursor.classList.add("idle");
        cursorBlur.classList.add("idle");
    }, 3000);
}

window.addEventListener("mousemove", resetIdle);
resetIdle();

/*=========================================================
    CURSOR SCROLL EFFECT
=========================================================*/

window.addEventListener("scroll", () => {
    cursor.classList.add("scroll");

    setTimeout(() => {
        cursor.classList.remove("scroll");
    }, 150);
});

/*=========================================================
    CURSOR VISIBILITY ON LOAD
=========================================================*/

window.addEventListener("load", () => {
    cursor.style.opacity = 1;
    cursorBlur.style.opacity = 1;
});

/*=========================================================
    CURSOR RESIZE
=========================================================*/

window.addEventListener("resize", () => {
    cursor.style.transition = "none";
    cursorBlur.style.transition = "none";

    setTimeout(() => {
        cursor.style.transition = "";
        cursorBlur.style.transition = "";
    }, 300);
});

/*=========================================================
    CURSOR VISIBILITY ON TAB SWITCH
=========================================================*/

document.addEventListener("visibilitychange", () => {
    const opacity = document.hidden ? 0 : 1;
    cursor.style.opacity = opacity;
    cursorBlur.style.opacity = opacity;
});

/*=========================================================
    CURSOR SPEED
=========================================================*/

window.addEventListener("mousemove", (e) => {
    const cursorSpeed = Math.abs(e.movementX) + Math.abs(e.movementY);
    cursor.style.setProperty("--speed", cursorSpeed);
});

/*=========================================================
    DOUBLE CLICK
=========================================================*/

window.addEventListener("dblclick", () => {
    cursor.classList.add("expand");

    setTimeout(() => {
        cursor.classList.remove("expand");
    }, 400);
});

/*=========================================================
    SINGLE ANIMATION LOOP
    (fixed: the original ran THREE independent rAF loops at
    once — animateCursor() for the dot/blur position,
    animateTrail() for the trailing dots, and a third
    optimizedLoop() that did nothing but update a timestamp
    variable nobody read. That's needless duplicated work
    every frame. Merged into one loop, and the button-scale
    state now composes into the same transform instead of
    being clobbered by it.)
=========================================================*/

function animateCursor() {
    // Main cursor dot
    currentX += (mouseX - currentX) * 0.18;
    currentY += (mouseY - currentY) * 0.18;

    const scale = buttonHoverScale ? " scale(2)" : "";
    cursor.style.transform =
        `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%,-50%)${scale}`;

    // Soft blur halo (slower easing)
    blurX += (mouseX - blurX) * 0.08;
    blurY += (mouseY - blurY) * 0.08;

    cursorBlur.style.transform =
        `translate3d(${blurX}px, ${blurY}px, 0) translate(-50%,-50%)`;

    // Trailing dots, each chasing the previous one
    let trailX = mouseX;
    let trailY = mouseY;

    trailDots.forEach(dot => {
        dot.x += (trailX - dot.x) * 0.25;
        dot.y += (trailY - dot.y) * 0.25;

        dot.element.style.transform = `translate(${dot.x}px,${dot.y}px)`;

        trailX = dot.x;
        trailY = dot.y;
    });

    requestAnimationFrame(animateCursor);
}

requestAnimationFrame(animateCursor);

/*=========================================================
    DESTROY FUNCTION
=========================================================*/

window.destroyCursor = () => {
    trailDots.forEach(dot => dot.element.remove());
    cursor.remove();
    cursorBlur.remove();
    cursorLabel.remove();
};

/*=========================================================
    DEBUG
=========================================================*/

console.log(
    "%cCursor Engine Initialized",
    "color:#22D3EE;font-size:18px;font-weight:bold"
);

} // end cursor-exists / desktop guard

/*=========================================================
    END OF CURSOR.JS
=========================================================*/