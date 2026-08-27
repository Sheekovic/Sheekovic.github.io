let selectedTipPercent = 15;

        function selectTip(percent) {
            selectedTipPercent = percent;
            document.querySelectorAll('.tip-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            document.getElementById('customTipGroup').style.display = 'none';
            calculate();
        }

        function selectCustom() {
            document.querySelectorAll('.tip-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            document.getElementById('customTipGroup').style.display = 'block';
            const customTip = parseFloat(document.getElementById('customTip').value) || 0;
            selectedTipPercent = customTip;
            calculate();
        }

        function calculate() {
            const billAmount = parseFloat(document.getElementById('billAmount').value) || 0;
            const numPeople = parseInt(document.getElementById('numPeople').value) || 1;

            // If custom tip is shown, use that value
            if (document.getElementById('customTipGroup').style.display !== 'none') {
                selectedTipPercent = parseFloat(document.getElementById('customTip').value) || 0;
            }

            const tipAmount = billAmount * (selectedTipPercent / 100);
            const totalBill = billAmount + tipAmount;
            const perPerson = totalBill / numPeople;
            const tipPerPerson = tipAmount / numPeople;

            document.getElementById('tipAmount').textContent = '$' + tipAmount.toFixed(2);
            document.getElementById('totalBill').textContent = '$' + totalBill.toFixed(2);
            document.getElementById('perPerson').textContent = '$' + perPerson.toFixed(2);
            document.getElementById('tipPerPerson').textContent = '$' + tipPerPerson.toFixed(2);
        }

        // Initial calculation
        calculate();
