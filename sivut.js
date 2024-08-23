document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const nextButtons = document.querySelectorAll('.next-button');
    const prevButtons = document.querySelectorAll('.prev-button');
    const contactForm = document.querySelector('#yhteystiedot-screen');
    const backToStartButton = document.querySelector('.back-to-start-button');
    let currentScreenIndex = 0;

    // Näyttää vain nykyisen näytön alussa
    screens.forEach((screen, index) => {
        if (index !== currentScreenIndex) {
            screen.classList.add('inactive');
        } else {
            screen.classList.add('active');
        }
    });

    // Jatka-painikkeet
    nextButtons.forEach((button) => {
        button.addEventListener('click', () => {
            goToNextScreen();
        });
    });

    // Edellinen-painikkeet
    prevButtons.forEach((button) => {
        button.addEventListener('click', () => {
            goToPreviousScreen();
        });
    });

    // Lähetä-painikkeen käsittely lomakkeen lähetyksen yhteydessä
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Haetaan kenttien arvot ensimmäisestä näytöstä
        let autovakuutusInputs = document.querySelectorAll('#autovakuutus-container input');
        let kotivakuutusInputs = document.querySelectorAll('#kotivakuutus-container input');
        let henkilovakuutusInputs = document.querySelectorAll('#henkilovakuutus-container input');
        let lemmikkivakuutusInputs = document.querySelectorAll('#lemmikkivakuutus-container input');
        
        // Muodostetaan taulukot arvoista, muutetaan arvot true/false
        let autovakuutus = formatCheckboxData(getCheckboxValues(autovakuutusInputs));
        let kotivakuutus = formatCheckboxData(getCheckboxValues(kotivakuutusInputs));
        let henkilovakuutus = formatCheckboxData(getCheckboxValues(henkilovakuutusInputs));
        let lemmikkivakuutus = formatCheckboxData(getCheckboxValues(lemmikkivakuutusInputs));

        let email = document.getElementById('email').value;
        let tele = document.getElementById('tele').value;

        // Luodaan objekti, joka sisältää lomakkeen datan
        let formData = {
            email: email,
            tele: tele,
            autovakuutus: autovakuutus,
            kotivakuutus: kotivakuutus,
            henkilovakuutus: henkilovakuutus,
            lemmikkivakuutus: lemmikkivakuutus
        };

        // Muodostetaan lähetettävät tiedot
        let formattedData = JSON.stringify(formData, null, 2); // Kauniisti muotoiltu JSON

        // Lähetetään tiedot palvelimelle
        fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formattedData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            // Siirrytään kolmanteen näyttöön
            goToNextScreen();
            contactForm.reset(); // Tyhjennetään lomake
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Tapahtui virhe viestin lähetyksessä.');
        });

        console.log(formData);
    });

    // Funktio, joka tarkistaa checkboxien arvot ja palauttaa objekti
    function getCheckboxValues(checkboxes) {
        let values = {};
        checkboxes.forEach(checkbox => {
            values[checkbox.id] = checkbox.checked; // Palautetaan true/false riippuen valinnasta
        });
        return values;
    }

    // Funktio muuttaa checkbox-objektin luettavaksi merkkijonoksi
    function formatCheckboxData(data) {
        return Object.entries(data).map(([key, value]) => ({
            id: key,
            checked: value ? 'true' : 'false'
        }));
    }

    // Funktio siirtymiseen seuraavaan näyttöön
    function goToNextScreen() {
        const currentScreen = screens[currentScreenIndex];
        const nextScreen = screens[currentScreenIndex + 1];

        if (nextScreen) {
            currentScreen.classList.remove('active');
            currentScreen.classList.add('inactive');
            nextScreen.classList.remove('inactive');
            nextScreen.classList.add('active');
            currentScreenIndex++;
        }
    }

    // Funktio siirtymiseen edelliseen näyttöön
    function goToPreviousScreen() {
        const currentScreen = screens[currentScreenIndex];
        const prevScreen = screens[currentScreenIndex - 1];

        if (prevScreen) {
            currentScreen.classList.remove('active');
            currentScreen.classList.add('inactive');
            prevScreen.classList.remove('inactive');
            prevScreen.classList.add('active');
            currentScreenIndex--;
        }
    }

    // Funktio palata alkuun ja ladata sivu uudelleen
    function goToStartScreen() {
        location.reload(); // Lataa sivu uudelleen
    }

    // Takaisin alkuun -painike kolmannella näytöllä
    if (backToStartButton) {
        backToStartButton.addEventListener('click', function() {
            goToStartScreen();
        });
    }
});
