const input = document.getElementById('input');
        const preview = document.getElementById('preview');

        function updatePreview() {
            const markdown = input.value;
            preview.innerHTML = marked.parse(markdown);
        }

        input.addEventListener('input', updatePreview);

        // Initial preview
        updatePreview();

        function copyMarkdown() {
            input.select();
            document.execCommand('copy');
            alert('Markdown copied to clipboard!');
        }

        function copyHTML() {
            const html = preview.innerHTML;
            const temp = document.createElement('textarea');
            temp.value = html;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            alert('HTML copied to clipboard!');
        }

        function clearAll() {
            input.value = '';
            updatePreview();
        }
