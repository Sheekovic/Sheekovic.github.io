function formatJSON() {
            const input = document.getElementById('input').value.trim();
            const output = document.getElementById('output');
            const status = document.getElementById('status');

            if (!input) {
                showStatus('Please enter JSON to format', false);
                return;
            }

            try {
                const parsed = JSON.parse(input);
                const formatted = JSON.stringify(parsed, null, 2);
                output.value = formatted;
                showStatus('✓ Valid JSON - Formatted successfully', true);
            } catch (e) {
                showStatus('✗ Invalid JSON: ' + e.message, false);
                output.value = '';
            }
        }

        function minifyJSON() {
            const input = document.getElementById('input').value.trim();
            const output = document.getElementById('output');
            const status = document.getElementById('status');

            if (!input) {
                showStatus('Please enter JSON to minify', false);
                return;
            }

            try {
                const parsed = JSON.parse(input);
                const minified = JSON.stringify(parsed);
                output.value = minified;
                showStatus('✓ Valid JSON - Minified successfully', true);
            } catch (e) {
                showStatus('✗ Invalid JSON: ' + e.message, false);
                output.value = '';
            }
        }

        function validateJSON() {
            const input = document.getElementById('input').value.trim();
            const status = document.getElementById('status');

            if (!input) {
                showStatus('Please enter JSON to validate', false);
                return;
            }

            try {
                JSON.parse(input);
                showStatus('✓ Valid JSON', true);
            } catch (e) {
                showStatus('✗ Invalid JSON: ' + e.message, false);
            }
        }

        function showStatus(message, isValid) {
            const status = document.getElementById('status');
            status.textContent = message;
            status.className = 'status ' + (isValid ? 'valid' : 'invalid');
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
            document.getElementById('status').className = 'status';
        }
