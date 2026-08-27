function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        function rgbToHsl(r, g, b) {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                    case g: h = ((b - r) / d + 2) / 6; break;
                    case b: h = ((r - g) / d + 4) / 6; break;
                }
            }
            return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
        }

        function hslToRgb(h, s, l) {
            h /= 360; s /= 100; l /= 100;
            let r, g, b;

            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
        }

        function rgbToCmyk(r, g, b) {
            let c = 1 - (r / 255);
            let m = 1 - (g / 255);
            let y = 1 - (b / 255);
            let k = Math.min(c, m, y);

            c = ((c - k) / (1 - k)) || 0;
            m = ((m - k) / (1 - k)) || 0;
            y = ((y - k) / (1 - k)) || 0;

            return {
                c: Math.round(c * 100),
                m: Math.round(m * 100),
                y: Math.round(y * 100),
                k: Math.round(k * 100)
            };
        }

        function updateDisplay(r, g, b) {
            const hex = rgbToHex(r, g, b);
            const hsl = rgbToHsl(r, g, b);
            const cmyk = rgbToCmyk(r, g, b);

            document.getElementById('colorPreview').style.backgroundColor = hex;
            document.getElementById('colorPicker').value = hex;
            document.getElementById('hexInput').value = hex;
            document.getElementById('r').value = r;
            document.getElementById('g').value = g;
            document.getElementById('b').value = b;
            document.getElementById('h').value = hsl.h;
            document.getElementById('s').value = hsl.s;
            document.getElementById('l').value = hsl.l;

            document.getElementById('hexValue').textContent = hex;
            document.getElementById('rgbValue').textContent = `rgb(${r}, ${g}, ${b})`;
            document.getElementById('hslValue').textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            document.getElementById('cmykValue').textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
        }

        function updateFromPicker() {
            const hex = document.getElementById('colorPicker').value;
            const rgb = hexToRgb(hex);
            updateDisplay(rgb.r, rgb.g, rgb.b);
        }

        function updateFromHex() {
            const hex = document.getElementById('hexInput').value;
            if (/^#[0-9A-F]{6}$/i.test(hex)) {
                const rgb = hexToRgb(hex);
                updateDisplay(rgb.r, rgb.g, rgb.b);
            }
        }

        function updateFromRGB() {
            const r = parseInt(document.getElementById('r').value) || 0;
            const g = parseInt(document.getElementById('g').value) || 0;
            const b = parseInt(document.getElementById('b').value) || 0;
            updateDisplay(r, g, b);
        }

        function updateFromHSL() {
            const h = parseInt(document.getElementById('h').value) || 0;
            const s = parseInt(document.getElementById('s').value) || 0;
            const l = parseInt(document.getElementById('l').value) || 0;
            const rgb = hslToRgb(h, s, l);
            updateDisplay(rgb.r, rgb.g, rgb.b);
        }

        function copyFormat(format) {
            let text;
            switch(format) {
                case 'hex': text = document.getElementById('hexValue').textContent; break;
                case 'rgb': text = document.getElementById('rgbValue').textContent; break;
                case 'hsl': text = document.getElementById('hslValue').textContent; break;
                case 'cmyk': text = document.getElementById('cmykValue').textContent; break;
            }

            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            alert('Copied: ' + text);
        }

        // Initialize
        updateFromPicker();
