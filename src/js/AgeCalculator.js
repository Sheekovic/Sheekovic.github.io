document.getElementById("age-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const day = parseInt(document.getElementById("day").value);
    const month = parseInt(document.getElementById("month").value);
    const year = parseInt(document.getElementById("year").value);

    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    const age = today.getFullYear() - birthDate.getFullYear();
    const isBirthdayToday = today.getDate() === day && today.getMonth() === month - 1;

    // Adjust for a birthday not yet reached this year
    const ageAdjustment = today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? -1 : 0;
    const currentAge = age + ageAdjustment;

    // Calculate days until next birthday
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (today > nextBirthday) nextBirthday.setFullYear(today.getFullYear() + 1);
    const daysToBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    // Display results
    document.getElementById("results").style.display = "block";
    document.getElementById("current-age").innerText = `You are ${currentAge} years old.`;
    document.getElementById("next-birthday").innerText = isBirthdayToday
        ? "Happy Birthday! 🎉"
        : `Your next birthday is in ${daysToBirthday} days.`;

    // Optional Fun Fact: Age in days
    const ageInDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const ageInHours = Math.floor((today - birthDate) / (1000 * 60 * 60));
    const ageInMinutes = Math.floor((today - birthDate) / (1000 * 60));
    document.getElementById("fun-facts").innerText = `Fun Facts
    You are ${ageInDays} days old!
    You are ${ageInHours} hours old!
    You are ${ageInMinutes} minutes old!`;

    // Fetch Birthstone and Zodiac Sign
    const zodiacSign = getZodiacSign(day, month);
    const birthstone = getBirthstone(month);
    document.getElementById("fun-facts").innerHTML += `<br>Your Zodiac Sign: ${zodiacSign}<br>Your Birthstone: ${birthstone}`;


    // Compatibility Calculator Section
    document.getElementById("compatibility-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const day2 = parseInt(document.getElementById("compatibility-day").value);
        const month2 = parseInt(document.getElementById("compatibility-month").value);
        const year2 = parseInt(document.getElementById("compatibility-year").value);

        const zodiac2 = getZodiacSign(day2, month2);
        const compatibilityList = {
            "Aries": {
                "Aries": "5/10",
                "Taurus": "4/10",
                "Gemini": "8/10",
                "Cancer": "4/10",
                "Leo": "9/10",
                "Virgo": "5/10",
                "Libra": "8/10",
                "Scorpio": "5/10",
                "Sagittarius": "9/10",
                "Capricorn": "6/10",
                "Aquarius": "8/10",
                "Pisces": "7/10"
            },
            "Taurus": {
                "Aries": "4/10",
                "Taurus": "8/10",
                "Gemini": "4/10",
                "Cancer": "8/10",
                "Leo": "6/10",
                "Virgo": "9/10",
                "Libra": "5/10",
                "Scorpio": "8/10",
                "Sagittarius": "5/10",
                "Capricorn": "9/10",
                "Aquarius": "4/10",
                "Pisces": "7/10"
            },
            "Gemini": {
                "Aries": "8/10",
                "Taurus": "4/10",
                "Gemini": "5/10",
                "Cancer": "3/10",
                "Leo": "7/10",
                "Virgo": "6/10",
                "Libra": "9/10",
                "Scorpio": "6/10",
                "Sagittarius": "8/10",
                "Capricorn": "4/10",
                "Aquarius": "9/10",
                "Pisces": "6/10"
            },
            "Cancer": {
                "Aries": "4/10",
                "Taurus": "8/10",
                "Gemini": "3/10",
                "Cancer": "10/10",
                "Leo": "6/10",
                "Virgo": "7/10",
                "Libra": "6/10",
                "Scorpio": "9/10",
                "Sagittarius": "5/10",
                "Capricorn": "9/10",
                "Aquarius": "4/10",
                "Pisces": "9/10"
            },
            "Leo": {
                "Aries": "9/10",
                "Taurus": "6/10",
                "Gemini": "7/10",
                "Cancer": "6/10",
                "Leo": "7/10",
                "Virgo": "6/10",
                "Libra": "8/10",
                "Scorpio": "6/10",
                "Sagittarius": "9/10",
                "Capricorn": "6/10",
                "Aquarius": "8/10",
                "Pisces": "7/10"
            },
            "Virgo": {
                "Aries": "5/10",
                "Taurus": "9/10",
                "Gemini": "6/10",
                "Cancer": "7/10",
                "Leo": "6/10",
                "Virgo": "7/10",
                "Libra": "6/10",
                "Scorpio": "7/10",
                "Sagittarius": "6/10",
                "Capricorn": "9/10",
                "Aquarius": "6/10",
                "Pisces": "8/10"
            },
            "Libra": {
                "Aries": "8/10",
                "Taurus": "5/10",
                "Gemini": "9/10",
                "Cancer": "6/10",
                "Leo": "8/10",
                "Virgo": "6/10",
                "Libra": "8/10",
                "Scorpio": "6/10",
                "Sagittarius": "8/10",
                "Capricorn": "5/10",
                "Aquarius": "9/10",
                "Pisces": "7/10"
            },
            "Scorpio": {
                "Aries": "5/10",
                "Taurus": "8/10",
                "Gemini": "6/10",
                "Cancer": "9/10",
                "Leo": "6/10",
                "Virgo": "7/10",
                "Libra": "6/10",
                "Scorpio": "8/10",
                "Sagittarius": "6/10",
                "Capricorn": "7/10",
                "Aquarius": "5/10",
                "Pisces": "9/10"
            },
            "Sagittarius": {
                "Aries": "9/10",
                "Taurus": "5/10",
                "Gemini": "8/10",
                "Cancer": "5/10",
                "Leo": "9/10",
                "Virgo": "6/10",
                "Libra": "8/10",
                "Scorpio": "6/10",
                "Sagittarius": "8/10",
                "Capricorn": "6/10",
                "Aquarius": "8/10",
                "Pisces": "6/10"
            },
            "Capricorn": {
                "Aries": "6/10",
                "Taurus": "9/10",
                "Gemini": "4/10",
                "Cancer": "9/10",
                "Leo": "6/10",
                "Virgo": "9/10",
                "Libra": "5/10",
                "Scorpio": "7/10",
                "Sagittarius": "6/10",
                "Capricorn": "8/10",
                "Aquarius": "7/10",
                "Pisces": "7/10"
            },
            "Aquarius": {
                "Aries": "8/10",
                "Taurus": "4/10",
                "Gemini": "9/10",
                "Cancer": "4/10",
                "Leo": "8/10",
                "Virgo": "6/10",
                "Libra": "9/10",
                "Scorpio": "5/10",
                "Sagittarius": "8/10",
                "Capricorn": "7/10",
                "Aquarius": "8/10",
                "Pisces": "6/10"
            },
            "Pisces": {
                "Aries": "7/10",
                "Taurus": "7/10",
                "Gemini": "6/10",
                "Cancer": "9/10",
                "Leo": "7/10",
                "Virgo": "8/10",
                "Libra": "7/10",
                "Scorpio": "9/10",
                "Sagittarius": "6/10",
                "Capricorn": "7/10",
                "Aquarius": "6/10",
                "Pisces": "8/10"
            }
        };
        function getMatchScore(zodiacSign, zodiac2) {
            // check if both signs exist in the compatibility table
            if (compatibilityList[zodiacSign] && compatibilityList[zodiacSign][zodiac2]) {
                const score = compatibilityList[zodiacSign][zodiac2];
                return score;
            }
            else {
                return "No data available";
            }
        }

        const compatibility = getMatchScore(zodiacSign, zodiac2);

        // calculate age of person 2
        const birthDate2 = new Date(year2, month2 - 1, day2);
        const age2 = today.getFullYear() - birthDate2.getFullYear();
        const ageAdjustment2 = today < new Date(today.getFullYear(), birthDate2.getMonth(), birthDate2.getDate()) ? -1 : 0;
        const currentAge2 = age2 + ageAdjustment2;

        // calculate days until next birthday of person 2
        const nextBirthday2 = new Date(today.getFullYear(), birthDate2.getMonth(), birthDate2.getDate());
        if (today > nextBirthday2) nextBirthday2.setFullYear(today.getFullYear() + 1);
        const daysToBirthday2 = Math.ceil((nextBirthday2 - today) / (1000 * 60 * 60 * 24));

        // calculate age difference between person 1 and person 2
        const ageDifference = currentAge - currentAge2;

        // call getCompatibility function
        getCompatibility(zodiacSign, zodiac2, compatibility);

        // calculate age difference in days between person 1 and person 2
        const ageDifferenceDays = Math.floor((birthDate - birthDate2) / (1000 * 60 * 60 * 24));

        // Display compatibility results
        document.getElementById("compatibility-results").style.display = "block";
        document.getElementById("compatibility-results").innerText = `Their Zodiac Sign: ${zodiac2}\nCompatibility: ${compatibility}
        Age: ${currentAge2} years old
        Age Difference: ${ageDifference} years (${ageDifferenceDays} days)
        Days until next birthday: ${daysToBirthday2} days`;

        // Display compatibility details
        const compatibilityDetails = document.getElementById("compatibility-details");
        const zodiacImage = document.getElementById("zodiac-image");
        const zodiacImage2 = document.getElementById("zodiac-image-2");
        zodiacImage.src = `https://www.horoscope.com/images-US/signs/${zodiacSign}.svg`;
        zodiacImage2.src = `https://www.horoscope.com/images-US/signs/${zodiac2}.svg`;

    });

    // fetch Couples compatibility function
    function getCompatibility(zodiac, zodiac2, compatibility) {
        // Define zodiac sign as numbers
        const zodiacMap = {
            Aries: 0,
            Taurus: 1,
            Gemini: 2,
            Cancer: 3,
            Leo: 4,
            Virgo: 5,
            Libra: 6,
            Scorpio: 7,
            Sagittarius: 8,
            Capricorn: 9,
            Aquarius: 10,
            Pisces: 11
        };

        // Translate zodiac sign to number
        const zodiacNumber = zodiacMap[zodiac];
        const zodiac2Number = zodiacMap[zodiac2];

        // Ensure both zodiac signs exist in the map
        if (zodiacNumber !== undefined && zodiac2Number !== undefined) {
            
            // get zodiac-image element and change the image
            
            const zodiacImage2 = document.getElementById("zodiac-image-2");
            
            zodiacImage2.src = `https://www.horoscope.com/images-US/signs/${zodiac2}.svg`;
            // get id="zodiac_signs" and change the text
            const zodiacSignHTML = document.getElementById("zodiac_signs");
            zodiacSignHTML.textContent = `${zodiac} and ${zodiac2}`;
            // get id="match-score" and change the text
            const matchScoreHTML = document.getElementById("match-score");
            matchScoreHTML.textContent = `Match Score: ${compatibility}`;

            // split compatibility into two parts
            const compatibilityParts = compatibility.split("/");
            // take the first part of the compatibility
            const compatibilityPart1 = compatibilityParts[0];
            // get id="zodiac-score-image" and change the image
            const zodiacScoreImage = document.getElementById("zodiac-score-image");
            zodiacScoreImage.src = `https://www.horoscope.com/images-US/games/game-lovecompat-score-${compatibilityPart1}.svg`;

        } else {
            console.error('Invalid zodiac signs provided.');
        }
    }

    async function fetchFamousPerson(day, month) {
        try {
            const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${month}/${day}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Get the first five pages from the response
            const famousPerson = data.births.slice(20, 25).map(person => ({
                title: person.pages[0].titles.normalized,
                description: person.pages[0].description,
                thumbnail: person.pages[0].thumbnail ? person.pages[0].thumbnail.source : 'No image available'
            }));

            // Create and display the HTML for each person
            let famousPersonHTML = famousPerson.map(famousPerson => `
                <div class="card">
                    <div class="card-header">
                        <img src="${famousPerson.thumbnail}" alt="${famousPerson.title}" class="circle-img">
                    </div>
                    <div class="card-body">
                        <h3>${famousPerson.title}</h3>
                        <p>${famousPerson.description}</p>
                    </div>
                </div>
            `).join('');

            document.getElementById("famous-people").innerHTML = `
            <h2>Famous Persons Born on ${day}/${month}</h2>
            <div class="card-container">${famousPersonHTML}</div>`;

        } catch (error) {
            console.error("Error fetching historical events:", error);
            document.getElementById("famous-people").innerHTML += `<br>Error fetching data. Please try again later.`;
        }
    }

    fetchFamousPerson(day, month);

});




function getZodiacSign(day, month) {
    const zodiacSigns = [
        { sign: "Capricorn", start: "01-01", end: "01-19" },
        { sign: "Aquarius", start: "01-20", end: "02-18" },
        { sign: "Pisces", start: "02-19", end: "03-20" },
        { sign: "Aries", start: "03-21", end: "04-19" },
        { sign: "Taurus", start: "04-20", end: "05-20" },
        { sign: "Gemini", start: "05-21", end: "06-20" },
        { sign: "Cancer", start: "06-21", end: "07-22" },
        { sign: "Leo", start: "07-23", end: "08-22" },
        { sign: "Virgo", start: "08-23", end: "09-22" },
        { sign: "Libra", start: "09-23", end: "10-22" },
        { sign: "Scorpio", start: "10-23", end: "11-21" },
        { sign: "Sagittarius", start: "11-22", end: "12-21" },
        { sign: "Capricorn", start: "12-22", end: "12-31" }
    ];
    const date = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    for (const zodiac of zodiacSigns) {
        if (date >= zodiac.start && date <= zodiac.end) {
            return zodiac.sign;
        }
    }
    return null; // Default return in case of no match
}


function getBirthstone(month) {
    const birthstones = [
        "Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Alexandrite",
        "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise", "Tanzanite"
    ];
    return birthstones[month - 1];
}
