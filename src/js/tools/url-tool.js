function encodeURL() {
            const input = document.getElementById('input').value;
            if (!input) {
                alert('Please enter text to encode');
                return;
            }
            try {
                document.getElementById('output').value = encodeURI(input);
            } catch (e) {
                alert('Error encoding URL: ' + e.message);
            }
        }

        function decodeURL() {
            const input = document.getElementById('input').value;
            if (!input) {
                alert('Please enter URL to decode');
                return;
            }
            try {
                document.getElementById('output').value = decodeURI(input);
            } catch (e) {
                alert('Error decoding URL: ' + e.message);
            }
        }

        function encodeComponent() {
            const input = document.getElementById('input').value;
            if (!input) {
                alert('Please enter text to encode');
                return;
            }
            try {
                document.getElementById('output').value = encodeURIComponent(input);
            } catch (e) {
                alert('Error encoding: ' + e.message);
            }
        }

        function decodeComponent() {
            const input = document.getElementById('input').value;
            if (!input) {
                alert('Please enter text to decode');
                return;
            }
            try {
                document.getElementById('output').value = decodeURIComponent(input);
            } catch (e) {
                alert('Error decoding: ' + e.message);
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
