/* ============================================================
   ARIQ / ARCHIVE — data & interactions
   Edit the CONFIG block below to make this site yours.
   ============================================================ */

/* ------------------------------------------------------------
   CONFIG — fill these in. Anything left as the default
   placeholder value is automatically hidden instead of being
   rendered as a dead/broken link.
------------------------------------------------------------ */
const GITHUB_USERNAME = "rixs4k";

const projects = [
  {
    number: "01",
    title: "GitCanvas",
    type: "FULL-STACK",
    description: "A CLI script refactored into a production-grade FastAPI dashboard — layered backend, live WebSocket progress streaming, and Gitfiti-style commit pixel art. Dependency-free vanilla JS frontend, tested end-to-end.",
    stack: ["Python", "FastAPI", "WebSocket", "ES Modules"],
    github: "",
    demo: ""
  },
  {
    number: "02",
    title: "SDN Citapen CMS",
    type: "FULL-STACK",
    description: "A complete school CMS built from scratch — 46 routes and 180+ files, shipped across 9 structured build steps. Neobrutalist design system throughout.",
    stack: ["Next.js 15", "TypeScript", "Tailwind v4", "Firebase", "Cloudinary"],
    github: "",
    demo: ""
  },
  {
    number: "03",
    title: "NeoDrive",
    type: "HARDWARE",
    description: "A mini NAS running on an ESP32 with a neobrutalist web UI — MicroSD file management, music/video streaming, OTA updates, dual WiFi AP/STA modes, an OLED status display, and session-based auth.",
    stack: ["ESP32", "C++", "Web UI"],
    github: "",
    demo: ""
  },
  {
    number: "04",
    title: "DuitKu",
    type: "WEB APP",
    description: "A personal finance tracker using Google Sheets as a database. Daily dues tracking module, animated neobrutalist UI, dark matte theme, and a real test suite behind it.",
    stack: ["JavaScript", "Google Sheets API", "CSS"],
    github: "",
    demo: ""
  },
  {
    number: "05",
    title: "VOID.CHAT",
    type: "WEB APP",
    description: "A real-time chat app on Firebase, rebuilt with a full bug-fix pass and a deep crimson neobrutalism redesign.",
    stack: ["JavaScript", "Firebase", "CSS"],
    github: "",
    demo: ""
  },
];

const contacts = {
  instagram: "YOUR_INSTAGRAM",
  whatsapp:  "YOUR_WHATSAPP_NUMBER",
  facebook:  "YOUR_FACEBOOK",
  email:     "YOUR_EMAIL@example.com",
};

/* ------------------------------------------------------------
   Helpers
------------------------------------------------------------ */
const isPlaceholder = (v) => !v || /^YOUR_/i.test(v);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Minimal HTML-escaping for text we inject via innerHTML. */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ------------------------------------------------------------
   1. BUILD PROJECT FOLDERS — compact accordion, one open at a
      time. Collapsed rows keep the whole 5-item index short
      enough to fit one screen; tap a row to expand it in place.
------------------------------------------------------------ */
const stackEl = document.getElementById("folder-stack");

if (stackEl) {
  projects.forEach((p, i) => {
    const li = document.createElement("li");
    li.className = "folder";
    if (i === 0) li.classList.add("open"); // preview the interaction on load

    // Primary CTA always resolves to *something a visitor can click*:
    // prefer the live demo, fall back to the repo, and if neither is
    // configured yet, render a clearly-disabled button instead of a
    // dead link or nothing at all.
    const primaryUrl = p.demo || p.github || "";
    const primaryLabel = p.demo ? "VIEW PROJECT" : (p.github ? "VIEW SOURCE" : "NOT PUBLISHED YET");
    const secondaryUrl = p.demo && p.github ? p.github : "";

    const cta = primaryUrl
      ? `<a class="fold-cta" href="${esc(primaryUrl)}" target="_blank" rel="noopener">${esc(primaryLabel)} &#8599;</a>`
      : `<span class="fold-cta" aria-disabled="true">${esc(primaryLabel)}</span>`;
    const secondary = secondaryUrl
      ? `<a class="fold-secondary" href="${esc(secondaryUrl)}" target="_blank" rel="noopener">VIEW SOURCE &#8599;</a>`
      : "";
    const links = cta + secondary;
    const panelId = `fold-panel-${i}`;

    li.innerHTML = `
      <button type="button" class="fold-head" aria-expanded="${i === 0}" aria-controls="${panelId}">
        <span class="fold-num" aria-hidden="true">${esc(p.number)}</span>
        <span class="fold-heading">
          <h3>${esc(p.title)}</h3>
          <span class="fold-type">${esc(p.type)}</span>
        </span>
        <span class="fold-chevron" aria-hidden="true"></span>
      </button>
      <div class="fold-collapse">
        <div class="fold-collapse-inner" id="${panelId}">
          <div class="fold-collapse-pad">
            <p class="fold-desc">${esc(p.description)}</p>
            <div class="fold-tags">${p.stack.map(s => `<span>${esc(s)}</span>`).join("")}</div>
            <div class="fold-links">${links}</div>
          </div>
        </div>
      </div>`;

    li.querySelector(".fold-head").addEventListener("click", () => {
      const willOpen = !li.classList.contains("open");
      stackEl.querySelectorAll(".folder.open").forEach(f => {
        if (f !== li) {
          f.classList.remove("open");
          f.querySelector(".fold-head").setAttribute("aria-expanded", "false");
        }
      });
      li.classList.toggle("open", willOpen);
      li.querySelector(".fold-head").setAttribute("aria-expanded", String(willOpen));
    });

    stackEl.appendChild(li);
  });
}

/* ------------------------------------------------------------
   2. ABOUT TIMELINE — same compact-accordion treatment as the
      project folders, so all 6 entries fit one screen too.
      Multiple entries can stay open at once (it's a reading log,
      not a single-focus picker like the project index).
------------------------------------------------------------ */
document.querySelectorAll(".tl-item").forEach(item => {
  const head = item.querySelector(".tl-head");
  if (!head) return;
  head.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");
    item.classList.toggle("open", willOpen);
    head.setAttribute("aria-expanded", String(willOpen));
  });
});

/* ------------------------------------------------------------
   3. GITHUB API (graceful fallback built into HTML)
------------------------------------------------------------ */
(() => {
  const body = document.getElementById("gh-body");
  if (!body) return;

  if (isPlaceholder(GITHUB_USERNAME)) return; // keep static fallback markup

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}`, { signal: controller.signal })
    .then(res => {
      if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
      return res.json();
    })
    .then(d => {
      body.innerHTML = `
        <p>GITHUB<br><a href="${esc(d.html_url)}" target="_blank" rel="noopener">github.com/${esc(d.login)}</a></p>
        <div class="gh-stats">
          <div><span>${Number(d.public_repos) || 0}</span>REPOS</div>
          <div><span>${Number(d.followers) || 0}</span>FOLLOWERS</div>
        </div>`;
    })
    .catch(() => {
      /* network error, rate limit, or bad username — fallback markup already in place */
    })
    .finally(() => clearTimeout(timeout));
})();

/* ------------------------------------------------------------
   4. CONTACT CHANNELS — placeholders are skipped, not rendered
------------------------------------------------------------ */
(() => {
  const el = document.getElementById("channels");
  if (!el) return;

  const items = [];
  if (!isPlaceholder(contacts.instagram)) {
    items.push(`<a class="channel" href="${esc(contacts.instagram)}" target="_blank" rel="noopener">
      <span class="ch-kind">SOCIAL</span><span class="ch-value">INSTAGRAM</span>
    </a>`);
  }
  if (!isPlaceholder(contacts.whatsapp)) {
    const digits = String(contacts.whatsapp).replace(/[^\d]/g, "");
    items.push(`<a class="channel" href="https://wa.me/${esc(digits)}" target="_blank" rel="noopener">
      <span class="ch-kind">DIRECT</span><span class="ch-value">WHATSAPP</span>
    </a>`);
  }
  if (!isPlaceholder(contacts.facebook)) {
    items.push(`<a class="channel" href="${esc(contacts.facebook)}" target="_blank" rel="noopener">
      <span class="ch-kind">SOCIAL</span><span class="ch-value">FACEBOOK</span>
    </a>`);
  }
  if (!isPlaceholder(contacts.email)) {
    items.push(`<a class="channel channel-mail" href="mailto:${esc(contacts.email)}">
      <span><span class="ch-kind">PRIMARY CHANNEL</span><span class="ch-value">${esc(contacts.email)}</span></span>
      <span class="ch-arrow">&#8599;</span>
    </a>`);
  }

  el.innerHTML = items.length
    ? items.join("")
    : `<p class="channel-empty">Contact channels aren't configured yet — edit the <code>contacts</code> object in script.js.</p>`;
})();

/* ------------------------------------------------------------
   5. REVEAL ON SCROLL (IntersectionObserver)
------------------------------------------------------------ */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("in-view");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal, .reveal-up").forEach(el => io.observe(el));
} else {
  // no IntersectionObserver support — just show everything
  document.querySelectorAll(".reveal, .reveal-up").forEach(el => el.classList.add("in-view"));
}

/* ------------------------------------------------------------
   6. MOBILE NAV
------------------------------------------------------------ */
(() => {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "CLOSE" : "INDEX";
  });
  document.querySelectorAll(".nav-list a").forEach(a =>
    a.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "INDEX";
    }));

  // active section highlight
  const sections = [...document.querySelectorAll("main section")];
  const navLinks = [...document.querySelectorAll(".nav-list a")];
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const secIO = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          navLinks.forEach(a => a.classList.toggle("active", a.hash === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(s => secIO.observe(s));
  }
})();

/* ------------------------------------------------------------
   7. LIVE CHARACTER AVATAR — loads Ariiq's own character model
      (assets/EVILVOIDteam_icon.glb, optimised down from a 76.8 MB
      export to ~2.2 MB — 52.8k vertices, 1024px webp textures —
      so it actually loads quickly on mobile). Auto-fits the camera
      to whatever the model's real bounding box turns out to be
      (no more guessing proportions blind), idles with a slow
      turntable + gentle bob, and responds to drag. Falls back to
      the plain "MAA" monogram if Three.js/GLTFLoader/WebGL isn't
      available, or if the model itself fails to load.
------------------------------------------------------------ */
(() => {
  const wrap = document.getElementById("avatar-3d");
  const canvas = document.getElementById("avatar-canvas");
  const hint = document.getElementById("avatar-hint");
  const loadingEl = document.getElementById("avatar-loading");
  const MODEL_URL = "assets/EVILVOIDteam_icon.glb";
  if (!wrap || !canvas) return;

  const showFallback = () => {
    wrap.classList.add("is-fallback");
    if (hint) hint.style.display = "none";
    if (loadingEl) loadingEl.classList.add("is-hidden");
  };
  const hideLoading = () => { if (loadingEl) loadingEl.classList.add("is-hidden"); };

  if (typeof THREE === "undefined" || typeof THREE.GLTFLoader === "undefined") { showFallback(); return; }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    showFallback();
    return;
  }
  if (!renderer.getContext()) { showFallback(); return; }
  renderer.outputEncoding = THREE.sRGBEncoding; // correct API for r128 (the CDN version loaded)
  renderer.physicallyCorrectLights = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 1000);

  // a simple neutral studio rig — bright enough to read the model's
  // own PBR textures without blowing them out
  scene.add(new THREE.HemisphereLight(0xfff6ea, 0x24211f, 0.9));
  const key = new THREE.DirectionalLight(0xfff4e6, 1.1);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.45);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  // a soft contact shadow — a radial-gradient sprite beneath the
  // model, coloured from the page's own --text (noir) so it reads
  // as a real dropped shadow rather than a light source. A gradient
  // sprite (vs. a real-time shadow map) stays scale-safe regardless
  // of the model's native units and is guaranteed to render.
  const inkHex = (getComputedStyle(document.documentElement).getPropertyValue("--text") || "#060D0C").trim() || "#060D0C";
  const inkRgb = new THREE.Color(inkHex);
  const inkRgbStr = `${Math.round(inkRgb.r * 255)},${Math.round(inkRgb.g * 255)},${Math.round(inkRgb.b * 255)}`;

  function makeShadowTexture() {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, `rgba(${inkRgbStr},0.32)`);
    g.addColorStop(0.55, `rgba(${inkRgbStr},0.14)`);
    g.addColorStop(1, `rgba(${inkRgbStr},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }
  const glowMat = new THREE.MeshBasicMaterial({
    map: makeShadowTexture(),
    transparent: true,
    depthWrite: false,
  });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMat);
  glow.rotation.x = -Math.PI / 2;
  scene.add(glow); // stays put in the scene (not the drag pivot) like a real floor mark

  const pivot = new THREE.Group(); // drag/idle rotation happens here
  scene.add(pivot);

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function resize() {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(wrap);
  } else {
    addEventListener("resize", resize);
  }
  resize();

  const loader = new THREE.GLTFLoader();
  loader.load(
    MODEL_URL,
    (gltf) => {
      const model = gltf.scene;

      // auto-fit: recentre the model on its own bounding-box centre
      // and back the camera off just far enough to frame it with a
      // comfortable margin, whatever the model's native scale/pivot
      // turns out to be — no more hand-guessed numbers.
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      const radius = Math.max(size.x, size.y, size.z) / 2 || 1;
      const fitDistance = radius / Math.sin((camera.fov * Math.PI / 180) / 2);
      camera.position.set(0, 0, fitDistance * 1.35); // 1.35x = margin around the model
      camera.near = fitDistance / 100;
      camera.far = fitDistance * 100;
      camera.updateProjectionMatrix();

      // size and place the fire-glow contact shadow relative to the
      // model's own measured footprint — same auto-fit approach as
      // the camera above, so it's never a guessed absolute size
      glow.scale.setScalar(radius * 2.4);
      glow.userData.baseScale = radius * 2.4;
      glow.position.y = box.min.y - center.y + radius * 0.015; // tiny lift, avoids z-fighting with the model's own base

      pivot.add(model);
      hideLoading();
    },
    (progress) => {
      if (loadingEl && progress.lengthComputable) {
        const pct = Math.round((progress.loaded / progress.total) * 100);
        loadingEl.textContent = `LOADING MODEL… ${pct}%`;
      }
    },
    (err) => {
      showFallback();
    }
  );

  // drag-to-rotate (pointer events cover mouse, touch, and pen alike)
  let dragging = false, lastX = 0, lastY = 0, spin = 0, settleUntil = 0;

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    wrap.style.cursor = "grabbing";
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    pivot.rotation.y += dx * .008;
    pivot.rotation.x = clamp(pivot.rotation.x + dy * .008, -.5, .5);
    spin = dx * .0006;
    lastX = e.clientX; lastY = e.clientY;
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    wrap.style.cursor = "grab";
    settleUntil = performance.now() + 1400; // let a flicked spin ease out before resuming idle drift
  };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  const start = performance.now();
  let raf = null;

  function tick(now) {
    const elapsed = (now - start) / 1000;

    if (reduceMotion) {
      pivot.rotation.set(0, .3, 0);
      pivot.position.y = 0;
      glowMat.opacity = 1; // steady, no motion
    } else {
      if (!dragging) {
        if (now < settleUntil) {
          spin *= .93;
          pivot.rotation.y += spin;
        } else {
          pivot.rotation.y += .0018; // idle turntable drift
        }
        pivot.position.y = Math.sin(elapsed * .9) * .04;
      }
      // the shadow doesn't animate on its own — it just answers to
      // how high the character is currently bobbing (same .9 phase
      // as pivot.position.y above), the way a real dropped shadow
      // would faintly shrink and soften as the thing above it lifts
      // a little further away. One shared rhythm instead of a second
      // competing animation.
      const lift = Math.sin(elapsed * .9); // -1..1, same phase as the bob
      glowMat.opacity = clamp(1 - lift * 0.12, 0.8, 1);
      const breathe = 1 - lift * 0.04;
      const base = glow.userData.baseScale || glow.scale.x;
      glow.scale.set(base * breathe, base * breathe, 1);
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else if (!raf) {
      raf = requestAnimationFrame(tick);
    }
  });
})();

/* ------------------------------------------------------------
   8. TINY CLOCK METADATA (identity header)
------------------------------------------------------------ */
(() => {
  const clockEl = document.querySelector("[data-clock]");
  if (!clockEl) return;
  const tick = () => { clockEl.textContent = new Date().toLocaleTimeString("en-GB"); };
  tick();
  setInterval(tick, 1000);
})();
