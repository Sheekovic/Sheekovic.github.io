let selectedFiles = [];

        document.getElementById('fileInput').addEventListener('change', (e) => {
            selectedFiles = Array.from(e.target.files);
            displayFiles();
        });

        function displayFiles() {
            if (selectedFiles.length === 0) {
                document.getElementById('fileList').classList.add('hidden');
                document.getElementById('mergeBtn').classList.add('hidden');
                return;
            }

            const container = document.getElementById('filesContainer');
            container.replaceChildren();

            selectedFiles.forEach((file, index) => {
                const item = document.createElement('div');
                item.className = 'file-item';

                const info = document.createElement('div');
                info.className = 'file-info';

                const icon = document.createElement('div');
                icon.className = 'file-icon';
                icon.textContent = '📄';

                const details = document.createElement('div');
                details.className = 'file-details';

                const name = document.createElement('h4');
                name.textContent = file.name;

                const size = document.createElement('p');
                size.textContent = formatFileSize(file.size);

                const actions = document.createElement('div');
                actions.className = 'file-actions';

                const removeButton = document.createElement('button');
                removeButton.className = 'btn-small';
                removeButton.type = 'button';
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', () => removeFile(index));

                details.append(name, size);
                info.append(icon, details);
                actions.append(removeButton);
                item.append(info, actions);
                container.append(item);
            });

            document.getElementById('fileList').classList.remove('hidden');
            document.getElementById('mergeBtn').classList.remove('hidden');
            document.getElementById('mergeBtn').disabled = selectedFiles.length < 2;

            if (selectedFiles.length < 2) {
                document.getElementById('mergeBtn').textContent = 'Add at least 2 PDFs to merge';
            } else {
                document.getElementById('mergeBtn').textContent = `Merge ${selectedFiles.length} PDFs`;
            }
        }

        function removeFile(index) {
            selectedFiles.splice(index, 1);
            displayFiles();
        }

        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }

        async function mergePDFs() {
            if (selectedFiles.length < 2) {
                alert('Please select at least 2 PDF files to merge');
                return;
            }

            const mergeBtn = document.getElementById('mergeBtn');
            mergeBtn.disabled = true;
            mergeBtn.textContent = 'Merging PDFs...';

            try {
                const { PDFDocument } = PDFLib;
                const mergedPdf = await PDFDocument.create();

                for (let i = 0; i < selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await PDFDocument.load(arrayBuffer);
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach((page) => mergedPdf.addPage(page));
                }

                const mergedPdfBytes = await mergedPdf.save();
                const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = 'merged.pdf';
                a.click();

                URL.revokeObjectURL(url);

                mergeBtn.textContent = 'Merge Complete! ✓';
                setTimeout(() => {
                    mergeBtn.textContent = `Merge ${selectedFiles.length} PDFs`;
                    mergeBtn.disabled = false;
                }, 3000);

            } catch (error) {
                console.error('Error merging PDFs:', error);
                alert('Error merging PDFs: ' + error.message);
                mergeBtn.textContent = `Merge ${selectedFiles.length} PDFs`;
                mergeBtn.disabled = false;
            }
        }
