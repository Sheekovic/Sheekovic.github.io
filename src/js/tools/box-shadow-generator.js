function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        function updateShadow() {
            const hOffset = document.getElementById('hOffset').value;
            const vOffset = document.getElementById('vOffset').value;
            const blur = document.getElementById('blur').value;
            const spread = document.getElementById('spread').value;
            const color = document.getElementById('color').value;
            const opacity = document.getElementById('opacity').value / 100;
            const inset = document.getElementById('inset').checked;

            // Update value displays
            document.getElementById('hOffsetValue').textContent = hOffset + 'px';
            document.getElementById('vOffsetValue').textContent = vOffset + 'px';
            document.getElementById('blurValue').textContent = blur + 'px';
            document.getElementById('spreadValue').textContent = spread + 'px';
            document.getElementById('opacityValue').textContent = opacity.toFixed(2);

            // Convert hex to rgba
            const rgb = hexToRgb(color);
            const rgbaColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

            // Generate box-shadow CSS
            const shadowValue = `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${rgbaColor}`;

            // Update preview
            document.getElementById('previewBox').style.boxShadow = shadowValue;

            // Update code
            document.getElementById('cssCode').textContent = `box-shadow: ${shadowValue};`;
        }

        function copyCode() {
            const code = document.getElementById('cssCode').textContent;
            const temp = document.createElement('textarea');
            temp.value = code;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            alert('CSS code copied to clipboard!');
        }

        function resetShadow() {
            document.getElementById('hOffset').value = 0;
            document.getElementById('vOffset').value = 10;
            document.getElementById('blur').value = 30;
            document.getElementById('spread').value = 0;
            document.getElementById('color').value = '#000000';
            document.getElementById('opacity').value = 30;
            document.getElementById('inset').checked = false;
            updateShadow();
        }

        // Initialize
        updateShadow();
