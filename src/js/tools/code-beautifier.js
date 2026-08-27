let currentLang = 'javascript';

        function switchLang(lang) {
            currentLang = lang;
            document.querySelectorAll('.lang-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelector(`.lang-tab[data-language="${lang}"]`)?.classList.add('active');

            // Set example code
            const examples = {
                javascript: 'function hello(){console.log("Hello World");return true;}',
                html: '<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Hello</h1></body></html>',
                css: 'body{margin:0;padding:0;font-family:Arial,sans-serif;}h1{color:#333;font-size:2em;}',
                json: '{"name":"John","age":30,"city":"New York","hobbies":["reading","coding"]}'
            };

            document.getElementById('input').value = examples[lang];
            document.getElementById('output').value = '';
        }

        function beautify() {
            const input = document.getElementById('input').value;
            const output = document.getElementById('output');

            if (!input.trim()) {
                alert('Please enter code to beautify');
                return;
            }

            try {
                let beautified;
                const options = {
                    indent_size: 2,
                    space_in_empty_paren: true
                };

                switch(currentLang) {
                    case 'javascript':
                        beautified = js_beautify(input, options);
                        break;
                    case 'html':
                        beautified = html_beautify(input, options);
                        break;
                    case 'css':
                        beautified = css_beautify(input, options);
                        break;
                    case 'json':
                        const parsed = JSON.parse(input);
                        beautified = JSON.stringify(parsed, null, 2);
                        break;
                }

                output.value = beautified;
            } catch (e) {
                alert('Error beautifying code: ' + e.message);
            }
        }

        function minify() {
            const input = document.getElementById('input').value;
            const output = document.getElementById('output');

            if (!input.trim()) {
                alert('Please enter code to minify');
                return;
            }

            try {
                let minified;

                switch(currentLang) {
                    case 'javascript':
                    case 'css':
                        // Simple minification (remove extra whitespace)
                        minified = input.replace(/\s+/g, ' ').trim();
                        break;
                    case 'html':
                        minified = input.replace(/>\s+</g, '><').trim();
                        break;
                    case 'json':
                        const parsed = JSON.parse(input);
                        minified = JSON.stringify(parsed);
                        break;
                }

                output.value = minified;
            } catch (e) {
                alert('Error minifying code: ' + e.message);
            }
        }

        function copyOutput() {
            const output = document.getElementById('output');
            if (!output.value) {
                alert('No output to copy');
                return;
            }
            output.select();
            document.execCommand('copy');
            alert('Copied to clipboard!');
        }

        function clearAll() {
            document.getElementById('input').value = '';
            document.getElementById('output').value = '';
        }

        // Set initial example
        switchLang('javascript');
