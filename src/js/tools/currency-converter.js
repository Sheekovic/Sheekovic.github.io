const CACHE_KEY = 'sheekovic_currency_data';
        const CACHE_DURATION = 3600 * 1000; // 1 hour

        const CURRENCY_NAMES = {
            // Fiat Currencies
            USD: 'United States Dollar',
            EUR: 'Euro',
            GBP: 'British Pound Sterling',
            JPY: 'Japanese Yen',
            AUD: 'Australian Dollar',
            CAD: 'Canadian Dollar',
            CHF: 'Swiss Franc',
            CNY: 'Chinese Yuan',
            HKD: 'Hong Kong Dollar',
            NZD: 'New Zealand Dollar',
            SEK: 'Swedish Krona',
            KRW: 'South Korean Won',
            SGD: 'Singapore Dollar',
            NOK: 'Norwegian Krone',
            MXN: 'Mexican Peso',
            INR: 'Indian Rupee',
            RUB: 'Russian Ruble',
            ZAR: 'South African Rand',
            TRY: 'Turkish Lira',
            BRL: 'Brazilian Real',
            TWD: 'New Taiwan Dollar',
            DKK: 'Danish Krone',
            PLN: 'Polish Zloty',
            THB: 'Thai Baht',
            IDR: 'Indonesian Rupiah',
            HUF: 'Hungarian Forint',
            CZK: 'Czech Koruna',
            ILS: 'Israeli New Shekel',
            CLP: 'Chilean Peso',
            PHP: 'Philippine Peso',
            AED: 'UAE Dirham',
            COP: 'Colombian Peso',
            SAR: 'Saudi Riyal',
            MYR: 'Malaysian Ringgit',
            RON: 'Romanian Leu',
            // Cryptocurrencies - Major
            BTC: 'Bitcoin',
            ETH: 'Ethereum',
            USDT: 'Tether',
            BNB: 'Binance Coin',
            SOL: 'Solana',
            XRP: 'Ripple',
            ADA: 'Cardano',
            DOGE: 'Dogecoin',
            DOT: 'Polkadot',
            TRX: 'TRON',
            LTC: 'Litecoin',
            SHIB: 'Shiba Inu',
            UNI: 'Uniswap',
            // Cryptocurrencies - Extended
            AVAX: 'Avalanche',
            LINK: 'Chainlink',
            XLM: 'Stellar',
            ALGO: 'Algorand',
            ATOM: 'Cosmos',
            XMR: 'Monero',
            BCH: 'Bitcoin Cash',
            NEAR: 'NEAR Protocol',
            MATIC: 'Polygon',
            APE: 'ApeCoin'
        };

        const CRYPTO_ID_MAP = {
            BTC: 'bitcoin',
            ETH: 'ethereum',
            USDT: 'tether',
            BNB: 'binancecoin',
            SOL: 'solana',
            XRP: 'ripple',
            ADA: 'cardano',
            DOGE: 'dogecoin',
            DOT: 'polkadot',
            TRX: 'tron',
            LTC: 'litecoin',
            SHIB: 'shiba-inu',
            UNI: 'uniswap',
            AVAX: 'avalanche-2',
            LINK: 'chainlink',
            XLM: 'stellar',
            ALGO: 'algorand',
            ATOM: 'cosmos',
            XMR: 'monero',
            BCH: 'bitcoin-cash',
            NEAR: 'near',
            MATIC: 'matic-network',
            APE: 'apecoin'
        };

        let exchangeRates = {};
        let lastUpdate = '';

        function showMessage(message, type = 'info') {
            const statusDiv = document.getElementById('statusMessage');
            const className = type === 'error' ? 'error' : type === 'success' ? 'success' : 'info';
            statusDiv.innerHTML = `<div class="${className}">${message}</div>`;
        }

        function isCrypto(code) {
            return CRYPTO_ID_MAP.hasOwnProperty(code);
        }

        function populateCurrencySelects() {
            const fromSelect = document.getElementById('fromCurrency');
            const toSelect = document.getElementById('toCurrency');

            // Sort currencies: Fiat first, then Crypto
            const sortedCurrencies = Object.entries(CURRENCY_NAMES).sort((a, b) => {
                const aIsCrypto = isCrypto(a[0]);
                const bIsCrypto = isCrypto(b[0]);

                if (aIsCrypto !== bIsCrypto) {
                    return aIsCrypto ? 1 : -1;
                }
                return a[1].localeCompare(b[1]);
            });

            fromSelect.innerHTML = '';
            toSelect.innerHTML = '';

            sortedCurrencies.forEach(([code, name]) => {
                const type = isCrypto(code) ? '🪙' : '💵';
                const optionText = `${type} ${code} - ${name}`;

                const option1 = new Option(optionText, code);
                const option2 = new Option(optionText, code);

                fromSelect.add(option1);
                toSelect.add(option2);
            });

            // Set defaults
            fromSelect.value = 'USD';
            toSelect.value = 'EUR';
        }

        function filterCurrencies(type) {
            const searchInput = document.getElementById(type + 'Search');
            const select = document.getElementById(type + 'Currency');
            const filter = searchInput.value.toUpperCase();

            for (let i = 0; i < select.options.length; i++) {
                const option = select.options[i];
                const txtValue = option.textContent || option.innerText;
                option.style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
            }
        }

        async function fetchFiatRates() {
            try {
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                if (!response.ok) throw new Error('Fiat API failed');
                const data = await response.json();
                return data.rates;
            } catch (error) {
                console.error('Fiat API Error:', error);
                return null;
            }
        }

        async function fetchCryptoRates() {
            try {
                const ids = Object.values(CRYPTO_ID_MAP).join(',');
                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
                if (!response.ok) throw new Error('Crypto API failed');
                const data = await response.json();

                const rates = {};
                Object.entries(CRYPTO_ID_MAP).forEach(([code, id]) => {
                    if (data[id] && data[id].usd) {
                        rates[code] = 1 / data[id].usd;
                    }
                });

                return rates;
            } catch (error) {
                console.error('Crypto API Error:', error);
                return null;
            }
        }

        async function fetchExchangeRates() {
            // Check cache first
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                try {
                    const { timestamp, data } = JSON.parse(cached);
                    if (Date.now() - timestamp < CACHE_DURATION) {
                        exchangeRates = data.rates;
                        lastUpdate = data.date;
                        showMessage(`✅ Using cached rates (updated: ${new Date(timestamp).toLocaleString()})`, 'success');
                        return true;
                    }
                } catch (e) {
                    localStorage.removeItem(CACHE_KEY);
                }
            }

            // Fetch fresh data
            showMessage('⏳ Fetching live exchange rates...', 'info');

            try {
                const [fiatRates, cryptoRates] = await Promise.all([
                    fetchFiatRates(),
                    fetchCryptoRates()
                ]);

                if (!fiatRates && !cryptoRates) {
                    throw new Error('All API requests failed');
                }

                exchangeRates = { ...fiatRates, ...cryptoRates };
                exchangeRates['USD'] = 1; // Ensure USD base exists

                lastUpdate = new Date().toISOString().split('T')[0];

                // Cache the results
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    data: {
                        rates: exchangeRates,
                        date: lastUpdate
                    }
                }));

                const fiatCount = fiatRates ? Object.keys(fiatRates).length : 0;
                const cryptoCount = cryptoRates ? Object.keys(cryptoRates).length : 0;
                showMessage(`✅ Live rates loaded! ${fiatCount} fiat + ${cryptoCount} crypto currencies (cached for 1 hour)`, 'success');

                return true;
            } catch (error) {
                console.error('Exchange Rate Error:', error);
                showMessage('❌ Failed to fetch live rates. Using fallback rates. Please try again later.', 'error');

                // Fallback to basic rates
                exchangeRates = {
                    USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50,
                    AUD: 1.52, CAD: 1.36, CHF: 0.88, CNY: 7.24,
                    BTC: 0.000017, ETH: 0.00027
                };
                return false;
            }
        }

        function convert() {
            const amount = parseFloat(document.getElementById('amount').value) || 0;
            const fromSelect = document.getElementById('fromCurrency');
            const toSelect = document.getElementById('toCurrency');

            const from = fromSelect.value;
            const to = toSelect.value;

            if (!from || !to || !exchangeRates[from] || !exchangeRates[to]) {
                document.getElementById('result').textContent = 'Select currencies';
                return;
            }

            // Convert to USD first, then to target currency
            const inUSD = amount / exchangeRates[from];
            const result = inUSD * exchangeRates[to];

            // Format result based on crypto or fiat
            let formattedResult;
            if (isCrypto(to)) {
                formattedResult = result < 0.01 ? result.toExponential(6) : result.toFixed(8);
            } else {
                formattedResult = result.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }

            document.getElementById('result').textContent = `${formattedResult} ${to}`;

            const rate = exchangeRates[to] / exchangeRates[from];
            const formattedRate = isCrypto(to) || isCrypto(from)
                ? rate.toExponential(6)
                : rate.toFixed(4);

            document.getElementById('rate').textContent =
                `Exchange Rate: 1 ${from} = ${formattedRate} ${to}`;
        }

        function swapCurrencies() {
            const from = document.getElementById('fromCurrency');
            const to = document.getElementById('toCurrency');
            const temp = from.value;
            from.value = to.value;
            to.value = temp;
            convert();
        }

        // Initialize
        (async function init() {
            populateCurrencySelects();
            await fetchExchangeRates();
            convert();
        })();
