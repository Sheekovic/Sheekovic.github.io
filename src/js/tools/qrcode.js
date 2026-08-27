function generateQR() {
            const text = document.getElementById('text').value.trim();
            const size = parseInt(document.getElementById('size').value);
            const qrcodeDiv = document.getElementById('qrcode');
            const downloadBtn = document.getElementById('downloadBtn');

            if (!text) {
                alert('Please enter text or URL');
                return;
            }

            qrcodeDiv.replaceChildren();

            QRCode.toCanvas(text, {
                width: size,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, function (error, canvas) {
                if (error) {
                    console.error(error);
                    alert('Error generating QR code');
                    return;
                }
                qrcodeDiv.appendChild(canvas);
                downloadBtn.style.display = 'block';
            });
        }

        function downloadQR() {
            const canvas = document.querySelector('#qrcode canvas');
            if (!canvas) return;

            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = url;
            link.click();
        }

        document.getElementById('text').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateQR();
            }
        });
