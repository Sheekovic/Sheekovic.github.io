const root = document.documentElement;
root.classList.remove("no-js");
root.classList.add("js");

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
