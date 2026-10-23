// Tiago Nunes dos Santos — interações do site
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menu = document.getElementById("menu");
  const toggle = document.querySelector(".nav__toggle");
  const progress = document.querySelector(".scroll-progress");

  // ---------- Menu mobile ----------
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (menu.classList.contains("is-open") && !e.target.closest(".nav__pill")) setMenu(false);
  });

  // ---------- Barra de progresso ----------
  let ticking = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // ---------- Link ativo no menu ----------
  const links = [...menu.querySelectorAll('a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => {
        const active = a.getAttribute("href") === `#${entry.target.id}`;
        a.classList.toggle("is-active", active);
        if (active) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => activeObserver.observe(s));

  // ---------- Títulos palavra por palavra ----------
  const splitWords = (el) => {
    let i = 0;
    const wrap = (node) => {
      const word = document.createElement("span");
      word.className = "word";
      node.style.setProperty("--i", i++);
      word.append(node);
      return word;
    };
    [...el.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(" ");
          const inner = document.createElement("span");
          inner.textContent = part;
          frag.append(wrap(inner));
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "BR") {
        const placeholder = document.createComment("");
        node.replaceWith(placeholder);
        placeholder.replaceWith(wrap(node));
      }
    });
  };
  if (!reduceMotion) {
    document.querySelectorAll(".intro__name, .now__title, .cta__title").forEach(splitWords);
  }
  document.querySelectorAll(".job__list").forEach((list) => {
    [...list.children].forEach((li, i) => li.style.setProperty("--li", i));
  });

  // ---------- Fade-in ao rolar ----------
  const reveals = document.querySelectorAll(".reveal");
  // escalonamento suave entre tiles do mesmo grid
  reveals.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--delay", `${Math.min(i, 6) * 0.08}s`);
  });
  const startReveals = () => {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    reveals.forEach((el) => {
      // o que já está na tela aparece direto; o resto, ao rolar
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      else revealObserver.observe(el);
    });
  };

  // ---------- Abertura ----------
  const runIntro = () => new Promise((resolve) => {
    const loader = document.getElementById("loader");
    if (!loader || document.documentElement.classList.contains("no-loader")) {
      loader?.remove();
      return resolve();
    }
    const textEl = loader.querySelector("[data-loader-text]");
    const pctEl = loader.querySelector("[data-loader-pct]");
    const bar = loader.querySelector(".loader__bar span");
    const steps = ["iniciando currículo online...", "carregando formação e experiências...", "tudo pronto. bem-vindo!"];
    const duration = 2100;
    let start, step = -1, stepStart = 0, finished = false;

    document.body.classList.add("is-loading");

    const finish = () => {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem("intro-vista", "1"); } catch (e) { /* sem storage */ }
      loader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      setTimeout(resolve, 350); // o site começa a aparecer enquanto a cortina sobe
      setTimeout(() => loader.remove(), 1100);
    };

    const frame = (t) => {
      if (finished) return;
      start ??= t;
      const p = Math.min((t - start) / duration, 1);
      const pct = Math.round((1 - Math.pow(1 - p, 3)) * 100);
      bar.style.setProperty("--p", `${pct}%`);
      pctEl.textContent = `${pct}%`;

      const next = p < 0.38 ? 0 : p < 0.82 ? 1 : 2;
      if (next !== step) { step = next; stepStart = t; }
      textEl.textContent = steps[step].slice(0, Math.floor((t - stepStart) / 22));

      if (p < 1) requestAnimationFrame(frame);
      else setTimeout(finish, 450);
    };
    requestAnimationFrame(frame);
    setTimeout(finish, duration + 1500); // segurança caso a animação seja pausada

    loader.querySelector(".loader__skip").addEventListener("click", finish);
    loader.addEventListener("click", finish);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") finish(); }, { once: true });
  });

  runIntro().then(startReveals);

  // ---------- Foto (se não carregar, mostra as iniciais) ----------
  const photo = document.querySelector(".tile--photo img");
  if (photo) {
    const hide = () => photo.remove();
    if (photo.complete && photo.naturalWidth === 0) hide();
    else photo.addEventListener("error", hide);
  }

  // ---------- Profundidade na foto ----------
  if (photo && !reduceMotion) {
    const parallax = () => {
      if (!photo.isConnected) return;
      const r = photo.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      photo.style.setProperty("--py", `${(r.top * -0.08).toFixed(1)}px`);
    };
    window.addEventListener("scroll", () => requestAnimationFrame(parallax), { passive: true });
    parallax();
  }

  // ---------- Luz que segue o mouse pelos tiles ----------
  document.querySelectorAll(".bento").forEach((grid) => {
    const tiles = grid.querySelectorAll(".tile");
    grid.addEventListener("pointermove", (e) => {
      tiles.forEach((tile) => {
        const r = tile.getBoundingClientRect();
        tile.style.setProperty("--mx", `${e.clientX - r.left}px`);
        tile.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  });

  // ---------- Relógio de Brasília ----------
  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
    const tick = () => {
      const [h, m] = fmt.format(new Date()).split(":");
      const colon = document.createElement("span");
      colon.className = "colon";
      colon.textContent = ":";
      clock.replaceChildren(h, colon, m);
    };
    tick();
    setInterval(tick, 15000);
  }
})();
