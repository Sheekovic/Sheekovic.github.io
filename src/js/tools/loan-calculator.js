function calculate() {
            const loanAmount = parseFloat(document.getElementById('loanAmount').value);
            const interestRate = parseFloat(document.getElementById('interestRate').value);
            const loanTerm = parseFloat(document.getElementById('loanTerm').value);
            const termPeriod = document.getElementById('termPeriod').value;

            if (!loanAmount || !interestRate || !loanTerm || loanAmount <= 0 || interestRate < 0 || loanTerm <= 0) {
                alert('Please enter valid loan details');
                return;
            }

            // Convert to months
            const months = termPeriod === 'years' ? loanTerm * 12 : loanTerm;

            // Monthly interest rate
            const monthlyRate = interestRate / 100 / 12;

            // Calculate monthly payment using formula: M = P[r(1+r)^n]/[(1+r)^n-1]
            let monthlyPayment;
            if (monthlyRate === 0) {
                monthlyPayment = loanAmount / months;
            } else {
                monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                                (Math.pow(1 + monthlyRate, months) - 1);
            }

            const totalPayment = monthlyPayment * months;
            const totalInterest = totalPayment - loanAmount;

            // Update display
            document.getElementById('monthlyPayment').textContent = '$' + monthlyPayment.toFixed(2);
            document.getElementById('totalPayment').textContent = '$' + totalPayment.toFixed(2);
            document.getElementById('totalInterest').textContent = '$' + totalInterest.toFixed(2);
            document.getElementById('principalAmount').textContent = '$' + loanAmount.toFixed(2);
            document.getElementById('numPayments').textContent = Math.round(months);

            document.getElementById('results').classList.add('show');
        }

        // Allow Enter key to calculate
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') calculate();
            });
        });
