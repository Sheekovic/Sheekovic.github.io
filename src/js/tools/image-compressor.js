let originalFile = null;
        let compressedBlob = null;

        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        // Drag and drop handlers
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleFile(file);
            }
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFile(file);
            }
        });

        function handleFile(file) {
            originalFile = file;

            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('originalImg').src = e.target.result;
                document.getElementById('originalInfo').textContent =
                    `Size: ${formatFileSize(file.size)} | ${file.name}`;

                document.getElementById('controls').classList.remove('hidden');
                document.getElementById('preview').classList.remove('hidden');

                updateCompression();
            };
            reader.readAsDataURL(file);
        }

        function updateCompression() {
            if (!originalFile) return;

            const quality = document.getElementById('quality').value / 100;
            document.getElementById('qualityValue').textContent =
                document.getElementById('quality').value + '%';

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    compressedBlob = blob;
                    const url = URL.createObjectURL(blob);
                    document.getElementById('compressedImg').src = url;

                    const reduction = ((originalFile.size - blob.size) / originalFile.size * 100).toFixed(1);
                    document.getElementById('compressedInfo').textContent =
                        `Size: ${formatFileSize(blob.size)} | ${reduction}% smaller`;

                    document.getElementById('downloadBtn').classList.remove('hidden');
                }, 'image/jpeg', quality);
            };
            img.src = document.getElementById('originalImg').src;
        }

        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }

        function downloadImage() {
            if (!compressedBlob) return;

            const url = URL.createObjectURL(compressedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'compressed_' + (originalFile.name.replace(/\.[^/.]+$/, '') + '.jpg');
            a.click();
            URL.revokeObjectURL(url);
        }
