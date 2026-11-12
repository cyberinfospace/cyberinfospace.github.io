(() => {
  const grid = document.getElementById("project-grid");
  const tagBar = document.getElementById("tag-filters");
  const searchInput = document.getElementById("project-search");
  const statusEl = document.getElementById("results-status");
  const emptyEl = document.getElementById("empty-state");

  let allProjects = [];
  let activeTag = "all";

  function buildTagFilters(projects) {
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

  function createProjectCard(project) {
    const li = document.createElement("li");
    li.className = "project-card";

    const body = document.createElement("div");

    const top = document.createElement("div");
    top.className = "card-top";

    const idSpan = document.createElement("span");
    idSpan.className = "project-id";
    idSpan.textContent = project.id;

    const statusSpan = document.createElement("span");
    statusSpan.className = "status-badge";
    statusSpan.textContent = project.status;

    top.append(idSpan, statusSpan);

    const title = document.createElement("h3");
    title.textContent = project.name;

    const summary = document.createElement("p");
    summary.className = "project-summary";
    summary.textContent = project.summary;

    const tagList = document.createElement("ul");
    tagList.className = "card-tags";
    (project.tags || []).forEach((tag) => {
      const tagItem = document.createElement("li");
      tagItem.textContent = tag;
      tagList.appendChild(tagItem);
    });

    body.append(top, title, summary, tagList);

    const links = document.createElement("div");
    links.className = "card-links";

    const repoLink = document.createElement("a");
    repoLink.href = project.repo_url;
    repoLink.rel = "noopener noreferrer";
    repoLink.textContent = `Repository (${project.name})`;
    links.appendChild(repoLink);

    if (project.url && project.url !== project.repo_url) {
      const siteLink = document.createElement("a");
      siteLink.href = project.url;
      siteLink.rel = "noopener noreferrer";
      siteLink.textContent = `Live Portal (${project.name})`;
      links.appendChild(siteLink);
    }

    li.append(body, links);
    return li;
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = allProjects.filter((p) => {
      const matchesTag = activeTag === "all" || (p.tags || []).includes(activeTag);
      if (!matchesTag) return false;
      if (!query) return true;
      const haystack = [p.id, p.name, p.summary, ...(p.tags || [])].join(" ").toLowerCase();
      return haystack.includes(query);
    });

    grid.replaceChildren(...filtered.map(createProjectCard));
    emptyEl.hidden = filtered.length > 0;
    statusEl.textContent = `Showing ${filtered.length} of ${allProjects.length} public project(s)`;
  }

  tagBar.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-tag]");
    if (!btn) return;
    activeTag = btn.dataset.tag;
    tagBar.querySelectorAll("button[data-tag]").forEach((el) => {
      el.setAttribute("aria-pressed", String(el === btn));
    });
    render();
  });

  searchInput.addEventListener("input", render);

  fetch("data/projects.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      allProjects = Array.isArray(data.projects) ? data.projects : [];
      buildTagFilters(allProjects);
      render();
    })
    .catch(() => {
      statusEl.textContent = "Unable to load project catalog right now.";
      emptyEl.hidden = false;
    });
})();
