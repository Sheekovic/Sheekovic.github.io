function testRegex() {
            const regexInput = document.getElementById('regex').value;
            const testString = document.getElementById('testString').value;
            const results = document.getElementById('results');

            if (!regexInput) {
                showMessage(results, 'error', 'Please enter a regular expression');
                return;
            }

            try {
                // Build flags
                let flags = '';
                if (document.getElementById('flag-g').checked) flags += 'g';
                if (document.getElementById('flag-i').checked) flags += 'i';
                if (document.getElementById('flag-m').checked) flags += 'm';
                if (document.getElementById('flag-s').checked) flags += 's';

                const regex = new RegExp(regexInput, flags);
                const matches = [...testString.matchAll(regex)];

                if (matches.length === 0) {
                    const matchInfo = document.createElement('div');
                    matchInfo.className = 'match-info';

                    const matchCount = document.createElement('div');
                    matchCount.className = 'match-count';
                    matchCount.textContent = 'No matches found';

                    matchInfo.append(matchCount);
                    results.replaceChildren(matchInfo);
                    return;
                }

                const matchInfo = document.createElement('div');
                matchInfo.className = 'match-info';

                const matchCount = document.createElement('div');
                matchCount.className = 'match-count';
                matchCount.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''} found`;
                matchInfo.append(matchCount);

                matches.forEach((match) => {
                    const item = document.createElement('div');
                    item.className = 'match-item';

                    const text = document.createElement('div');
                    text.className = 'match-text';
                    text.textContent = `"${match[0]}"`;

                    const position = document.createElement('div');
                    position.className = 'match-position';
                    position.textContent = `Position: ${match.index} - ${match.index + match[0].length - 1}`;

                    item.append(text, position);

                    if (match.length > 1) {
                        const groups = document.createElement('div');
                        groups.className = 'match-position';
                        groups.textContent = 'Groups: ' + match.slice(1)
                            .map((group, index) => `${index + 1}: "${group}"`)
                            .join(', ');
                        item.append(groups);
                    }

                    matchInfo.append(item);
                });

                const highlightedText = document.createElement('div');
                highlightedText.className = 'highlighted-text';
                appendHighlightedText(highlightedText, testString, matches);

                results.replaceChildren(matchInfo, highlightedText);

            } catch (e) {
                showMessage(results, 'error', `Invalid RegEx: ${e.message}`);
            }
        }

        function appendHighlightedText(container, text, matches) {
            let lastIndex = 0;

            matches.forEach(match => {
                container.append(document.createTextNode(text.substring(lastIndex, match.index)));

                const highlight = document.createElement('span');
                highlight.className = 'highlight';
                highlight.textContent = match[0];
                container.append(highlight);

                lastIndex = match.index + match[0].length;
            });

            container.append(document.createTextNode(text.substring(lastIndex)));
        }

        function showMessage(container, className, message) {
            const element = document.createElement('div');
            element.className = className;
            element.textContent = message;
            container.replaceChildren(element);
        }

        // Add input listener to test string
        document.getElementById('testString').addEventListener('input', testRegex);

        // Initial test
        document.getElementById('regex').value = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b';
        testRegex();
