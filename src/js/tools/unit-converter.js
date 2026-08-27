const lengthUnits = {
            m: 1, km: 0.001, cm: 100, mm: 1000,
            mi: 0.000621371, yd: 1.09361, ft: 3.28084, in: 39.3701
        };

        const weightUnits = {
            kg: 1, g: 1000, mg: 1000000,
            lb: 2.20462, oz: 35.274, ton: 0.001
        };

        const areaUnits = {
            sqm: 1, sqkm: 0.000001, sqft: 10.7639,
            sqmi: 3.861e-7, acre: 0.000247105, hectare: 0.0001
        };

        const volumeUnits = {
            l: 1, ml: 1000, gal: 0.264172, qt: 1.05669,
            pt: 2.11338, cup: 4.22675, tbsp: 67.628, tsp: 202.884
        };

        function switchCategory(category) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.converter-section').forEach(s => s.classList.remove('active'));
            event.target.classList.add('active');
            document.getElementById(category).classList.add('active');
        }

        function convertLength() {
            const value = parseFloat(document.getElementById('lengthValue').value);
            const from = document.getElementById('lengthFrom').value;
            const to = document.getElementById('lengthTo').value;

            if (isNaN(value)) {
                document.getElementById('lengthResult').textContent = '-';
                return;
            }

            const meters = value / lengthUnits[from];
            const result = meters * lengthUnits[to];
            document.getElementById('lengthResult').textContent = result.toFixed(6);
        }

        function convertWeight() {
            const value = parseFloat(document.getElementById('weightValue').value);
            const from = document.getElementById('weightFrom').value;
            const to = document.getElementById('weightTo').value;

            if (isNaN(value)) {
                document.getElementById('weightResult').textContent = '-';
                return;
            }

            const kg = value / weightUnits[from];
            const result = kg * weightUnits[to];
            document.getElementById('weightResult').textContent = result.toFixed(6);
        }

        function convertTemp() {
            const value = parseFloat(document.getElementById('tempValue').value);
            const from = document.getElementById('tempFrom').value;
            const to = document.getElementById('tempTo').value;

            if (isNaN(value)) {
                document.getElementById('tempResult').textContent = '-';
                return;
            }

            let celsius;
            if (from === 'c') celsius = value;
            else if (from === 'f') celsius = (value - 32) * 5/9;
            else celsius = value - 273.15;

            let result;
            if (to === 'c') result = celsius;
            else if (to === 'f') result = celsius * 9/5 + 32;
            else result = celsius + 273.15;

            document.getElementById('tempResult').textContent = result.toFixed(2);
        }

        function convertArea() {
            const value = parseFloat(document.getElementById('areaValue').value);
            const from = document.getElementById('areaFrom').value;
            const to = document.getElementById('areaTo').value;

            if (isNaN(value)) {
                document.getElementById('areaResult').textContent = '-';
                return;
            }

            const sqm = value / areaUnits[from];
            const result = sqm * areaUnits[to];
            document.getElementById('areaResult').textContent = result.toFixed(6);
        }

        function convertVolume() {
            const value = parseFloat(document.getElementById('volumeValue').value);
            const from = document.getElementById('volumeFrom').value;
            const to = document.getElementById('volumeTo').value;

            if (isNaN(value)) {
                document.getElementById('volumeResult').textContent = '-';
                return;
            }

            const liters = value / volumeUnits[from];
            const result = liters * volumeUnits[to];
            document.getElementById('volumeResult').textContent = result.toFixed(6);
        }
