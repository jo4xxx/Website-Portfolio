
// RETRO PORTFOLIO VERSION 06

document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ========================================
// RETRO BOOT SCREEN
// ========================================

const bootScreen = document.getElementById("boot-screen");
const progressFill = document.getElementById("progress-fill");
const bootMessage = document.getElementById("boot-message");
const bootPercent = document.getElementById("boot-percent");

let bootStarted = false;

function startBoot() {
  if (bootStarted) return;

  bootStarted = true;

  const steps = reducedMotion
    ? [
        { progress: 100, message: "SYSTEM READY." }
      ]
    : [
        { progress: 25, message: "CHECKING DISPLAY..." },
        { progress: 50, message: "LOADING COMPONENTS..." },
        { progress: 75, message: "PREPARING INTERFACE..." },
        { progress: 100, message: "SYSTEM READY." }
      ];

  steps.forEach((step, index) => {
    window.setTimeout(() => {
      progressFill.style.width = step.progress + "%";

      bootMessage.textContent = step.message;

      bootPercent.textContent =
        String(step.progress).padStart(3, "0") + "%";

    }, reducedMotion ? 0 : index * 210);
  });

  window.setTimeout(() => {
    bootScreen.classList.add("hidden");
    bootScreen.setAttribute("aria-hidden", "true");
  }, reducedMotion ? 110 : 1150);
}

if (document.readyState === "complete") {
  startBoot();
} else {
  window.addEventListener("load", startBoot, {
    once: true
  });
}

// ========================================
// MOBILE NAVIGATION
// ========================================

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-link");

function closeMenu() {
  navLinks.classList.remove("open");

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  menuToggle.setAttribute(
    "aria-label",
    "Open navigation"
  );
}

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(open)
  );

  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation"
  );
});

navItems.forEach(link => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

document.addEventListener("click", event => {
  if (
    !navLinks.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) closeMenu();
});

// ========================================
// ACTIVE SECTION HIGHLIGHT
// ========================================

const sections = document.querySelectorAll("main section[id]");

function updateActiveLink() {
  let current = "home";

  const threshold =
    window.scrollY + window.innerHeight * 0.4;

  sections.forEach(section => {
    if (section.offsetTop <= threshold) {
      current = section.id;
    }
  });

  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 4
  ) {
    current = "contact";
  }

  navItems.forEach(link => {
    const active =
      link.getAttribute("href") === "#" + current;

    link.classList.toggle("active", active);

    if (active) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("scroll", updateActiveLink, {
  passive: true
});

window.addEventListener("resize", updateActiveLink);

updateActiveLink();

// ========================================
// RETRO TYPEWRITER TEXT REVEAL
// ========================================

// Text stays in the original HTML.
// The animation reveals each element in
// short, stepped terminal-style bursts.

const motionSelectors = [
  ".hero-content .eyebrow",
  ".hero-content .terminal-label",
  ".hero h1",
  ".hero-description",
  ".section-header > span",
  ".section-header h2",
  ".section-header small",
  ".window-bar span",
  ".field-label",
  ".identity-box p",
  ".about-details h3",
  ".placeholder-text",
  ".about-fields span",
  ".about-fields p",
  ".timeline-date",
  ".timeline-card h3",
  ".timeline-card h4",
  ".timeline-card p",
  ".card-top span",
  ".cert-card h3",
  ".cert-card p",
  ".cert-bottom span",
  ".project-body h3",
  ".project-body p",
  ".tags span",
  ".project-links span",
  ".contact-info h3",
  ".muted",
  ".contact-status span:last-child",
  ".contact-row span",
  ".contact-row p"
].join(",");

const revealItems = document.querySelectorAll(".reveal");

function animateText(group) {
  if (
    reducedMotion ||
    group.classList.contains("lanyard-stage")
  ) {
    return;
  }

  const items = [
    ...group.querySelectorAll(motionSelectors)
  ];

  if (group.matches(motionSelectors)) {
    items.unshift(group);
  }

  items.forEach((element, index) => {
    if (element.classList.contains("type-done")) {
      return;
    }

    const length =
      (element.textContent || "").trim().length;

    const isHeading =
      element.matches("h1,h2,h3,h4");

    const duration = Math.min(
      isHeading ? 1050 : 620,
      Math.max(
        280,
        length * (isHeading ? 24 : 11)
      )
    );

    element.style.setProperty(
      "--type-duration",
      `${duration}ms`
    );

    element.style.setProperty(
      "--type-steps",
      Math.max(6, Math.min(length, 48))
    );

    const delay = Math.min(index * 65, 800);

    window.setTimeout(() => {
      element.classList.add("type-playing");

      element.addEventListener(
        "animationend",
        () => {
          element.classList.remove("type-playing");
          element.classList.add("type-done");
        },
        { once: true }
      );
    }, delay);
  });
}

// ========================================
// SCROLL OBSERVER
// ========================================

if (
  reducedMotion ||
  !("IntersectionObserver" in window)
) {
  revealItems.forEach(item => {
    item.classList.add("visible");
  });
} else {

  // Prepare the text before entering view.
  revealItems.forEach(group => {
    if (group.classList.contains("lanyard-stage")) {
      return;
    }

    group.querySelectorAll(motionSelectors).forEach(
      element => {
        element.classList.add("type-target");
      }
    );
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");

        animateText(entry.target);

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -20px 0px"
    }
  );

  revealItems.forEach(item => {
    observer.observe(item);
  });
}

// ========================================
// READING PROGRESS INDICATOR
// ========================================

const progressBar = document.getElementById(
  "reading-progress-fill"
);

function updateProgress() {
  const max =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const percent = max > 0
    ? Math.min(
        100,
        Math.max(0, (window.scrollY / max) * 100)
      )
    : 0;

  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }
}

window.addEventListener("scroll", updateProgress, {
  passive: true
});

window.addEventListener("resize", updateProgress);

updateProgress();

// ========================================
// FOOTER YEAR
// ========================================

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// ========================================
// INTERACTIVE HANGING ID
// ========================================

const stage = document.getElementById("lanyard-stage");
const badge = document.getElementById("lanyard-badge");
const ropes = document.getElementById("lanyard-ropes");

const leftStrap = document.getElementById("strap-left");
const rightStrap = document.getElementById("strap-right");
const leftEdge = document.getElementById("strap-left-edge");
const rightEdge = document.getElementById("strap-right-edge");

if (
  stage &&
  badge &&
  ropes &&
  leftStrap &&
  rightStrap &&
  leftEdge &&
  rightEdge
) {

  const position = { x: 0, y: 0 };
  const speed = { x: 0, y: 0 };

  let pointerId = null;
  let dragging = false;

  let startPointer = { x: 0, y: 0 };
  let startPosition = { x: 0, y: 0 };

  let springFrame = null;
  let idleFrame = null;
  let visible = true;

  const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

  const maxX = () =>
    Math.min(115, stage.clientWidth * 0.24);

  // DRAW CONNECTED LANYARD STRAPS

  function drawStraps() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;

    if (!width || !height) return;

    ropes.setAttribute(
      "viewBox",
      `0 0 ${width} ${height}`
    );

    const anchorX = width / 2;

    const idleY = parseFloat(
      badge.style.getPropertyValue("--idle-y")
    ) || 0;

    const ringY =
      badge.offsetTop +
      position.y +
      idleY +
      16;

    const clipX = anchorX + position.x;
    const bend = position.x * 0.25;

    const left = `
      M ${anchorX - 18} 10
      C ${anchorX - 33} 85,
        ${clipX - 25 - bend} ${ringY * 0.69},
        ${clipX - 10} ${ringY}
    `;

    const right = `
      M ${anchorX + 18} 10
      C ${anchorX + 33} 85,
        ${clipX + 25 - bend} ${ringY * 0.69},
        ${clipX + 10} ${ringY}
    `;

    leftStrap.setAttribute("d", left);
    leftEdge.setAttribute("d", left);

    rightStrap.setAttribute("d", right);
    rightEdge.setAttribute("d", right);
  }

  // UPDATE BADGE POSITION

  function render() {
    badge.style.setProperty(
      "--drag-x",
      `${position.x}px`
    );

    badge.style.setProperty(
      "--drag-y",
      `${position.y}px`
    );

    const angle = clamp(
      8 + position.x * 0.12,
      -18,
      25
    );

    badge.style.setProperty(
      "--badge-angle",
      `${angle}deg`
    );

    drawStraps();
  }

  // STOP ANIMATIONS

  function stopIdle() {
    if (idleFrame !== null) {
      cancelAnimationFrame(idleFrame);
    }

    idleFrame = null;

    badge.style.setProperty("--idle-y", "0px");
    badge.style.setProperty("--idle-angle", "0deg");
  }

  function stopSpring() {
    if (springFrame !== null) {
      cancelAnimationFrame(springFrame);
    }

    springFrame = null;
  }

  // NATURAL DANGLING ANIMATION

  function beginIdle() {
    stopIdle();

    if (
      reducedMotion ||
      !visible ||
      dragging
    ) {
      drawStraps();
      return;
    }

    function cycle(time) {
      if (!visible || dragging) return;

      const angle =
        Math.sin(time / 1050) * 2.1;

      const vertical =
        Math.sin(time / 1450) * 3;

      badge.style.setProperty(
        "--idle-angle",
        `${angle}deg`
      );

      badge.style.setProperty(
        "--idle-y",
        `${vertical}px`
      );

      drawStraps();

      idleFrame = requestAnimationFrame(cycle);
    }

    idleFrame = requestAnimationFrame(cycle);
  }

  // SPRING RETURN AFTER DRAGGING

  function settle() {
    stopSpring();

    if (reducedMotion) {
      position.x = 0;
      position.y = 0;

      speed.x = 0;
      speed.y = 0;

      render();
      return;
    }

    function step() {
      speed.x =
        (speed.x - position.x * 0.065) * 0.84;

      speed.y =
        (speed.y - position.y * 0.070) * 0.82;

      position.x += speed.x;
      position.y += speed.y;

      render();

      const moving =
        Math.abs(position.x) +
        Math.abs(position.y) +
        Math.abs(speed.x) +
        Math.abs(speed.y) > 0.4;

      if (moving) {
        springFrame = requestAnimationFrame(step);
      } else {
        position.x = 0;
        position.y = 0;

        speed.x = 0;
        speed.y = 0;

        springFrame = null;

        render();
        beginIdle();
      }
    }

    springFrame = requestAnimationFrame(step);
  }

  // START DRAGGING

  badge.addEventListener("pointerdown", event => {
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    stopSpring();
    stopIdle();

    dragging = true;
    pointerId = event.pointerId;

    startPointer = {
      x: event.clientX,
      y: event.clientY
    };

    startPosition = { ...position };

    speed.x = 0;
    speed.y = 0;

    badge.classList.add("is-dragging");

    badge.setPointerCapture(event.pointerId);
  });

  // MOVE BADGE

  badge.addEventListener("pointermove", event => {
    if (
      !dragging ||
      event.pointerId !== pointerId
    ) {
      return;
    }

    const nextX = clamp(
      startPosition.x +
      event.clientX -
      startPointer.x,
      -maxX(),
      maxX()
    );

    const nextY = clamp(
      startPosition.y +
      event.clientY -
      startPointer.y,
      -75,
      125
    );

    speed.x =
      (nextX - position.x) * 0.24;

    speed.y =
      (nextY - position.y) * 0.24;

    position.x = nextX;
    position.y = nextY;

    render();
  });

  // RELEASE BADGE

  function release(event) {
    if (
      !dragging ||
      event.pointerId !== pointerId
    ) {
      return;
    }

    dragging = false;
    pointerId = null;

    badge.classList.remove("is-dragging");

    if (badge.hasPointerCapture(event.pointerId)) {
      badge.releasePointerCapture(event.pointerId);
    }

    settle();
  }

  badge.addEventListener("pointerup", release);
  badge.addEventListener("pointercancel", release);

  badge.addEventListener("lostpointercapture", () => {
    if (!dragging) return;

    dragging = false;
    pointerId = null;

    badge.classList.remove("is-dragging");

    settle();
  });

  // KEYBOARD INTERACTION

  badge.addEventListener("keydown", event => {
    const keys = {
      ArrowLeft: [-16, 0],
      ArrowRight: [16, 0],
      ArrowUp: [0, -16],
      ArrowDown: [0, 16]
    };

    if (event.key === "Escape") {
      event.preventDefault();
      settle();
      return;
    }

    if (!keys[event.key]) return;

    event.preventDefault();

    stopSpring();
    stopIdle();

    const [dx, dy] = keys[event.key];

    position.x = clamp(
      position.x + dx,
      -maxX(),
      maxX()
    );

    position.y = clamp(
      position.y + dy,
      -75,
      125
    );

    render();
  });

  badge.addEventListener("keyup", event => {
    const arrows = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown"
    ];

    if (arrows.includes(event.key)) {
      settle();
    }
  });

  // PAUSE WHEN OFF SCREEN

  if ("IntersectionObserver" in window) {
    const stageObserver = new IntersectionObserver(
      entries => {
        visible = entries[0].isIntersecting;

        if (
          visible &&
          !dragging &&
          springFrame === null
        ) {
          beginIdle();
        } else if (!visible) {
          stopIdle();
        }
      }
    );

    stageObserver.observe(stage);
  }

  // PAUSE IN BACKGROUND TABS

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopIdle();
    } else if (
      visible &&
      !dragging &&
      springFrame === null
    ) {
      beginIdle();
    }
  });

  window.addEventListener("resize", render);

  render();
  beginIdle();
}


// ========================================
// CONTACT DETAILS
// ========================================

const portfolioContact = {
  email: "joaxrafael14@gmail.com",
  phone: "+63 9611420112",
  github: "https://github.com/jo4xxx",
  linkedin: "https://www.linkedin.com/in/joaquinrucio/",
  facebook: "https://www.facebook.com/jo4xx"
};

Object.entries(portfolioContact).forEach(([channel, rawValue]) => {
  const row = document.querySelector(
    `[data-contact="${channel}"]`
  );

  const value = String(rawValue || "").trim();

  if (!row || !value) return;

  const link = document.createElement("a");

  if (channel === "email") {
    link.href = `mailto:${value}`;
  } else if (channel === "phone") {
    link.href = `tel:${value.replace(/[^+\d]/g, "")}`;
  } else {
    try {
      const url = new URL(value);

      if (url.protocol !== "https:") return;

      link.href = url.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } catch {
      return;
    }
  }

  link.textContent = value;
  row.replaceChildren(link);
});

// ========================================
// OPTIONAL PHOTO AND IMAGE LOADING
// ========================================

document.querySelectorAll("img[data-optional-image]").forEach(img => {

  const onLoad = () => {
    if (img.naturalWidth > 0) {
      img.classList.add("ready");
    }
  };

  img.addEventListener("load", onLoad);

  img.addEventListener("error", () => {
    img.classList.remove("ready");
  });

  if (img.complete) {
    onLoad();
  }
});

// ========================================
// CERTIFICATION AND PROJECT CAROUSELS
// ========================================

document.querySelectorAll("[data-carousel]").forEach(track => {

  const shell = track.closest(".carousel-shell");

  const prev = shell.querySelector(".carousel-prev");
  const next = shell.querySelector(".carousel-next");
  const buttons = shell.querySelector(".carousel-buttons");

  const getStep = () => {
    const card = track.firstElementChild;

    if (!card) return track.clientWidth;

    const gap =
      parseFloat(getComputedStyle(track).gap) || 0;

    return card.getBoundingClientRect().width + gap;
  };

  const refresh = () => {
    const max = Math.max(
      0,
      track.scrollWidth - track.clientWidth
    );

    buttons.hidden = max < 4;

    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft >= max - 4;
  };

  prev.addEventListener("click", () => {
    track.scrollBy({
      left: -getStep(),
      behavior: reducedMotion ? "auto" : "smooth"
    });
  });

  next.addEventListener("click", () => {
    track.scrollBy({
      left: getStep(),
      behavior: reducedMotion ? "auto" : "smooth"
    });
  });

  track.addEventListener("scroll", refresh, {
    passive: true
  });

  window.addEventListener("resize", refresh);
  window.addEventListener("load", refresh);

  refresh();
});

