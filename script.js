document.addEventListener("DOMContentLoaded", () => {
    const defaultSnippets = [
        {
            id: 1,
            title: "Fetch API Example",
            category: "api · async",
            language: "javascript",
            description: "Fetch JSON from an endpoint with basic error handling.",
            code: "const fetchData = async (url) => {\n    try {\n        const response = await fetch(url);\n        return await response.json();\n    } catch (error) {\n        console.error(error);\n        return null;\n    }\n};",
            updated: "Oct 11",
            timestamp: 1697000000000,
            favourite: true
        },
        {
            id: 2,
            title: "HTML5 Boilerplate",
            category: "frontend · template",
            language: "html",
            description: "A clean starting point for your next web project.",
            code: "<!DOCTYPE html>\n<html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <title>My App</title>\n    </head>\n</html>",
            updated: "Oct 11",
            timestamp: 1697000001000,
            favourite: false
        },
        {
            id: 3,
            title: "Perfect Flexbox Center",
            category: "frontend · layout",
            language: "css",
            description: "Center anything horizontally and vertically.",
            code: ".center {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    min-height: 100vh;\n}",
            updated: "Oct 9",
            timestamp: 1696800000000,
            favourite: true
        },
        {
            id: 4,
            title: "List Comprehension",
            category: "python · utility",
            language: "python",
            description: "Create a list of squared numbers in one line.",
            code: "squares = [\n    x ** 2\n    for x in range(10)\n]\n\nprint(squares)",
            updated: "Oct 8",
            timestamp: 1696700000000,
            favourite: false
        },
        {
            id: 5,
            title: "Data Frame Summary",
            category: "r · stats",
            language: "r",
            description: "Compute summary statistics grouped by a categorical variable.",
            code: "library(dplyr)\n\nsummary_stats <- mtcars %>%\n    group_by(cyl) %>%\n    summarise(\n        mean_mpg = mean(mpg),\n        n = n()\n)\n\nprint(summary_stats)",
            updated: "Oct 7",
            timestamp: 1696650000000,
            favourite: true
        },
        {
            id: 6,
            title: "Remove Duplicates",
            category: "javascript · utility",
            language: "javascript",
            description: "Return a new array containing unique values.",
            code: "const unique = (items) => {\n    return [...new Set(items)];\n};\n\nunique([1, 2, 2, 3]);",
            updated: "Oct 7",
            timestamp: 1696600000000,
            favourite: false
        },
        {
            id: 7,
            title: "Clear Terminal",
            category: "terminal · devops",
            language: "other",
            description: "Clear the terminal screen on common operating systems.",
            code: "# Linux / macOS\nclear\n\n# Windows\ncls",
            updated: "Oct 6",
            timestamp: 1696500000000,
            favourite: false
        }
    ];

    let snippets = JSON.parse(localStorage.getItem("devvault_snippets")) || defaultSnippets;
    let currentView = "all";
    let currentLanguageFilter = "all";
    let searchQuery = "";
    let currentSort = "Recently added";

    const grid = document.querySelector(".snippet-grid");
    const searchInput = document.querySelector(".search input");
    const sortSelect = document.querySelector(".section-heading select");
    const newSnippetButtons = document.querySelectorAll(".new-snippet");
    const navItems = document.querySelectorAll(".sidebar .nav-item");
    const filterButtons = document.querySelectorAll(".filters .filter");
    const sectionTitle = document.getElementById("section-title");

    const countAll = document.getElementById("count-all");
    const countFav = document.getElementById("count-fav");
    const countRecent = document.getElementById("count-recent");
    const countJs = document.getElementById("count-js");
    const countHtml = document.getElementById("count-html");
    const countCss = document.getElementById("count-css");
    const countPython = document.getElementById("count-python");
    const countR = document.getElementById("count-r");
    const countOther = document.getElementById("count-other");

    const statTotal = document.getElementById("stat-total");
    const statFavourites = document.getElementById("stat-favourites");
    const filterCountAll = document.getElementById("filter-count-all");

    const saveSnippets = () => {
        localStorage.setItem("devvault_snippets", JSON.stringify(snippets));
        updateStats();
    };

    const updateStats = () => {
        const total = snippets.length;
        const favs = snippets.filter(s => s.favourite).length;
        const recentCount = snippets.filter(s => {
            return (Date.now() - (s.timestamp || 0)) < 7 * 24 * 60 * 60 * 1000;
        }).length;

        const jsCount = snippets.filter(s => s.language === "javascript").length;
        const htmlCount = snippets.filter(s => s.language === "html").length;
        const cssCount = snippets.filter(s => s.language === "css").length;
        const pyCount = snippets.filter(s => s.language === "python").length;
        const rCount = snippets.filter(s => s.language === "r").length;
        const otherCount = snippets.filter(s => s.language === "other").length;

        if (countAll) countAll.textContent = total;
        if (countFav) countFav.textContent = favs;
        if (countRecent) countRecent.textContent = recentCount;
        if (countJs) countJs.textContent = jsCount;
        if (countHtml) countHtml.textContent = htmlCount;
        if (countCss) countCss.textContent = cssCount;
        if (countPython) countPython.textContent = pyCount;
        if (countR) countR.textContent = rCount;
        if (countOther) countOther.textContent = otherCount;

        if (statTotal) statTotal.textContent = total;
        if (statFavourites) statFavourites.textContent = favs;
        if (filterCountAll) filterCountAll.textContent = total;
    };

    const render = () => {
        updateStats();

        let filtered = snippets.filter(snippet => {
            const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                snippet.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
                snippet.category.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (currentView === "favourites") {
                return snippet.favourite;
            } else if (currentView === "recent") {
                return (Date.now() - (snippet.timestamp || 0)) < 7 * 24 * 60 * 60 * 1000;
            } else if (currentView === "language") {
                if (currentLanguageFilter !== "all") {
                    return snippet.language === currentLanguageFilter;
                }
            }

            if (currentLanguageFilter !== "all") {
                return snippet.language === currentLanguageFilter;
            }

            return true;
        });

        if (currentSort === "Recently added") {
            filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        } else if (currentSort === "Name A–Z") {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (currentSort === "Language") {
            filtered.sort((a, b) => a.language.localeCompare(b.language));
        }

        grid.innerHTML = "";

        if (filtered.length === 0) {
            grid.innerHTML = "<p class=\"subtitle\" style=\"grid-column: 1 / -1; text-align: center; padding: 40px;\">No snippets found in this view.</p>";
            return;
        }

        filtered.forEach(snippet => {
            const card = document.createElement("article");
            card.className = "snippet-card";

            let langClass = "js-icon";
            let langText = "JS";
            if (snippet.language === "html") {
                langClass = "html-icon";
                langText = "HTML";
            } else if (snippet.language === "css") {
                langClass = "css-icon";
                langText = "CSS";
            } else if (snippet.language === "python") {
                langClass = "python-icon";
                langText = "PY";
            } else if (snippet.language === "r") {
                langClass = "r-icon";
                langText = "R";
            } else if (snippet.language === "other") {
                langClass = "terminal-icon";
                langText = "CLI";
            }

            card.innerHTML = `
                <div class="card-heading">
                    <span class="language-icon ${langClass}">${langText}</span>
                    <div class="card-title"><h3>${snippet.title}</h3><p>${snippet.category}</p></div>
                    <div style="position: relative;">
                        <button class="more" aria-label="More options" data-id="${snippet.id}">···</button>
                        <div class="snippet-menu" data-menu-id="${snippet.id}" style="display: none; position: absolute; right: 0; top: 25px; background: var(--panel-light); border: 1px solid var(--border); border-radius: 8px; padding: 5px; z-index: 10; box-shadow: 0 5px 15px rgba(0,0,0,0.3); min-width: 100px;">
                            <button class="menu-edit" data-id="${snippet.id}" style="display: block; width: 100%; text-align: left; background: none; border: none; padding: 6px 10px; font-size: 10px; color: var(--text); border-radius: 4px; cursor: pointer;">Edit</button>
                            <button class="menu-rewrite" data-id="${snippet.id}" style="display: block; width: 100%; text-align: left; background: none; border: none; padding: 6px 10px; font-size: 10px; color: var(--text); border-radius: 4px; cursor: pointer;">Re-write with AI</button>
                            <button class="menu-delete" data-id="${snippet.id}" style="display: block; width: 100%; text-align: left; background: none; border: none; padding: 6px 10px; font-size: 10px; color: #ff755b; border-radius: 4px; cursor: pointer;">Delete</button>
                        </div>
                    </div>
                </div>
                <p class="description">${snippet.description}</p>
                <pre><code class="language-${snippet.language}">${snippet.code}</code></pre>
                <div class="card-footer">
                    <span>Updated ${snippet.updated}</span>
                    <div>
                        <button class="icon-action favourite ${snippet.favourite ? "active" : ""}" data-id="${snippet.id}">☆</button>
                        <button class="icon-action copy" data-code="${encodeURIComponent(snippet.code)}">▢</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        document.querySelectorAll("pre code").forEach(el => {
            Prism.highlightElement(el);
        });
    };

    grid.addEventListener("click", async (e) => {
        if (e.target.closest(".icon-action.favourite")) {
            const btn = e.target.closest(".icon-action.favourite");
            const id = parseInt(btn.getAttribute("data-id"));
            const snippet = snippets.find(s => s.id === id);
            if (snippet) {
                snippet.favourite = !snippet.favourite;
                saveSnippets();
                render();
            }
        }

        if (e.target.closest(".icon-action.copy")) {
            const btn = e.target.closest(".icon-action.copy");
            const code = decodeURIComponent(btn.getAttribute("data-code"));
            navigator.clipboard.writeText(code);
            btn.textContent = "✓";
            setTimeout(() => {
                btn.textContent = "▢";
            }, 1500);
        }

        if (e.target.closest(".more")) {
            e.stopPropagation();
            const btn = e.target.closest(".more");
            const id = btn.getAttribute("data-id");
            document.querySelectorAll(".snippet-menu").forEach(menu => {
                if (menu.getAttribute("data-menu-id") !== id) {
                    menu.style.display = "none";
                }
            });
            const menu = document.querySelector(`.snippet-menu[data-menu-id="${id}"]`);
            if (menu) {
                menu.style.display = menu.style.display === "block" ? "none" : "block";
            }
        }

        if (e.target.closest(".menu-delete")) {
            const btn = e.target.closest(".menu-delete");
            const id = parseInt(btn.getAttribute("data-id"));
            if (confirm("Are you sure you want to delete this snippet?")) {
                snippets = snippets.filter(s => s.id !== id);
                saveSnippets();
                render();
            }
        }

        if (e.target.closest(".menu-edit")) {
            const btn = e.target.closest(".menu-edit");
            const id = parseInt(btn.getAttribute("data-id"));
            const snippet = snippets.find(s => s.id === id);
            if (snippet) {
                const newTitle = prompt("Edit Title:", snippet.title);
                if (newTitle === null) return;
                const newDesc = prompt("Edit Description:", snippet.description);
                if (newDesc === null) return;
                const newCode = prompt("Edit Code:", snippet.code);
                if (newCode === null) return;

                snippet.title = newTitle || snippet.title;
                snippet.description = newDesc || snippet.description;
                snippet.code = newCode || snippet.code;
                snippet.updated = "Today";
                snippet.timestamp = Date.now();

                saveSnippets();
                render();
            }
        }

        if (e.target.closest(".menu-rewrite")) {
            const btn = e.target.closest(".menu-rewrite");
            const id = parseInt(btn.getAttribute("data-id"), 10);
            const snippet = snippets.find((s) => s.id === id);
            if (!snippet) return;

            try {
                const formData = new FormData();
                formData.append("type", "chat");
                formData.append("prompt", snippet.code);
                formData.append(
                    "system",
                    `You are a code optimizer. Return your response in STRICT valid JSON format with double quotes around keys and string values, like this:
{
    "exp": "Explanation of changes",
    "code": "The rewritten code here"
}
Do not use single quotes for keys or unescaped newlines in the JSON string.

Small improvements are preferred. If the code is already optimal, only then change it more significantly.

Re-write the following code snippet in a more efficient and optimized way:
` + snippet.code
                );
                formData.append("model", "gemini-2.5-flash");
                formData.append("userTier", "loyal");

                const res = await fetch("https://lumen-production-2ee7.up.railway.app/ask", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error("Network response was not ok");

                const responseData = await res.json();
                let rawContent =
                    responseData.response ||
                    responseData.reply ||
                    responseData.choices?.[0]?.message?.content ||
                    responseData.output_text ||
                    "";

                rawContent = rawContent.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, "$1").trim();

                let rewriteExplanation = "";
                try {
                    const parsed = JSON.parse(rawContent);
                    if (parsed && typeof parsed === "object") {
                        snippet.code = parsed.code || snippet.code;
                        rewriteExplanation = parsed.exp || "";
                    }
                } catch (err) {
                    console.warn("JSON parse failed, trying regex extraction:", err);
                    
                    const codeMatch = rawContent.match(/"code"\s*:\s*"([\s\S]*?)"/);
                    const expMatch = rawContent.match(/"exp"\s*:\s*"([\s\S]*?)"/);
                    
                    if (codeMatch && codeMatch[1]) {
                        snippet.code = codeMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
                    } else {
                        snippet.code = rawContent;
                    }
                    
                    if (expMatch && expMatch[1]) {
                        rewriteExplanation = expMatch[1];
                    }
                }

                Swal.fire({
                    title: "Rewrite Successful",
                    text: rewriteExplanation || "Your snippet has been rewritten.",
                    icon: "success"
                });
                saveSnippets();
                render();
            } catch (err) {
                console.error("Failed to rewrite snippet:", err);
            }
        }
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".snippet-menu").forEach(menu => {
            menu.style.display = "none";
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            render();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            render();
        });
    }

    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");

            const view = item.getAttribute("data-view");
            const lang = item.getAttribute("data-language");

            if (view) {
                currentView = view;
                currentLanguageFilter = "all";
                filterButtons.forEach(fb => {
                    fb.classList.remove("active");
                    if (fb.getAttribute("data-filter") === "all") {
                        fb.classList.add("active");
                    }
                });
                if (view === "overview" || view === "snippets") {
                    sectionTitle.textContent = "Your snippets";
                } else if (view === "favourites") {
                    sectionTitle.textContent = "Favourite snippets";
                } else if (view === "recent") {
                    sectionTitle.textContent = "Recently added snippets";
                }
            } else if (lang) {
                currentView = "language";
                currentLanguageFilter = lang;
                sectionTitle.textContent = `${lang.charAt(0).toUpperCase() + lang.slice(1)} snippets`;
                filterButtons.forEach(fb => {
                    fb.classList.remove("active");
                    if (fb.getAttribute("data-filter") === lang) {
                        fb.classList.add("active");
                    }
                });
            }
            render();
        });
    });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            const filter = e.currentTarget.getAttribute("data-filter");
            currentLanguageFilter = filter;
            if (filter === "all") {
                currentView = "all";
                sectionTitle.textContent = "Your snippets";
            } else {
                currentView = "language";
                sectionTitle.textContent = `${filter.charAt(0).toUpperCase() + filter.slice(1)} snippets`;
            }
            render();
        });
    });

    newSnippetButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const title = prompt("Snippet Title:");
            if (!title) return;
            const language = prompt("Language (javascript, html, css, python, r, other):", "javascript").toLowerCase();
            const description = prompt("Description:");
            const code = prompt("Code content:");

            const validLang = ["javascript", "html", "css", "python", "r", "other"].includes(language) ? language : "other";

            const newSnippet = {
                id: Date.now(),
                title: title,
                category: `${validLang} · custom`,
                language: validLang,
                description: description || "",
                code: code || "",
                updated: "Today",
                timestamp: Date.now(),
                favourite: false
            };

            snippets.unshift(newSnippet);
            saveSnippets();
            render();
        });
    });

    render();
});

document.body.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); 
        document.getElementById("search-input")?.focus();
    }
});

document.querySelector(".profile")?.addEventListener("click", () => { alert("how do you not understand how to use this app?! ru mad bro?") });
