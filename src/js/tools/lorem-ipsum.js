const words = [
            'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
            'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
            'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
            'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
            'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
            'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
            'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
            'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
        ];

        const loremStart = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

        function randomWord() {
            return words[Math.floor(Math.random() * words.length)];
        }

        function randomSentence(minWords = 5, maxWords = 15) {
            const length = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
            const sentence = [];

            for (let i = 0; i < length; i++) {
                sentence.push(randomWord());
            }

            sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
            return sentence.join(' ') + '.';
        }

        function randomParagraph(minSentences = 3, maxSentences = 7) {
            const length = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
            const sentences = [];

            for (let i = 0; i < length; i++) {
                sentences.push(randomSentence());
            }

            return sentences.join(' ');
        }

        function generate() {
            const type = document.getElementById('type').value;
            const count = parseInt(document.getElementById('count').value) || 1;
            const startWithLorem = document.getElementById('startWithLorem').checked;
            const output = document.getElementById('output');

            let result = '';

            if (type === 'paragraphs') {
                const paragraphs = [];
                for (let i = 0; i < count; i++) {
                    if (i === 0 && startWithLorem) {
                        paragraphs.push(loremStart + '. ' + randomParagraph().substring(randomSentence().length + 1));
                    } else {
                        paragraphs.push(randomParagraph());
                    }
                }
                result = paragraphs.join('\n\n');
            } else if (type === 'words') {
                const wordsList = [];
                if (startWithLorem) {
                    wordsList.push(...loremStart.toLowerCase().replace(/[,\.]/g, '').split(' '));
                }
                while (wordsList.length < count) {
                    wordsList.push(randomWord());
                }
                result = wordsList.slice(0, count).join(' ');
                result = result.charAt(0).toUpperCase() + result.slice(1) + '.';
            } else if (type === 'sentences') {
                const sentences = [];
                for (let i = 0; i < count; i++) {
                    if (i === 0 && startWithLorem) {
                        sentences.push(loremStart + '.');
                    } else {
                        sentences.push(randomSentence());
                    }
                }
                result = sentences.join(' ');
            }

            output.textContent = result;
            updateStats(result);
        }

        function updateStats(text) {
            const words = text.split(/\s+/).filter(w => w.length > 0);
            const chars = text.replace(/\s/g, '').length;
            const paragraphs = text.split(/\n\n/).filter(p => p.length > 0);

            document.getElementById('wordCount').textContent = words.length;
            document.getElementById('charCount').textContent = chars;
            document.getElementById('paraCount').textContent = paragraphs.length;
        }

        function copyText() {
            const output = document.getElementById('output');
            const text = output.textContent;

            if (!text || text === 'Click "Generate" to create Lorem Ipsum text') {
                alert('Generate text first!');
                return;
            }

            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            alert('Copied to clipboard!');
        }

        // Generate initial text
        generate();
