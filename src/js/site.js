const root = document.documentElement;
const themeKey = "sheekovic-theme";
const menuButton = document.querySelector(".site-menu-button");
const navigation = document.getElementById("site-navigation");
const themeButton = document.getElementById("site-theme-toggle");
const themeLabel = themeButton?.querySelector(".site-theme-label");

root.classList.remove("no-js");
root.classList.add("js");

function preferredTheme() {
  const saved = localStorage.getItem(themeKey);
  if (["light", "dark"].includes(saved)) return saved;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function setTheme(theme) {
  root.dataset.theme = theme;
  if (themeLabel) themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
  themeButton?.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
}

setTheme(preferredTheme());
themeButton?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(themeKey, next);
  setTheme(next);
});

menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  navigation?.toggleAttribute("data-open", !expanded);
});

navigation?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation.removeAttribute("data-open");
  }
});

const main = document.querySelector("main, [role='main'], #main, #banner") || document.body;
if (!main.id) main.id = "main-content";
if (main !== document.body && !document.querySelector(".site-skip-link")) {
  const skipLink = document.createElement("a");
  skipLink.className = "site-skip-link";
  skipLink.href = `#${main.id}`;
  skipLink.textContent = "Skip to content";
  document.body.prepend(skipLink);
}

for (const link of document.querySelectorAll('a[target="_blank"]')) {
  const rel = new Set((link.rel || "").split(/\s+/).filter(Boolean));
  rel.add("noopener");
  rel.add("noreferrer");
  link.rel = [...rel].join(" ");
}
