function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            if (tab === 'text') {
                document.querySelectorAll('.tab')[0].classList.add('active');
                document.getElementById('text-tab').classList.add('active');
            } else {
                document.querySelectorAll('.tab')[1].classList.add('active');
                document.getElementById('file-tab').classList.add('active');
            }
        }

        function encodeText() {
            const input = document.getElementById('textInput').value;
            if (!input) {
                alert('Please enter text to encode');
                return;
            }
            try {
                const encoded = btoa(unescape(encodeURIComponent(input)));
                document.getElementById('textOutput').value = encoded;
            } catch (e) {
                alert('Error encoding text: ' + e.message);
            }
        }

        function decodeText() {
            const input = document.getElementById('textInput').value;
            if (!input) {
                alert('Please enter Base64 text to decode');
                return;
            }
            try {
                const decoded = decodeURIComponent(escape(atob(input)));
                document.getElementById('textOutput').value = decoded;
            } catch (e) {
                alert('Invalid Base64 string');
            }
        }

        function copyOutput() {
            const output = document.getElementById('textOutput');
            output.select();
            document.execCommand('copy');
            alert('Copied to clipboard!');
        }

        function clearAll() {
            document.getElementById('textInput').value = '';
            document.getElementById('textOutput').value = '';
        }

        function encodeFile() {
            const fileInput = document.getElementById('fileInput');
            if (!fileInput.files[0]) {
                alert('Please select a file');
                return;
            }

            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                const base64 = e.target.result.split(',')[1];
                document.getElementById('fileOutput').value = base64;
            };

            reader.readAsDataURL(file);
        }

        function copyFileOutput() {
            const output = document.getElementById('fileOutput');
            output.select();
            document.execCommand('copy');
            alert('Copied to clipboard!');
        }

        function downloadBase64() {
            const output = document.getElementById('fileOutput').value;
            if (!output) {
                alert('No Base64 data to download');
                return;
            }

            const blob = new Blob([output], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'base64.txt';
            a.click();
            URL.revokeObjectURL(url);
        }
