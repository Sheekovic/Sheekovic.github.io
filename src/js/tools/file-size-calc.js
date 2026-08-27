function calculate() {
            const size = parseFloat(document.getElementById('sizeInput').value) || 0;
            const unit = document.getElementById('unit').value;
            const calcType = document.getElementById('calcType').value;

            const base = calcType === 'binary' ? 1024 : 1000;

            // Convert to bytes first
            let bytes;
            switch(unit) {
                case 'bytes': bytes = size; break;
                case 'kb': bytes = size * base; break;
                case 'mb': bytes = size * Math.pow(base, 2); break;
                case 'gb': bytes = size * Math.pow(base, 3); break;
                case 'tb': bytes = size * Math.pow(base, 4); break;
            }

            // Convert to all units
            const kb = bytes / base;
            const mb = bytes / Math.pow(base, 2);
            const gb = bytes / Math.pow(base, 3);
            const tb = bytes / Math.pow(base, 4);

            // Update display
            document.getElementById('bytes').textContent = formatNumber(bytes);
            document.getElementById('kb').textContent = formatNumber(kb);
            document.getElementById('mb').textContent = formatNumber(mb);
            document.getElementById('gb').textContent = formatNumber(gb);
            document.getElementById('tb').textContent = formatNumber(tb);
        }

        function formatNumber(num) {
            if (num === 0) return '0';
            if (num < 0.01) return num.toExponential(2);
            if (num >= 1000000) return num.toExponential(2);
            return num.toFixed(2).replace(/\.?0+$/, '');
        }

        // Initial calculation
        calculate();
