function switchCalc(type) {
            document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.calculator-section').forEach(sec => sec.classList.remove('active'));
            event.target.classList.add('active');
            document.getElementById(type).classList.add('active');
        }

        function calcBasic() {
            const x = parseFloat(document.getElementById('basic-x').value) || 0;
            const y = parseFloat(document.getElementById('basic-y').value) || 0;
            const result = (x / 100) * y;
            document.getElementById('basic-result').textContent = result.toFixed(2);
        }

        function calcIs() {
            const x = parseFloat(document.getElementById('is-x').value) || 0;
            const y = parseFloat(document.getElementById('is-y').value) || 0;
            const result = y !== 0 ? (x / y) * 100 : 0;
            document.getElementById('is-result').textContent = result.toFixed(2) + '%';
        }

        function calcChange() {
            const from = parseFloat(document.getElementById('change-from').value) || 0;
            const to = parseFloat(document.getElementById('change-to').value) || 0;

            if (from === 0) {
                document.getElementById('change-result').textContent = '0%';
                document.getElementById('change-label').textContent = 'No change';
                return;
            }

            const change = ((to - from) / from) * 100;
            document.getElementById('change-result').textContent =
                (change >= 0 ? '+' : '') + change.toFixed(2) + '%';

            if (change > 0) {
                document.getElementById('change-label').textContent = 'Increase';
            } else if (change < 0) {
                document.getElementById('change-label').textContent = 'Decrease';
            } else {
                document.getElementById('change-label').textContent = 'No change';
            }
        }

        function calcIncrease() {
            const value = parseFloat(document.getElementById('inc-value').value) || 0;
            const percent = parseFloat(document.getElementById('inc-percent').value) || 0;
            const type = document.getElementById('inc-type').value;

            const change = (percent / 100) * value;
            const result = type === 'increase' ? value + change : value - change;

            document.getElementById('inc-result').textContent = result.toFixed(2);
            document.getElementById('inc-details').textContent =
                `${type === 'increase' ? '+' : '-'}${change.toFixed(2)}`;
        }

        // Initial calculations
        calcBasic();
