let colorStops = [
            { color: '#667eea', position: 0 },
            { color: '#764ba2', position: 100 }
        ];

        function init() {
            renderColorStops();
            updateGradient();
        }

        function renderColorStops() {
            const list = document.getElementById('colorStopsList');
            list.innerHTML = colorStops.map((stop, index) => `
                <div class="color-stop">
                    <input type="color" value="${stop.color}" onchange="updateColorStop(${index}, 'color', this.value)">
                    <input type="number" value="${stop.position}" min="0" max="100" onchange="updateColorStop(${index}, 'position', this.value)">
                    ${colorStops.length > 2 ? `<button class="remove-btn" onclick="removeColorStop(${index})">×</button>` : '<span></span>'}
                </div>
            `).join('');
        }

        function updateColorStop(index, property, value) {
            if (property === 'position') {
                colorStops[index][property] = parseInt(value);
            } else {
                colorStops[index][property] = value;
            }
            updateGradient();
        }

        function addColorStop() {
            const lastPosition = colorStops[colorStops.length - 1].position;
            const newPosition = Math.min(lastPosition + 10, 100);
            colorStops.push({ color: '#764ba2', position: newPosition });
            renderColorStops();
            updateGradient();
        }

        function removeColorStop(index) {
            if (colorStops.length > 2) {
                colorStops.splice(index, 1);
                renderColorStops();
                updateGradient();
            }
        }

        function updateGradient() {
            const type = document.getElementById('gradientType').value;
            const angle = document.getElementById('angle').value;
            document.getElementById('angleValue').textContent = angle;

            // Show/hide angle control
            document.getElementById('angleGroup').style.display = type === 'linear' ? 'block' : 'none';

            // Sort color stops by position
            const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);

            // Generate gradient string
            const stopsString = sortedStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');

            let gradient;
            if (type === 'linear') {
                gradient = `linear-gradient(${angle}deg, ${stopsString})`;
            } else {
                gradient = `radial-gradient(circle, ${stopsString})`;
            }

            // Update preview
            document.getElementById('preview').style.background = gradient;

            // Update code
            document.getElementById('cssCode').textContent = `background: ${gradient};`;
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

        // Initialize
        init();
