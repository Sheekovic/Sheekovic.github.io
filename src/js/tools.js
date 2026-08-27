import { categories, tools } from "./tool-catalog.js";

const list = document.getElementById("tool-list");
const search = document.getElementById("searchInput");
const filters = document.getElementById("tool-filters");
const count = document.getElementById("tool-count");
const empty = document.getElementById("tool-empty");
const limit = Number(list?.dataset.toolLimit || 0);
let activeCategory = "All";

function toolCard(tool) {
  const article = document.createElement("article");
  article.className = "tool-card";
  article.innerHTML = `<div class="tool-card__top"><span class="tool-card__icon" aria-hidden="true"></span><span class="tool-card__category"></span></div><h3></h3><p></p><a><span>Open tool</span><span aria-hidden="true">→</span></a>`;
  article.querySelector(".tool-card__icon").textContent = tool.icon;
  article.querySelector(".tool-card__category").textContent = tool.category;
  article.querySelector("h3").textContent = tool.name;
  article.querySelector("p").textContent = tool.description;
  const link = article.querySelector("a");
  link.href = tool.file;
  link.setAttribute("aria-label", `Open ${tool.name}`);
  return article;
}

function visibleTools() {
  const query = search?.value.trim().toLocaleLowerCase() || "";
  const matches = tools.filter((tool) => {
    const inCategory = activeCategory === "All" || tool.category === activeCategory;
    const haystack = `${tool.name} ${tool.description} ${tool.category}`.toLocaleLowerCase();
    return inCategory && haystack.includes(query);
  });
  return limit > 0 ? matches.slice(0, limit) : matches;
}

function render() {
  if (!list) return;
  const matches = visibleTools();
  list.replaceChildren(...matches.map(toolCard));
  if (count) count.textContent = `${matches.length} ${matches.length === 1 ? "tool" : "tools"}`;
  if (empty) empty.hidden = matches.length > 0;
}

if (filters) {
  for (const category of categories) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;
    button.className = "tool-filter";
    button.setAttribute("aria-pressed", String(category === activeCategory));
    button.addEventListener("click", () => {
      activeCategory = category;
      for (const item of filters.children) item.setAttribute("aria-pressed", String(item === button));
      render();
    });
    filters.append(button);
  }
}

search?.addEventListener("input", render);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && search && document.activeElement !== search) {
    event.preventDefault();
    search.focus();
  }
});

render();
