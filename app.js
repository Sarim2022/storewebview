/**
 * NotesInbox store page — basic interactions
 * Customize APK_URL when you host the release on GitHub.
 */

const CONFIG = {
  appName: "NotesInbox",
  // APK in the same folder as this page (GitHub Pages)
  apkUrl: "app-debug.apk",
  apkFileName: "NotesInbox.apk",
  // Screenshots in appscrenshot/ (Play Store strip)
  screenshots: [
    "appscrenshot/shot-01.png",
    "appscrenshot/shot-02.png",
    "appscrenshot/shot-03.png",
    "appscrenshot/shot-04.png",
    "appscrenshot/shot-05.png",
    "appscrenshot/shot-06.png",
    "appscrenshot/shot-07.png",
  ],
};

const installBtn = document.getElementById("installBtn");
const shareBtn = document.getElementById("shareBtn");
const wishlistBtn = document.getElementById("wishlistBtn");
const trailerBtn = document.getElementById("trailerBtn");
const aboutText = document.getElementById("aboutText");
const toastEl = document.getElementById("toast");
const heroArt = document.querySelector(".hero-art");

let toastTimer = null;

function showToast(message) {
  toastEl.hidden = false;
  toastEl.textContent = message;
  requestAnimationFrame(() => toastEl.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
    setTimeout(() => {
      toastEl.hidden = true;
    }, 200);
  }, 2200);
}

function startApkDownload() {
  const a = document.createElement("a");
  a.href = CONFIG.apkUrl;
  a.download = CONFIG.apkFileName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function triggerInstall() {
  if (installBtn.classList.contains("installed")) {
    startApkDownload();
    showToast("Download started");
    return;
  }

  installBtn.textContent = "Downloading…";
  installBtn.disabled = true;

  // Start APK download immediately (Android Chrome / Safari will save the file)
  startApkDownload();
  showToast("Download started");

  setTimeout(() => {
    installBtn.disabled = false;
    installBtn.textContent = "Open";
    installBtn.classList.add("installed");
  }, 900);
}

installBtn?.addEventListener("click", triggerInstall);

shareBtn?.addEventListener("click", async () => {
  const shareData = {
    title: CONFIG.appName,
    text: "Try NotesInbox — notes in an inbox UI, all local on your phone.",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied");
    } else {
      showToast("Share: copy the page URL");
    }
  } catch {
    // User cancelled share sheet
  }
});

wishlistBtn?.addEventListener("click", () => {
  const saved = wishlistBtn.classList.toggle("saved");
  wishlistBtn.querySelector("svg path")?.setAttribute(
    "d",
    saved
      ? "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"
      : "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15-5-2.18L7 18V5h10v13z"
  );
  showToast(saved ? "Added to wishlist" : "Removed from wishlist");
});

trailerBtn?.addEventListener("click", () => {
  showToast("Trailer coming soon");
});

heroArt?.addEventListener("click", () => {
  heroArt.classList.toggle("show-trailer");
});

// Expand about on section-head click
document.querySelectorAll(".section-head").forEach((head) => {
  head.addEventListener("click", () => {
    const text = head.parentElement?.querySelector(".about-text");
    if (text) {
      text.classList.toggle("expanded");
    }
  });
});

// Bottom nav — visual only for now
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
    item.classList.add("active");
  });
});

/* —— Screenshots strip + lightbox —— */
const shotScroll = document.getElementById("shotScroll");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let shotIndex = 0;

function renderScreenshots() {
  if (!shotScroll) return;
  shotScroll.innerHTML = "";

  CONFIG.screenshots.forEach((src, i) => {
    const wrap = document.createElement("div");
    wrap.className = "shot";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", `Screenshot ${i + 1}`);

    const img = document.createElement("img");
    img.src = src;
    img.alt = `NotesInbox screenshot ${i + 1}`;
    img.loading = "lazy";
    img.decoding = "async";

    btn.appendChild(img);
    btn.addEventListener("click", () => openLightbox(i));
    wrap.appendChild(btn);
    shotScroll.appendChild(wrap);
  });
}

function openLightbox(index) {
  shotIndex = index;
  lightboxImg.src = CONFIG.screenshots[shotIndex];
  lightbox.hidden = false;
  document.querySelector(".content")?.classList.add("no-scroll");
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.removeAttribute("src");
  document.querySelector(".content")?.classList.remove("no-scroll");
}

function stepLightbox(delta) {
  const len = CONFIG.screenshots.length;
  shotIndex = (shotIndex + delta + len) % len;
  lightboxImg.src = CONFIG.screenshots[shotIndex];
}

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => stepLightbox(-1));
lightboxNext?.addEventListener("click", () => stepLightbox(1));

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox?.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});

renderScreenshots();
