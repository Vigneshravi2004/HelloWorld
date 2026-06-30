/*=========================================================
        PREMIUM PORTFOLIO
        script.js
        (CORRECTED / DEDUPLICATED)
=========================================================*/

"use strict";

/*=========================================================
    DOM ELEMENTS
=========================================================*/

const loader = document.getElementById("loader");
const header = document.querySelector(".header");
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section");

/*=========================================================
    WINDOW LOADER
=========================================================*/

window.addEventListener("load", () => {
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }
        document.body.style.overflow = "auto";
    }, 1200);
});

/*=========================================================
    MOBILE MENU
=========================================================*/

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");

        if (menuBtn.classList.contains("bx-menu")) {
            menuBtn.classList.remove("bx-menu");
            menuBtn.classList.add("bx-x");
        } else {
            menuBtn.classList.remove("bx-x");
            menuBtn.classList.add("bx-menu");
        }
    });
}

/*=========================================================
    CLOSE MENU WHEN LINK CLICKED
=========================================================*/

navItems.forEach(link => {
    link.addEventListener("click", () => {
        if (navLinks) navLinks.classList.remove("active");
        if (menuBtn) {
            menuBtn.classList.remove("bx-x");
            menuBtn.classList.add("bx-menu");
        }
    });
});

/*=========================================================
    ACTIVE NAVIGATION
=========================================================*/

function activeNavigation() {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
}

/*=========================================================
    SMOOTH SCROLL
=========================================================*/

navItems.forEach(link => {
    link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || !href.startsWith("#")) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        window.scrollTo({
            top: target.offsetTop - 70,
            behavior: "smooth"
        });
    });
});

/*=========================================================
    SCROLL REVEAL
=========================================================*/

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
    revealElements.forEach(element => {
        const windowHeight = window.innerHeight;
        const revealTop = element.getBoundingClientRect().top;
        const revealPoint = 120;

        if (revealTop < windowHeight - revealPoint) {
            element.classList.add("active");
        }
    });
}

/*=========================================================
    AUTO ADD REVEAL CLASS
    (must run BEFORE querying .reveal above is pointless if
    elements are added after the fact, so re-query here too)
=========================================================*/

document.querySelectorAll(
    ".section-header," +
    ".project-card," +
    ".skill-card," +
    ".timeline-card," +
    ".detail-card," +
    ".certificate-card," +
    ".github-card," +
    ".contact-form"
).forEach(item => {
    item.classList.add("reveal");
});

/*=========================================================
    COUNTER ANIMATION
=========================================================*/

const counters = document.querySelectorAll("[data-count]");
let counterStarted = false;

function runCounters() {
    if (counterStarted) return;

    const stats = document.querySelector(".hero-stats");
    if (!stats) return;

    const trigger = window.innerHeight + window.scrollY;

    if (trigger >= stats.offsetTop + 80) {
        counterStarted = true;

        counters.forEach(counter => {
            const target = Number(counter.dataset.count);
            let current = 0;
            const speed = target / 100;

            const update = () => {
                current += speed;

                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target + "+";
                }
            };

            update();
        });
    }
}

/*=========================================================
    TYPING EFFECT
=========================================================*/

const typingElement = document.getElementById("typing");

const typingTexts = [
    "Java Full Stack Developer",
    "Software Engineer",
    "Machine Learning Enthusiast",
    "Problem Solver",
    "Backend Developer"
];

let typingIndex = 0;
let charIndex = 0;
let deleting = false;

function typingEffect() {
    if (!typingElement) return;

    const currentText = typingTexts[typingIndex];

    if (!deleting) {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentText.length) {
            deleting = true;
            setTimeout(typingEffect, 1500);
            return;
        }
    } else {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            deleting = false;
            typingIndex++;

            if (typingIndex >= typingTexts.length) {
                typingIndex = 0;
            }
        }
    }

    setTimeout(typingEffect, deleting ? 50 : 100);
}

typingEffect();

/*=========================================================
    SCROLL PROGRESS BAR
=========================================================*/

const progressBar = document.getElementById("progress-bar");

function updateProgressBar() {
    if (!progressBar) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    progressBar.style.width = progress + "%";
}

/*=========================================================
    BACK TO TOP
=========================================================*/

const backToTop = document.getElementById("backToTop");

function updateBackToTop() {
    if (!backToTop) return;

    if (window.scrollY > 500) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
}

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/*=========================================================
    NAVBAR STICKY + SHADOW
=========================================================*/

function updateHeaderOnScroll() {
    if (!header) return;

    if (window.scrollY > 80) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }

    if (window.scrollY > 20) {
        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.25)";
    } else {
        header.style.boxShadow = "none";
    }
}

/*=========================================================
    SINGLE UNIFIED SCROLL HANDLER (throttled)
    Replaces the 6+ separate scroll listeners that were
    duplicated across the original file.
=========================================================*/

function throttle(func, limit) {
    let waiting = false;
    return function (...args) {
        if (!waiting) {
            func.apply(this, args);
            waiting = true;
            setTimeout(() => { waiting = false; }, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function onScroll() {
    updateHeaderOnScroll();
    activeNavigation();
    revealOnScroll();
    runCounters();
    updateProgressBar();
    updateBackToTop();
}

window.addEventListener("scroll", throttle(onScroll, 20));

/*=========================================================
    HERO PARALLAX (single handler, was duplicated twice)
=========================================================*/

const profileCard = document.querySelector(".profile-card");
const hero = document.querySelector(".hero");

window.addEventListener("mousemove", (e) => {
    const x1 = (window.innerWidth / 2 - e.clientX) / 40;
    const y1 = (window.innerHeight / 2 - e.clientY) / 40;

    if (profileCard) {
        profileCard.style.transform = `translate(${x1}px, ${y1}px)`;
    }

    const x2 = (window.innerWidth / 2 - e.clientX) / 35;
    const y2 = (window.innerHeight / 2 - e.clientY) / 35;

    if (hero) {
        hero.style.backgroundPosition = `${x2}px ${y2}px`;
    }
});

/*=========================================================
    THEME TOGGLE
=========================================================*/

const themeToggle = document.querySelector(".theme-toggle");

if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        themeToggle.classList.remove("bx-moon");
        themeToggle.classList.add("bx-sun");
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");

        if (document.body.classList.contains("light-theme")) {
            themeToggle.classList.remove("bx-moon");
            themeToggle.classList.add("bx-sun");
            localStorage.setItem("theme", "light");
        } else {
            themeToggle.classList.remove("bx-sun");
            themeToggle.classList.add("bx-moon");
            localStorage.setItem("theme", "dark");
        }
    });
}

/*=========================================================
    PROJECT MODAL
    (fixed: null-checks for modal itself and for the
    anchor tag inside each card, so one malformed card
    can't break every other card)
=========================================================*/

const modal = document.getElementById("projectModal");
const closeModal = document.getElementById("closeModal");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalTech = document.getElementById("modalTech");

const githubBtn = document.getElementById("githubBtn");
const demoBtn = document.getElementById("demoBtn");

function openModal(card) {
    if (!modal) return;

    const image = card.querySelector("img");
    const title = card.querySelector("h3");
    const description = card.querySelector("p");
    const link = card.querySelector("a");

    if (modalImage && image) modalImage.src = image.src;
    if (modalTitle && title) modalTitle.textContent = title.textContent;
    if (modalDescription && description) modalDescription.textContent = description.textContent;

    if (modalTech) {
        modalTech.innerHTML =
            "<span class='tag'>Java</span> " +
            "<span class='tag'>HTML</span> " +
            "<span class='tag'>CSS</span> " +
            "<span class='tag'>JavaScript</span>";
    }

    const href = link ? link.href : "#";

    if (githubBtn) githubBtn.href = href;
    if (demoBtn) demoBtn.href = href;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => openModal(card));
});

function closeModalFn() {
    if (!modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

if (closeModal) {
    closeModal.addEventListener("click", closeModalFn);
}

window.addEventListener("click", (e) => {
    if (e.target === modal) closeModalFn();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModalFn();
});

/*=========================================================
    TOAST
=========================================================*/

const toast = document.getElementById("toast");

function showToast(message = "Action Successful!") {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

/*=========================================================
    CONTACT FORM
    (fixed: removed duplicate submit listeners; double-submit
    guard and validation now live in one handler)
=========================================================*/

const contactForm = document.querySelector(".contact-form");
let sending = false;

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (sending) return;

        const inputs = contactForm.querySelectorAll("input, textarea");
        let valid = true;

        inputs.forEach(input => {
            if (input.value.trim() === "") {
                valid = false;
                input.style.border = "2px solid crimson";
            } else {
                input.style.border = "1px solid rgba(255,255,255,.08)";
            }
        });

        if (!valid) {
            showToast("Please fill all fields.");
            return;
        }

        sending = true;
        showToast("Message Sent Successfully!");
        contactForm.reset();

        setTimeout(() => { sending = false; }, 3000);
    });
}

/*=========================================================
    RIPPLE EFFECT
=========================================================*/

document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");

        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + "px";
        ripple.style.top = (e.clientY - rect.top) + "px";

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

/*=========================================================
    3D PROJECT CARD TILT
=========================================================*/

document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 18;
        const rotateX = ((rect.height / 2 - y) / rect.height) * 18;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-8px)
        `;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    });
});

/*=========================================================
    MAGNETIC BUTTON
=========================================================*/

document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("mousemove", (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });

    button.addEventListener("mouseleave", () => {
        button.style.transform = "translate(0,0)";
    });
});

/*=========================================================
    FLOATING SOCIAL ICONS
=========================================================*/

document.querySelectorAll(".hero-social a").forEach((icon, index) => {
    icon.style.animation = `floating ${3 + index}s ease-in-out infinite`;
});

/*=========================================================
    LAZY IMAGE LOADING
=========================================================*/

const lazyImages = document.querySelectorAll("img[data-src]");

if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            img.classList.add("loaded");
            observer.unobserve(img);
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
} else {
    // Fallback: load immediately if IntersectionObserver isn't supported
    lazyImages.forEach(img => {
        if (img.dataset.src) img.src = img.dataset.src;
        img.classList.add("loaded");
    });
}

/*=========================================================
    REVEAL INTERSECTION OBSERVER
    (fixed: was a second, separate mechanism duplicating
    revealOnScroll's job — kept as a supplementary observer
    but no longer redundant with the throttled scroll loop
    for elements not yet visible on load)
=========================================================*/

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
}

/*=========================================================
    WINDOW RESIZE
=========================================================*/

window.addEventListener("resize", debounce(() => {
    console.log("Layout Updated");
}, 300));

/*=========================================================
    COPY EMAIL
=========================================================*/

const emailLink = document.querySelector("a[href^='mailto']");

if (emailLink) {
    emailLink.addEventListener("click", () => {
        showToast("Email Copied!");

        if (navigator.clipboard) {
            navigator.clipboard.writeText("vigneshravi0723@gmail.com")
                .catch(err => console.error("Clipboard write failed:", err));
        }
    });
}

/*=========================================================
    PRELOAD IMAGES
=========================================================*/

const preloadImages = [
    "assets/profile.png",
    "images/churn.png",
    "images/fashion.png",
    "images/digit.png"
];

preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

/*=========================================================
    GITHUB API
=========================================================*/

const githubUser = "Vigneshravi2004";

async function loadGithubProfile() {
    try {
        const response = await fetch(`https://api.github.com/users/${githubUser}`);

        if (!response.ok) {
            throw new Error(`GitHub API responded with status ${response.status}`);
        }

        const data = await response.json();

        const avatar = document.getElementById("github-avatar");
        const name = document.getElementById("github-name");
        const bio = document.getElementById("github-bio");
        const repositories = document.getElementById("repositories");
        const followers = document.getElementById("followers");
        const following = document.getElementById("following");

        if (avatar) avatar.src = data.avatar_url;
        if (name) name.textContent = data.name || githubUser;
        if (bio) bio.textContent = data.bio || "";
        if (repositories) repositories.textContent = data.public_repos;
        if (followers) followers.textContent = data.followers;
        if (following) following.textContent = data.following;
    } catch (error) {
        console.error("Failed to load GitHub profile:", error);
    }
}

async function loadRepositories() {
    try {
        const response = await fetch(
            `https://api.github.com/users/${githubUser}/repos?sort=updated`
        );

        if (!response.ok) {
            throw new Error(`GitHub API responded with status ${response.status}`);
        }

        const repos = await response.json();
        const container = document.getElementById("repo-container");

        if (!container) return;

        container.innerHTML = "";

        repos.slice(0, 6).forEach(repo => {
            const card = document.createElement("div");
            card.className = "repo-card reveal";

            const repoName = document.createElement("h3");
            repoName.textContent = repo.name;

            const repoDesc = document.createElement("p");
            repoDesc.textContent = repo.description || "No Description Available";

            const repoLink = document.createElement("a");
            repoLink.href = repo.html_url;
            repoLink.target = "_blank";
            repoLink.rel = "noopener noreferrer";
            repoLink.textContent = "View Repository";

            card.append(repoName, repoDesc, repoLink);
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Failed to load repositories:", error);
    }
}

loadGithubProfile();
loadRepositories();

/*=========================================================
    AUTO YEAR
=========================================================*/

const year = document.getElementById("year");
if (year) {
    year.textContent = new Date().getFullYear();
}

/*=========================================================
    PAGE VISIBILITY
=========================================================*/

document.addEventListener("visibilitychange", () => {
    console.log(document.hidden ? "Portfolio Hidden" : "Portfolio Active");
});

/*=========================================================
    PAGE PERFORMANCE / LOAD LOG
=========================================================*/

window.addEventListener("load", () => {
    console.log(
        "%cPortfolio Loaded Successfully",
        "color:#6C63FF;font-size:18px;font-weight:bold"
    );

    const t = performance.now();
    console.log(`Loaded in ${Math.round(t)} ms`);
});

/*=========================================================
    ERROR HANDLER
=========================================================*/

window.onerror = function (message, source, line, column, error) {
    console.error(message, source, line, column, error);
};

/*=========================================================
    APPLICATION INITIALIZATION
=========================================================*/

function initializePortfolio() {
    activeNavigation();
    revealOnScroll();
    runCounters();
    updateHeaderOnScroll();
    console.log("Portfolio Initialized");
}

initializePortfolio();

/*=========================================================
    CONSOLE MESSAGE
=========================================================*/

console.log("%cWelcome Recruiter 👋", "font-size:24px;color:#6C63FF;font-weight:bold;");
console.log("%cDeveloped by Vignesh R", "font-size:16px;color:#22D3EE;");

/*=========================================================
    END OF SCRIPT
=========================================================*/