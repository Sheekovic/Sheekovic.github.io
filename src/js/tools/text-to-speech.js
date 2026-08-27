let synth = window.speechSynthesis;
        let voices = [];
        let utterance = null;
        let isPaused = false;

        function loadVoices() {
            voices = synth.getVoices();
            const voiceSelect = document.getElementById('voiceSelect');

            voiceSelect.replaceChildren(...voices.map((voice, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                return option;
            }));
        }

        // Load voices when they're ready
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }
        loadVoices();

        function updateRate() {
            const rate = document.getElementById('rate').value;
            document.getElementById('rateValue').textContent = rate + 'x';
        }

        function updatePitch() {
            const pitch = document.getElementById('pitch').value;
            document.getElementById('pitchValue').textContent = pitch;
        }

        function speak() {
            const text = document.getElementById('textInput').value;

            if (!text.trim()) {
                alert('Please enter some text to speak');
                return;
            }

            // Cancel any ongoing speech
            synth.cancel();

            utterance = new SpeechSynthesisUtterance(text);

            const voiceIndex = document.getElementById('voiceSelect').value;
            utterance.voice = voices[voiceIndex];

            utterance.rate = parseFloat(document.getElementById('rate').value);
            utterance.pitch = parseFloat(document.getElementById('pitch').value);
            utterance.lang = document.getElementById('langSelect').value;

            utterance.onstart = () => {
                document.getElementById('status').textContent = 'Speaking...';
                document.getElementById('status').className = 'status speaking';
                isPaused = false;
                document.getElementById('pauseBtn').textContent = '⏸️ Pause';
            };

            utterance.onend = () => {
                document.getElementById('status').textContent = 'Finished';
                document.getElementById('status').className = 'status';
                isPaused = false;
                document.getElementById('pauseBtn').textContent = '⏸️ Pause';
            };

            utterance.onerror = (e) => {
                document.getElementById('status').textContent = 'Error: ' + e.error;
                document.getElementById('status').className = 'status';
            };

            synth.speak(utterance);
        }

        function pauseResume() {
            if (synth.speaking) {
                if (isPaused) {
                    synth.resume();
                    isPaused = false;
                    document.getElementById('pauseBtn').textContent = '⏸️ Pause';
                    document.getElementById('status').textContent = 'Speaking...';
                } else {
                    synth.pause();
                    isPaused = true;
                    document.getElementById('pauseBtn').textContent = '▶️ Resume';
                    document.getElementById('status').textContent = 'Paused';
                }
            }
        }

        function stop() {
            synth.cancel();
            document.getElementById('status').textContent = 'Stopped';
            document.getElementById('status').className = 'status';
            isPaused = false;
            document.getElementById('pauseBtn').textContent = '⏸️ Pause';
        }
