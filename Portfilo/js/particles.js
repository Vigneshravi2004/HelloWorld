/*=========================================================
        PREMIUM PORTFOLIO
        particles.js
        (CORRECTED / DEDUPLICATED)
=========================================================*/

"use strict";

/*=========================================================
    CANVAS
=========================================================*/

const canvas = document.getElementById("particles");

if (!canvas) {
    console.warn("Particles canvas (#particles) not found — particle engine not started.");
} else {

const ctx = canvas.getContext("2d");

/*=========================================================
    CONFIGURATION
=========================================================*/

const config = {
    particleCount: 120,
    particleSize: 3,
    particleSpeed: 0.6,
    lineDistance: 140,
    mouseRadius: 180,
    colors: [
        "#6C63FF",
        "#22D3EE",
        "#8B5CF6",
        "#60A5FA"
    ]
};

/*=========================================================
    CANVAS SIZE (retina-aware)
    NOTE: this is the ONLY resize/scaling routine. The
    original file had a second, conflicting resizeCanvas()
    that reset canvas.width without reapplying DPR scaling,
    which fought with this one on every resize.
=========================================================*/

function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
}

setupCanvas();

/*=========================================================
    MOUSE
=========================================================*/

const mouse = { x: null, y: null };

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

/*=========================================================
    RANDOM HELPERS
=========================================================*/

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function randomColor() {
    return config.colors[Math.floor(Math.random() * config.colors.length)];
}

/*=========================================================
    PARTICLE
=========================================================*/

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(0, window.innerWidth);
        this.y = random(0, window.innerHeight);
        this.size = random(1, config.particleSize);
        this.speedX = random(-config.particleSpeed, config.particleSpeed);
        this.speedY = random(-config.particleSpeed, config.particleSpeed);
        this.color = randomColor();
        this.opacity = random(0.2, 1);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;
    }
}

/*=========================================================
    PARTICLE ARRAY
=========================================================*/

const particles = [];

function createParticles() {
    particles.length = 0;

    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

createParticles();

/*=========================================================
    RESIZE (single listener — recreates particles so they
    redistribute across the new canvas size)
=========================================================*/

window.addEventListener("resize", () => {
    setupCanvas();
    createParticles();
});

/*=========================================================
    CONNECTION LINES
=========================================================*/

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.lineDistance) {
                const opacity = 1 - (distance / config.lineDistance);

                ctx.beginPath();
                ctx.strokeStyle = `rgba(108,99,255,${opacity * 0.35})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

/*=========================================================
    MOUSE INTERACTION (push particles away)
=========================================================*/

function mouseInteraction() {
    if (mouse.x === null || mouse.y === null) return;

    particles.forEach(particle => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mouseRadius) {
            const angle = Math.atan2(dy, dx);
            const force = (config.mouseRadius - distance) / config.mouseRadius;

            particle.x -= Math.cos(angle) * force * 2;
            particle.y -= Math.sin(angle) * force * 2;
        }
    });
}

/*=========================================================
    MOUSE CONNECTION LINES
=========================================================*/

function connectMouse() {
    if (mouse.x === null) return;

    particles.forEach(particle => {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mouseRadius) {
            const alpha = 1 - (distance / config.mouseRadius);

            ctx.beginPath();
            ctx.strokeStyle = `rgba(34,211,238,${alpha * 0.4})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    });
}

/*=========================================================
    PARTICLE GLOW
=========================================================*/

function drawGlow(particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(
        particle.x, particle.y, particle.size,
        particle.x, particle.y, particle.size * 5
    );

    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.18;
    ctx.fill();
    ctx.globalAlpha = 1;
}

/*=========================================================
    UPDATE PARTICLES
=========================================================*/

function updateParticles() {
    particles.forEach(particle => {
        particle.move();
        drawGlow(particle);
        particle.draw();
    });
}

/*=========================================================
    BACKGROUND TRAIL FADE
=========================================================*/

function drawBackground() {
    ctx.fillStyle = "rgba(5,8,22,0.15)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

/*=========================================================
    ANIMATION LOOP (single loop, FPS-capped)
    NOTE: the original file ran TWO independent rAF loops
    at once — animateParticles() (uncapped) and
    animationLoop()/safeLoop() (60fps-capped) — both
    clearing and redrawing the same canvas every frame.
    That doubled the draw work and made the FPS cap and
    pause-on-tab-hidden logic meaningless. Now there is
    exactly one loop.
=========================================================*/

const FPS = 60;
const frameInterval = 1000 / FPS;
let lastFrame = performance.now();
let paused = false;

function renderFrame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawBackground();
    updateParticles();
    connectParticles();
    mouseInteraction();
    connectMouse();
}

function animationLoop(currentTime) {
    if (!paused) {
        const delta = currentTime - lastFrame;

        if (delta >= frameInterval) {
            renderFrame();
            lastFrame = currentTime;
        }
    }

    requestAnimationFrame(animationLoop);
}

requestAnimationFrame(animationLoop);

/*=========================================================
    RANDOM TWINKLE
=========================================================*/

setInterval(() => {
    const particle = particles[Math.floor(Math.random() * particles.length)];
    if (!particle) return;
    particle.opacity = Math.random();
}, 250);

/*=========================================================
    RANDOM COLOR SHIFT
=========================================================*/

setInterval(() => {
    particles.forEach(particle => {
        if (Math.random() < 0.08) {
            particle.color = randomColor();
        }
    });
}, 2500);

/*=========================================================
    AUTO REGENERATE
    (kept capped at config.particleCount so this can't
    grow particles unbounded if other code also pushes
    into the array)
=========================================================*/

setInterval(() => {
    if (particles.length < config.particleCount) {
        particles.push(new Particle());
    }
}, 1500);

/*=========================================================
    TAB VISIBILITY (pause/resume the single loop)
=========================================================*/

document.addEventListener("visibilitychange", () => {
    paused = document.hidden;

    // Avoid a big "jump" in delta-based timing once the tab
    // becomes visible again after being hidden a while.
    if (!paused) {
        lastFrame = performance.now();
    }
});

/*=========================================================
    PERFORMANCE INFO
=========================================================*/

console.log(
    "%cParticle Engine Ready",
    "color:#22D3EE;font-size:16px;font-weight:bold"
);

/*=========================================================
    CONFIG API
=========================================================*/

window.ParticlesConfig = {
    increase(amount = 10) {
        config.particleCount += amount;
        createParticles();
    },

    decrease(amount = 10) {
        config.particleCount = Math.max(20, config.particleCount - amount);
        createParticles();
    },

    setDistance(distance) {
        config.lineDistance = distance;
    },

    setSpeed(speed) {
        config.particleSpeed = speed;

        particles.forEach(p => {
            p.speedX = random(-speed, speed);
            p.speedY = random(-speed, speed);
        });
    }
};

/*=========================================================
    DESTROY ENGINE
=========================================================*/

window.destroyParticles = () => {
    particles.length = 0;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
};

} // end canvas-exists guard

/*=========================================================
    END OF PARTICLES.JS
=========================================================*/