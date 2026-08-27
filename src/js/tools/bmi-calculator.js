let currentUnit = 'metric';

        function switchUnits(unit) {
            currentUnit = unit;
            document.querySelectorAll('.unit-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            if (unit === 'metric') {
                document.getElementById('metric-inputs').style.display = 'block';
                document.getElementById('imperial-inputs').style.display = 'none';
            } else {
                document.getElementById('metric-inputs').style.display = 'none';
                document.getElementById('imperial-inputs').style.display = 'block';
            }

            document.getElementById('result').classList.remove('show');
        }

        function calculateBMI() {
            let weight, height;

            if (currentUnit === 'metric') {
                weight = parseFloat(document.getElementById('weightKg').value);
                height = parseFloat(document.getElementById('heightCm').value) / 100; // convert to meters
            } else {
                weight = parseFloat(document.getElementById('weightLbs').value) * 0.453592; // convert to kg
                height = parseFloat(document.getElementById('heightIn').value) * 0.0254; // convert to meters
            }

            if (!weight || !height || weight <= 0 || height <= 0) {
                alert('Please enter valid weight and height values');
                return;
            }

            const bmi = weight / (height * height);
            let category, description, color;

            if (bmi < 18.5) {
                category = 'Underweight';
                description = 'You may need to gain weight. Consult with a healthcare provider for personalized advice.';
                color = '#3498db';
            } else if (bmi < 25) {
                category = 'Normal Weight';
                description = 'You have a healthy weight. Maintain your current lifestyle with a balanced diet and regular exercise.';
                color = '#2ecc71';
            } else if (bmi < 30) {
                category = 'Overweight';
                description = 'You may benefit from weight loss. Consider a balanced diet and increased physical activity.';
                color = '#f39c12';
            } else {
                category = 'Obese';
                description = 'Your health may be at risk. Consult with a healthcare provider for a personalized weight management plan.';
                color = '#e74c3c';
            }

            document.getElementById('bmiValue').textContent = bmi.toFixed(1);
            document.getElementById('bmiValue').style.color = color;
            document.getElementById('bmiCategory').textContent = category;
            document.getElementById('bmiCategory').style.color = color;
            document.getElementById('bmiDescription').textContent = description;
            document.getElementById('result').classList.add('show');
        }

        // Allow Enter key to calculate
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') calculateBMI();
            });
        });
