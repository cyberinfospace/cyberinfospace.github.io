(() => {
  /* ========================================================================
   * 1. Responsive Single-Tree Header & Popover Menu
   * ======================================================================== */
  const header = document.getElementById("site-header");
  const headerInner = document.getElementById("header-inner");
  const menuButton = document.getElementById("menu-button");
  const siteMenu = document.getElementById("site-menu");
  const supportsPopover =
    typeof HTMLElement !== "undefined" &&
    Object.hasOwn(HTMLElement.prototype, "popover");

  let lastCollapsedWidth = 0;

  function setMenuExpanded(isOpen) {
    if (menuButton) {
      menuButton.setAttribute("aria-expanded", String(isOpen));
    }
  }

  function syncNavLayout(forceMeasure = false) {
    if (!header || !headerInner || !siteMenu) return;

    const currentWidth = header.clientWidth;
    const isCurrentlyWide = header.classList.contains("is-wide");

    // Avoid thrashing while collapsed unless width grew or forced
    if (!forceMeasure && !isCurrentlyWide && currentWidth <= lastCollapsedWidth) {
      return;
    }

    const wasOpen = supportsPopover
      ? siteMenu.matches(":popover-open")
      : siteMenu.classList.contains("is-open");

    if (wasOpen && supportsPopover) {
      siteMenu.hidePopover();
    }

    header.classList.add("is-measuring", "is-wide");
    siteMenu.removeAttribute("popover");
    siteMenu.classList.remove("is-open");

    const fitsInline = headerInner.scrollWidth <= headerInner.clientWidth + 1;

    if (fitsInline) {
      header.classList.add("is-wide");
      setMenuExpanded(false);
    } else {
      header.classList.remove("is-wide");
      lastCollapsedWidth = currentWidth;
      if (supportsPopover) {
        siteMenu.setAttribute("popover", "auto");
        if (wasOpen) {
          siteMenu.showPopover();
        }
      }
    }

    requestAnimationFrame(() => {
      header.classList.remove("is-measuring");
    });
  }

  if (header && headerInner && siteMenu && menuButton) {
    syncNavLayout(true);

    if (supportsPopover) {
      siteMenu.addEventListener("toggle", (event) => {
        setMenuExpanded(event.newState === "open");
      });
    } else {
      // Progressive fallback for browsers without Popover API
      siteMenu.removeAttribute("popover");
      menuButton.addEventListener("click", () => {
        const nextOpen = !siteMenu.classList.contains("is-open");
        siteMenu.classList.toggle("is-open", nextOpen);
        setMenuExpanded(nextOpen);
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && siteMenu.classList.contains("is-open")) {
          siteMenu.classList.remove("is-open");
          setMenuExpanded(false);
          menuButton.focus();
        }
      });
    }

    // Close mobile menu when selecting an in-page link
    siteMenu.addEventListener("click", (event) => {
      const link = event.target.closest("a[href^='#']");
      if (!link || header.classList.contains("is-wide")) return;
      if (supportsPopover && siteMenu.matches(":popover-open")) {
        siteMenu.hidePopover();
      } else {
        siteMenu.classList.remove("is-open");
        setMenuExpanded(false);
      }
    });

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => {
        syncNavLayout(false);
      });
      resizeObserver.observe(header);
      resizeObserver.observe(siteMenu);
    } else {
      window.addEventListener("resize", () => syncNavLayout(true));
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => syncNavLayout(true));
    }
  }

  /* ========================================================================
   * 2. Sticky Header Scrolled State & Scrollspy
   * ======================================================================== */
  function updateHeaderScrollState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  updateHeaderScrollState();
  window.addEventListener("scroll", updateHeaderScrollState, { passive: true });

  const navLinks = Array.from(
    document.querySelectorAll('.site-menu a[href^="#"]')
  ).filter((link) => {
    const id = link.getAttribute("href").slice(1);
    return id && id !== "contact" && document.getElementById(id);
  });

  if (navLinks.length > 0) {
    if (CSS.supports("scroll-target-group: auto")) {
      const syncAriaCurrent = () => {
        const current = document.querySelector(".site-menu a:target-current");
        navLinks.forEach((link) => {
          link.setAttribute("aria-current", String(link === current));
        });
      };
      syncAriaCurrent();
      document.addEventListener("scrollend", syncAriaCurrent);
    } else if (typeof IntersectionObserver !== "undefined") {
      const sections = navLinks
        .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
        .filter(Boolean);

      const spyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              const isActive = link.getAttribute("href") === `#${id}`;
              link.classList.toggle("target-current", isActive);
              link.setAttribute("aria-current", String(isActive));
            });
          });
        },
        { rootMargin: "-42% 0px -48% 0px", threshold: 0 }
      );

      sections.forEach((section) => spyObserver.observe(section));
    }
  }

  /* ========================================================================
   * 3. Interactive AI & Agentic Workflow Loop
   * ======================================================================== */
  const workflowStages = {
    observe: {
      tag: "Stage 01 — Observe",
      copy: "Receive structured context, user intent, or system inputs cleanly—grounding the workflow in verified workspace data before taking action.",
    },
    reason: {
      tag: "Stage 02 — Reason",
      copy: "Interpret the task against explicit constraints, evaluate trade-offs, and formulate a transparent, bounded execution plan.",
    },
    act: {
      tag: "Stage 03 — Act",
      copy: "Invoke scoped, least-privilege tools or execute defined software operations with clear human checkpoints where stakes require approval.",
    },
    improve: {
      tag: "Stage 04 — Improve",
      copy: "Verify outputs against acceptance criteria, capture real feedback, and refine reliability across subsequent iterations.",
    },
  };

  const workflowButtons = Array.from(
    document.querySelectorAll(".workflow-node[data-stage]")
  );
  const workflowTagEl = document.getElementById("workflow-step-tag");
  const workflowCopyEl = document.getElementById("workflow-detail-copy");

  workflowButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stageKey = btn.dataset.stage;
      const stage = workflowStages[stageKey];
      if (!stage) return;

      workflowButtons.forEach((node) => {
        node.setAttribute("aria-pressed", String(node === btn));
      });
      if (workflowTagEl) workflowTagEl.textContent = stage.tag;
      if (workflowCopyEl) workflowCopyEl.textContent = stage.copy;
    });
  });

  /* ========================================================================
   * 4. Project Directory & Detail Modal (data/projects.json)
   * ======================================================================== */
  const grid = document.getElementById("project-grid");
  const tagBar = document.getElementById("tag-filters");
  const searchInput = document.getElementById("project-search");
  const statusEl = document.getElementById("results-status");
  const emptyEl = document.getElementById("empty-state");
  const emptyTitleEl = document.getElementById("empty-title");
  const emptyCopyEl = document.getElementById("empty-copy");
  const resetBtn = document.getElementById("reset-filters-btn");

  const projectDialog = document.getElementById("project-dialog");
  const dialogClose = document.getElementById("dialog-close");
  const dialogId = document.getElementById("dialog-id");
  const dialogStatus = document.getElementById("dialog-status");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogSummary = document.getElementById("dialog-summary");
  const dialogDetails = document.getElementById("dialog-details");
  const dialogTags = document.getElementById("dialog-tags");
  const dialogLinks = document.getElementById("dialog-links");

  let allProjects = [];
  let activeTag = "all";

  let previewSeq = 0;

  function buildArchitecturalPreview(project) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 400 250");
    svg.setAttribute("aria-hidden", "true");

    const uid = ++previewSeq;
    const titleLabel = String(project.slug || project.id || "cis-project").toUpperCase();
    const primaryTag = String(
      project.tags && project.tags[0] ? project.tags[0] : "system"
    ).toUpperCase();

    svg.innerHTML = `
      <defs>
        <linearGradient id="pv-bg-${uid}" x1="0" y1="0" x2="400" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#080d22"/>
          <stop offset="100%" stop-color="#141e44"/>
        </linearGradient>
        <radialGradient id="pv-glow-${uid}" cx="78%" cy="22%" r="60%">
          <stop offset="0%" stop-color="#5544f5" stop-opacity="0.48"/>
          <stop offset="100%" stop-color="#5544f5" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="250" fill="url(#pv-bg-${uid})"/>
      <rect width="400" height="250" fill="url(#pv-glow-${uid})"/>
      <ellipse cx="315" cy="65" rx="135" ry="52" transform="rotate(-18 315 65)" stroke="#65ddf4" stroke-opacity="0.22" fill="none"/>
      <rect x="28" y="28" width="344" height="194" rx="12" fill="#0f1733" fill-opacity="0.88" stroke="#94a3d2" stroke-opacity="0.24"/>
      <circle cx="48" cy="46" r="4" fill="#65ddf4" fill-opacity="0.75"/>
      <circle cx="62" cy="46" r="4" fill="#5544f5" fill-opacity="0.85"/>
      <circle cx="76" cy="46" r="4" fill="#94a3d2" fill-opacity="0.45"/>
      <line x1="28" y1="62" x2="372" y2="62" stroke="#94a3d2" stroke-opacity="0.16"/>
      <rect x="46" y="82" width="128" height="12" rx="6" fill="#5544f5" fill-opacity="0.85"/>
      <rect x="46" y="106" width="236" height="10" rx="5" fill="#e2e8f0" fill-opacity="0.75"/>
      <rect x="46" y="124" width="190" height="10" rx="5" fill="#94a3d2" fill-opacity="0.42"/>
      <rect x="46" y="156" width="96" height="44" rx="8" fill="#18254a" stroke="#65ddf4" stroke-opacity="0.28"/>
      <rect x="152" y="156" width="96" height="44" rx="8" fill="#18254a" stroke="#5544f5" stroke-opacity="0.35"/>
      <rect x="258" y="156" width="96" height="44" rx="8" fill="#18254a" stroke="#94a3d2" stroke-opacity="0.22"/>
    `;

    const tagText = document.createElementNS(svgNS, "text");
    tagText.setAttribute("x", "354");
    tagText.setAttribute("y", "50");
    tagText.setAttribute("text-anchor", "end");
    tagText.setAttribute("fill", "#b7c3e0");
    tagText.setAttribute("font-family", "ui-monospace, Menlo, monospace");
    tagText.setAttribute("font-size", "10");
    tagText.setAttribute("letter-spacing", "1");
    tagText.textContent = primaryTag;

    const slugText = document.createElementNS(svgNS, "text");
    slugText.setAttribute("x", "58");
    slugText.setAttribute("y", "182");
    slugText.setAttribute("fill", "#65ddf4");
    slugText.setAttribute("font-family", "ui-monospace, Menlo, monospace");
    slugText.setAttribute("font-size", "11");
    slugText.setAttribute("font-weight", "700");
    slugText.textContent = titleLabel;

    svg.append(tagText, slugText);
    return svg;
  }

  function createProjectLink(href, label) {
    const a = document.createElement("a");
    a.href = href;
    a.rel = "noopener noreferrer";
    a.textContent = label;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "14");
    svg.setAttribute("height", "14");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#icon-arrow-up-right");
    svg.appendChild(use);
    a.appendChild(svg);
    return a;
  }

  function openProjectDialog(project) {
    if (!projectDialog) return;

    const statusValue = (project.status || "open source").toLowerCase();
    dialogId.textContent = project.id || project.slug || "CIS";
    dialogStatus.textContent = project.status || "Open Source";
    dialogStatus.dataset.status = statusValue;
    dialogTitle.textContent = project.name;
    dialogSummary.textContent = project.summary || project.short_description || "";

    const detailItems = [];
    if (project.repo) {
      detailItems.push({ label: "Repository", value: project.repo });
    }
    if (project.category) {
      detailItems.push({ label: "Category", value: project.category });
    }
    if (Array.isArray(project.platforms) && project.platforms.length > 0) {
      detailItems.push({ label: "Platforms", value: project.platforms.join(", ") });
    }
    if (project.problem) {
      detailItems.push({ label: "Problem", value: project.problem });
    }
    if (project.solution) {
      detailItems.push({ label: "Solution", value: project.solution });
    }

    dialogDetails.replaceChildren();
    if (detailItems.length > 0) {
      detailItems.forEach((item) => {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${item.label}: `;
        p.append(strong, document.createTextNode(item.value));
        dialogDetails.appendChild(p);
      });
      dialogDetails.hidden = false;
    } else {
      dialogDetails.hidden = true;
    }

    const tags = Array.from(
      new Set([...(project.tags || []), ...(project.technologies || [])])
    );
    dialogTags.replaceChildren(
      ...tags.map((tag) => {
        const li = document.createElement("li");
        li.textContent = tag;
        return li;
      })
    );

    dialogLinks.replaceChildren();
    const repoUrl = project.repo_url || project.repository_url;
    const liveUrl = project.url || project.live_url;

    if (liveUrl && liveUrl !== repoUrl) {
      const liveBtn = document.createElement("a");
      liveBtn.className = "btn btn-primary";
      liveBtn.href = liveUrl;
      liveBtn.rel = "noopener noreferrer";
      liveBtn.textContent = "Open Live Portal";
      dialogLinks.appendChild(liveBtn);
    }

    if (repoUrl) {
      const repoBtn = document.createElement("a");
      repoBtn.className = "btn btn-secondary";
      repoBtn.href = repoUrl;
      repoBtn.rel = "noopener noreferrer";
      repoBtn.textContent = "View Source on GitHub";
      dialogLinks.appendChild(repoBtn);
    }

    if (typeof projectDialog.showModal === "function") {
      projectDialog.showModal();
    }
  }

  function createProjectCard(project) {
    const li = document.createElement("li");
    li.className = "project-card";

    // Row 1: Visual preview
    const preview = document.createElement("div");
    preview.className = "project-preview";
    if (project.thumbnail) {
      const img = document.createElement("img");
      img.src = project.thumbnail;
      img.alt = `${project.name} preview`;
      img.loading = "lazy";
      preview.appendChild(img);
    } else {
      preview.appendChild(buildArchitecturalPreview(project));
    }

    // Row 2: Metadata
    const metaRow = document.createElement("div");
    metaRow.className = "project-meta-row";

    const idSpan = document.createElement("span");
    idSpan.className = "project-id";
    idSpan.textContent = project.id || project.slug || "";

    const statusSpan = document.createElement("span");
    statusSpan.className = "status-badge";
    const statusText = project.status || "Open Source";
    statusSpan.textContent = statusText;
    statusSpan.dataset.status = statusText.toLowerCase();

    metaRow.append(idSpan, statusSpan);

    // Row 3: Body (title, summary, tags)
    const body = document.createElement("div");
    body.className = "project-body";

    const title = document.createElement("h3");
    title.textContent = project.name;

    const summary = document.createElement("p");
    summary.className = "project-summary";
    summary.textContent = project.summary || project.short_description || "";

    const tagList = document.createElement("ul");
    tagList.className = "card-tags";
    (project.tags || []).forEach((tag) => {
      const tagItem = document.createElement("li");
      tagItem.textContent = tag;
      tagList.appendChild(tagItem);
    });

    body.append(title, summary, tagList);

    // Row 4: Footer links + details trigger
    const footer = document.createElement("div");
    footer.className = "card-footer";

    const links = document.createElement("div");
    links.className = "card-links";

    const repoUrl = project.repo_url || project.repository_url;
    const liveUrl = project.url || project.live_url;

    if (repoUrl) {
      links.appendChild(createProjectLink(repoUrl, "Repository"));
    }
    if (liveUrl && liveUrl !== repoUrl) {
      links.appendChild(createProjectLink(liveUrl, "Live Portal"));
    }

    const inspectBtn = document.createElement("button");
    inspectBtn.type = "button";
    inspectBtn.className = "inspect-btn";
    inspectBtn.textContent = "Inspect details";
    inspectBtn.setAttribute("aria-label", `Inspect details for ${project.name}`);
    inspectBtn.addEventListener("click", () => openProjectDialog(project));

    footer.append(links, inspectBtn);
    li.append(preview, metaRow, body, footer);
    return li;
  }

  function buildTagFilters(projects) {
    if (!tagBar) return;
    const tags = new Set();
    projects.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));

    Array.from(tags)
      .sort()
      .forEach((tag) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tag-btn";
        btn.dataset.tag = tag;
        btn.setAttribute("aria-pressed", "false");
        btn.textContent = tag;
        tagBar.appendChild(btn);
      });
  }

  function setActiveTagButton(targetTag) {
    if (!tagBar) return;
    activeTag = targetTag;
    tagBar.querySelectorAll("button[data-tag]").forEach((el) => {
      el.setAttribute("aria-pressed", String(el.dataset.tag === targetTag));
    });
  }

  function renderProjects() {
    if (!grid || !statusEl || !emptyEl) return;

    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const filtered = allProjects.filter((p) => {
      const tags = p.tags || [];
      const matchesTag = activeTag === "all" || tags.includes(activeTag);
      if (!matchesTag) return false;
      if (!query) return true;
      const haystack = [
        p.id,
        p.slug,
        p.name,
        p.summary,
        p.short_description,
        p.category,
        ...tags,
        ...(p.technologies || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });

    grid.setAttribute("aria-busy", "false");
    grid.replaceChildren(...filtered.map(createProjectCard));

    const hasResults = filtered.length > 0;
    emptyEl.hidden = hasResults;
    if (!hasResults) {
      if (emptyTitleEl) {
        emptyTitleEl.textContent =
          allProjects.length === 0
            ? "No public projects configured yet."
            : "No matching public projects found.";
      }
      if (emptyCopyEl) {
        emptyCopyEl.textContent =
          allProjects.length === 0
            ? "Visit the official Cyber Info Space GitHub organisation to browse repositories."
            : "Try clearing your search query or selecting a different tag filter.";
      }
    }

    statusEl.textContent = `Showing ${filtered.length} of ${allProjects.length} public project${
      allProjects.length === 1 ? "" : "s"
    }`;
  }

  if (tagBar) {
    tagBar.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-tag]");
      if (!btn) return;
      setActiveTagButton(btn.dataset.tag);
      renderProjects();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderProjects);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      setActiveTagButton("all");
      renderProjects();
      if (searchInput) searchInput.focus();
    });
  }

  // Capability cards with tag shortcuts filter cleanly when clicked
  document.querySelectorAll("[data-filter-shortcut]").forEach((card) => {
    card.addEventListener("click", () => {
      const desiredTag = card.dataset.filterShortcut;
      const matchingBtn = tagBar?.querySelector(
        `button[data-tag="${CSS.escape(desiredTag)}"]`
      );
      if (matchingBtn) {
        setActiveTagButton(desiredTag);
        renderProjects();
      }
    });
  });

  if (projectDialog) {
    dialogClose?.addEventListener("click", () => projectDialog.close());
    projectDialog.addEventListener("click", (event) => {
      if (event.target === projectDialog) {
        projectDialog.close();
      }
    });
  }

  if (grid) {
    fetch("data/projects.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        allProjects = Array.isArray(data.projects) ? data.projects : [];
        buildTagFilters(allProjects);
        renderProjects();
      })
      .catch(() => {
        grid.setAttribute("aria-busy", "false");
        grid.replaceChildren();
        if (statusEl) {
          statusEl.textContent = "Unable to load project catalog right now.";
        }
        if (emptyTitleEl) {
          emptyTitleEl.textContent = "Project catalog temporarily unavailable.";
        }
        if (emptyCopyEl) {
          emptyCopyEl.textContent =
            "You can still explore all public Cyber Info Space repositories directly on GitHub.";
        }
        if (emptyEl) emptyEl.hidden = false;
      });
  }

  /* ========================================================================
   * 5. Collaboration Brief Helper & Dynamic Year
   * ======================================================================== */
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const copyBriefBtn = document.getElementById("copy-brief-btn");
  const copyStatusEl = document.getElementById("copy-status");
  if (copyBriefBtn && copyStatusEl) {
    const briefTemplate = [
      "Project Inquiry — Cyber Info Space",
      "Name / Organisation:",
      "Surface (Mobile / Web / Desktop / AI / Open Source):",
      "Problem & Desired Outcome:",
      "Timeline or Constraints:",
    ].join("\n");

    copyBriefBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(briefTemplate);
        copyStatusEl.textContent =
          "Project brief template copied to clipboard. Share it via cyberinfospace.com.";
      } catch {
        copyStatusEl.textContent =
          "Clipboard access unavailable — connect directly via cyberinfospace.com or GitHub.";
      }
    });
  }
})();
