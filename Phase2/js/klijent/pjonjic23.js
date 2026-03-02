// ===============================KLIZAC - START===========================

document.addEventListener("DOMContentLoaded", () => {


    const klizac = document.querySelector("#slajdovi .unutra");


    if (klizac) {

        const strelicaLijevo = document.getElementById("pretStrelica");
        const strelicaDesno = document.getElementById("sljedStrelica");
        const oznake = document.querySelectorAll(".oznaka");
        const brojSlajdova = document.querySelectorAll(".slide").length;

        let trenutni = 0;
        let brojac;

        function prikaziSlajd(pozicija) {
            klizac.style.marginLeft = `-${pozicija * 100}%`;
            azurirajOznake(pozicija);
        }

        function azurirajOznake(pozicija) {
            oznake.forEach((oznaka, i) => {
                oznaka.classList.toggle("aktivna", i === pozicija);
            });
        }

        function sljedeciSlajd() {
            trenutni = (trenutni + 1) % brojSlajdova;
            prikaziSlajd(trenutni);
        }

        function prethodniSlajd() {
            trenutni = (trenutni - 1 + brojSlajdova) % brojSlajdova;
            prikaziSlajd(trenutni);
        }

        function resetirajTajmer() {
            clearInterval(brojac);
            brojac = setInterval(sljedeciSlajd, 5000);
        }

        prikaziSlajd(trenutni);
        brojac = setInterval(sljedeciSlajd, 5000);

        strelicaLijevo.addEventListener("click", () => {
            prethodniSlajd();
            resetirajTajmer();
        });

        strelicaDesno.addEventListener("click", () => {
            sljedeciSlajd();
            resetirajTajmer();
        });

        oznake.forEach((oznaka) => {
            oznaka.addEventListener("click", () => {
                trenutni = parseInt(oznaka.dataset.index);
                prikaziSlajd(trenutni);
                resetirajTajmer();
            });
        });
    }
});

// ===============================KLIZAC - END===========================

// ===============================O AUTORU - START===========================


document.addEventListener("DOMContentLoaded", () => {

    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.classList.add("lightbox");
    lightbox.style.display = "none";

    const zatvoriLightbox = document.createElement("span");
    zatvoriLightbox.classList.add("lightbox-zatvori");
    zatvoriLightbox.setAttribute("aria-label", "Zatvori prikaz");
    zatvoriLightbox.innerHTML = "&times;";

    const slika = document.createElement("img");
    slika.id = "lightbox-slika";
    slika.alt = "Povećana slika";

    lightbox.appendChild(zatvoriLightbox);
    lightbox.appendChild(slika);
    document.body.appendChild(lightbox);

    const slikeGalerije = document.querySelectorAll(".predmet-galerije img");

    slikeGalerije.forEach((slikaElement) => {

        slikaElement.addEventListener("click", (e) => {
            e.preventDefault();
            slika.src = slikaElement.src;
            lightbox.style.display = "flex";
        });
    });

    zatvoriLightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", (e) => {

        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });
});

// ===============================O AUTORU - END===========================

// ===============================DETALJI - START===========================


document.addEventListener("DOMContentLoaded", () => {

    const detaljiParagrafi = document.querySelectorAll(".detalji-p");

    detaljiParagrafi.forEach(paragraf => {
        const puniTekst = paragraf.textContent.trim();
        const rijeci = puniTekst.split(" ");

        if (rijeci.length > 6) {
            const skraceniTekst = rijeci.slice(0, 6).join(" ") + " ";

            const prikaziVise = document.createElement("a");
            prikaziVise.href = "#";
            prikaziVise.textContent = "...";
            prikaziVise.classList.add("det-prikazi-vise");
            prikaziVise.style.cursor = "pointer";

            const prikaziManje = document.createElement("a");
            prikaziManje.href = "#";
            prikaziManje.textContent = "Prikaži manje";
            prikaziManje.classList.add("det-prikazi-manje");
            prikaziManje.style.cursor = "pointer";


            paragraf.textContent = skraceniTekst;
            paragraf.appendChild(prikaziVise);


            prikaziVise.addEventListener("click", (e) => {
                e.preventDefault();
                paragraf.textContent = puniTekst;
                paragraf.appendChild(prikaziManje);
            });

            prikaziManje.addEventListener("click", (e) => {
                e.preventDefault();
                paragraf.textContent = skraceniTekst;
                paragraf.appendChild(prikaziVise);
            });
        }
    });

});

// ===============================DETALJI - END===========================


// ===============================LINK ACTIVE - START===========================


document.addEventListener("DOMContentLoaded", () => {

    const trenutniUrl = window.location.pathname.split("/").pop();
    const navigacijskePoveznice = document.querySelectorAll(".nav ul li a");

    navigacijskePoveznice.forEach(poveznica => {

        const href = poveznica.getAttribute("href").split("/").pop();

        if (href === trenutniUrl) {
            poveznica.classList.add("active");
        }
        else {
            poveznica.classList.remove("active");
        }
    });
});


// ===============================LINK ACTIVE - END===========================
