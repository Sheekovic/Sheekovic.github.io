const input = document.getElementById('input');
        const fileInput = document.getElementById('fileInput');

        function generateHashes() {
            const text = input.value;

            if (!text) {
                document.getElementById('md5').textContent = '-';
                document.getElementById('sha1').textContent = '-';
                document.getElementById('sha256').textContent = '-';
                document.getElementById('sha512').textContent = '-';
                return;
            }

            document.getElementById('md5').textContent = CryptoJS.MD5(text).toString();
            document.getElementById('sha1').textContent = CryptoJS.SHA1(text).toString();
            document.getElementById('sha256').textContent = CryptoJS.SHA256(text).toString();
            document.getElementById('sha512').textContent = CryptoJS.SHA512(text).toString();
        }

        input.addEventListener('input', generateHashes);

        fileInput.addEventListener('change', function() {
            const file = fileInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(content));

                document.getElementById('md5').textContent = CryptoJS.MD5(wordArray).toString();
                document.getElementById('sha1').textContent = CryptoJS.SHA1(wordArray).toString();
                document.getElementById('sha256').textContent = CryptoJS.SHA256(wordArray).toString();
                document.getElementById('sha512').textContent = CryptoJS.SHA512(wordArray).toString();
            };
            reader.readAsArrayBuffer(file);
        });

        function copyHash(type) {
            const element = document.getElementById(type);
            const text = element.textContent;

            if (text === '-') {
                alert('No hash to copy');
                return;
            }

            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            alert(type.toUpperCase() + ' hash copied to clipboard!');
        }
