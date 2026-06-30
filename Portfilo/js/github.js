/*=========================================================
        PREMIUM PORTFOLIO
        github.js
        (CORRECTED / DEDUPLICATED)
=========================================================*/

"use strict";

/*=========================================================
    CONFIGURATION
=========================================================*/

const GitHub = {
    username: "Vigneshravi2004",
    api: "https://api.github.com/users/",
    profile: null,
    repositories: []
};

/*=========================================================
    DOM ELEMENTS
=========================================================*/

const githubAvatar = document.getElementById("github-avatar");
const githubName = document.getElementById("github-name");
const githubBio = document.getElementById("github-bio");
const githubRepositories = document.getElementById("repositories");
const githubFollowers = document.getElementById("followers");
const githubFollowing = document.getElementById("following");
const githubLink = document.getElementById("github-link");

const repoContainer = document.getElementById("repo-container");
const searchBox = document.getElementById("repo-search");

/*=========================================================
    SMALL UTILITY: ESCAPE HTML
    (the original built repo cards with innerHTML using
    raw repo.name / repo.description, which means a repo
    with HTML in its name/description would inject markup
    into the page. Escaping closes that hole.)
=========================================================*/

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
}

/*=========================================================
    LOADING CARD
=========================================================*/

function githubLoading() {
    const container = document.querySelector(".github-card");
    if (!container) return;
    container.classList.add("loading");
}

function githubLoaded() {
    const container = document.querySelector(".github-card");
    if (!container) return;
    container.classList.remove("loading");
}

/*=========================================================
    FETCH PROFILE
=========================================================*/

async function fetchGithubProfile() {
    githubLoading();

    try {
        const response = await fetch(GitHub.api + GitHub.username);

        if (!response.ok) {
            throw new Error("GitHub API Error");
        }

        const data = await response.json();

        GitHub.profile = data;
        displayGithubProfile(data);
        githubLoaded();
    } catch (error) {
        githubError(error);
    }
}

/*=========================================================
    DISPLAY PROFILE
=========================================================*/

function displayGithubProfile(profile) {
    if (githubAvatar) {
        githubAvatar.src = profile.avatar_url;
        githubAvatar.alt = profile.login;
    }

    if (githubName) {
        githubName.textContent = profile.name || profile.login;
    }

    if (githubBio) {
        githubBio.textContent = profile.bio || "Java Full Stack Developer";
    }

    if (githubRepositories) {
        githubRepositories.textContent = profile.public_repos;
    }

    if (githubFollowers) {
        githubFollowers.textContent = profile.followers;
    }

    if (githubFollowing) {
        githubFollowing.textContent = profile.following;
    }

    if (githubLink) {
        githubLink.href = profile.html_url;
    }
}

/*=========================================================
    ERROR
    (fixed: inline onclick="fetchGithubProfile()" is
    replaced with a proper event listener attached after
    the markup is inserted — inline handlers depend on a
    global of the same name existing and can silently break
    under stricter CSPs or bundling)
=========================================================*/

function githubError(error) {
    console.error(error);
    githubLoaded();

    const container = document.querySelector(".github-card");
    if (!container) return;

    container.innerHTML = `
        <div class="github-error">
            <h3>GitHub Profile Unavailable</h3>
            <p>Unable to connect to GitHub API.</p>
            <button type="button" class="btn primary-btn" id="github-retry-btn">
                Retry
            </button>
        </div>
    `;

    const retryBtn = document.getElementById("github-retry-btn");
    if (retryBtn) {
        retryBtn.addEventListener("click", () => fetchGithubProfile());
    }
}

/*=========================================================
    REFRESH PROFILE
=========================================================*/

function refreshGithub() {
    fetchGithubProfile();
}

/*=========================================================
    LAST UPDATED
=========================================================*/

function githubTimestamp() {
    const time = new Date().toLocaleTimeString();
    console.log(`GitHub Updated : ${time}`);
}

/*=========================================================
    FETCH REPOSITORIES
=========================================================*/

async function fetchRepositories() {
    try {
        const response = await fetch(
            `${GitHub.api}${GitHub.username}/repos?sort=updated&per_page=100`
        );

        if (!response.ok) {
            throw new Error("Repository Fetch Failed");
        }

        const repositories = await response.json();

        GitHub.repositories = repositories;
        displayRepositories(repositories);
    } catch (error) {
        console.error(error);
    }
}

/*=========================================================
    DISPLAY REPOSITORIES
    (fixed: sorting a copy instead of the array passed in,
    so calling displayRepositories(filteredResults) from the
    search box doesn't silently re-order GitHub.repositories
    as a side effect)
=========================================================*/

function displayRepositories(repositories) {
    if (!repoContainer) return;

    repoContainer.innerHTML = "";

    [...repositories]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
        .forEach(repo => {
            repoContainer.appendChild(repositoryCard(repo));
        });
}

/*=========================================================
    LANGUAGE COLOR
=========================================================*/

function languageColor(language) {
    const colors = {
        Java: "#f89820",
        Python: "#3776AB",
        JavaScript: "#f7df1e",
        HTML: "#e34f26",
        CSS: "#2965f1",
        PHP: "#8892bf",
        C: "#555",
        "C++": "#00599C",
        Unknown: "#6b7280"
    };

    return colors[language] || "#6C63FF";
}

/*=========================================================
    REPOSITORY CARD
    (fixed: escaped user-controlled text going into
    innerHTML, and apply the language badge color here
    directly instead of relying on a one-time
    DOMContentLoaded query that ran before any repos
    existed in the DOM — see note below)
=========================================================*/

function repositoryCard(repo) {
    const card = document.createElement("div");
    card.className = "repo-card reveal";

    const language = repo.language || "Unknown";
    const updated = new Date(repo.updated_at).toLocaleDateString();

    card.innerHTML = `
        <div class="repo-header">
            <h3>${escapeHtml(repo.name)}</h3>
            <span class="repo-language">${escapeHtml(language)}</span>
        </div>
        <p>${escapeHtml(repo.description || "No description available.")}</p>
        <div class="repo-footer">
            <div class="repo-info">⭐ ${repo.stargazers_count}</div>
            <div class="repo-info">🍴 ${repo.forks_count}</div>
            <div class="repo-info">📅 ${updated}</div>
        </div>
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn secondary-btn">
            View Repository
        </a>
    `;

    const languageTag = card.querySelector(".repo-language");
    if (languageTag) {
        languageTag.style.background = languageColor(language);
    }

    return card;
}

/*=========================================================
    SEARCH
=========================================================*/

if (searchBox) {
    searchBox.addEventListener("keyup", function () {
        const keyword = this.value.toLowerCase();

        const filtered = GitHub.repositories.filter(repo => {
            return (
                repo.name.toLowerCase().includes(keyword) ||
                (repo.description || "").toLowerCase().includes(keyword)
            );
        });

        displayRepositories(filtered);
    });
}

/*=========================================================
    FEATURED PROJECTS
=========================================================*/

function featuredRepositories() {
    const featured = GitHub.repositories.filter(repo => repo.stargazers_count >= 0);
    displayRepositories(featured);
}

/*=========================================================
    SORT BY UPDATE
=========================================================*/

function sortLatest() {
    GitHub.repositories.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    displayRepositories(GitHub.repositories);
}

/*=========================================================
    SORT BY STARS
=========================================================*/

function sortStars() {
    GitHub.repositories.sort((a, b) => b.stargazers_count - a.stargazers_count);
    displayRepositories(GitHub.repositories);
}

/*=========================================================
    CACHE CONFIGURATION
=========================================================*/

const CACHE_KEY = "github-cache";
const CACHE_TIME = 1000 * 60 * 30; // 30 minutes

/*=========================================================
    SAVE CACHE
=========================================================*/

function saveGithubCache() {
    const cache = {
        profile: GitHub.profile,
        repositories: GitHub.repositories,
        time: Date.now()
    };

    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error("Failed to save GitHub cache:", error);
    }
}

/*=========================================================
    LOAD CACHE
    (fixed: JSON.parse on corrupted/manually-edited
    localStorage data would throw uncaught and break
    initialization; now guarded)
=========================================================*/

function loadGithubCache() {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return false;

    let data;
    try {
        data = JSON.parse(cache);
    } catch (error) {
        console.error("Corrupted GitHub cache, ignoring:", error);
        localStorage.removeItem(CACHE_KEY);
        return false;
    }

    if (!data || !data.time || Date.now() - data.time > CACHE_TIME) {
        localStorage.removeItem(CACHE_KEY);
        return false;
    }

    GitHub.profile = data.profile;
    GitHub.repositories = data.repositories || [];

    if (data.profile) displayGithubProfile(data.profile);
    displayRepositories(GitHub.repositories);

    console.log("GitHub Cache Loaded");
    return true;
}

/*=========================================================
    REFRESH BUTTON
=========================================================*/

const refreshButton = document.getElementById("refresh-github");

if (refreshButton) {
    refreshButton.addEventListener("click", async () => {
        refreshButton.disabled = true;
        refreshButton.innerHTML = "Refreshing...";

        await fetchGithubProfile();
        await fetchRepositories();
        saveGithubCache();
        githubStatistics();
        calculateProfileScore();

        refreshButton.innerHTML = "Refresh";
        refreshButton.disabled = false;

        if (typeof showToast === "function") {
            showToast("GitHub Updated Successfully");
        }
    });
}

/*=========================================================
    GITHUB STATISTICS
=========================================================*/

function githubStatistics() {
    if (!GitHub.repositories.length) return;

    let totalStars = 0;
    let totalForks = 0;
    let languages = {};

    GitHub.repositories.forEach(repo => {
        totalStars += repo.stargazers_count;
        totalForks += repo.forks_count;

        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });

    const starBox = document.getElementById("total-stars");
    const forkBox = document.getElementById("total-forks");
    const languageBox = document.getElementById("top-language");

    if (starBox) starBox.textContent = totalStars;
    if (forkBox) forkBox.textContent = totalForks;

    if (languageBox) {
        const languageKeys = Object.keys(languages);

        const topLanguage = languageKeys.length
            ? languageKeys.reduce((a, b) => (languages[a] > languages[b] ? a : b))
            : null;

        languageBox.textContent = topLanguage || "-";
    }
}

/*=========================================================
    PROFILE SCORE
=========================================================*/

function calculateProfileScore() {
    if (!GitHub.profile) return;

    const score =
        GitHub.profile.public_repos * 10 +
        GitHub.profile.followers * 5 +
        GitHub.repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    const scoreElement = document.getElementById("github-score");
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

/*=========================================================
    RATE LIMIT CHECK
=========================================================*/

async function checkRateLimit() {
    try {
        const response = await fetch("https://api.github.com/rate_limit");

        if (!response.ok) {
            throw new Error("Rate limit check failed");
        }

        const data = await response.json();
        const remaining = data.rate.remaining;

        console.log("GitHub API Remaining:", remaining);

        if (remaining < 10) {
            console.warn("GitHub API rate limit is running low.");
        }
    } catch (error) {
        console.error(error);
    }
}

/*=========================================================
    INITIALIZATION
    (fixed: this is now the ONLY place that triggers the
    initial network fetches. The original file called
    fetchGithubProfile()/fetchRepositories() directly at
    the bottom of Part 1 and Part 2 *and* again here inside
    initializeGithub() on DOMContentLoaded — meaning every
    page load made 4 GitHub API requests instead of 2,
    burning through the unauthenticated rate limit twice as
    fast, and racing two concurrent renders of the same
    data. Also fixed: githubStatistics()/calculateProfileScore()
    weren't being recalculated when data came from cache.)
=========================================================*/

async function initializeGithub() {
    const usedCache = loadGithubCache();

    if (!usedCache) {
        await fetchGithubProfile();
        await fetchRepositories();
        saveGithubCache();
    }

    githubStatistics();
    calculateProfileScore();
    checkRateLimit();
    githubTimestamp();
}

document.addEventListener("DOMContentLoaded", initializeGithub);

/*=========================================================
    END OF GITHUB.JS
=========================================================*/