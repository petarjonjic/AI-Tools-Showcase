document.addEventListener("DOMContentLoaded", () => {

    const obrazac1 = document.getElementById("obrazac-1");
    const obrazac2 = document.getElementById("obrazac-2");

    const sveForme = [obrazac1, obrazac2];

    sveForme.forEach(forma => {
        if (!forma) return;

        forma.addEventListener("submit", (e) => {
            let ispravno = true;

            const polja = forma.querySelectorAll("input, textarea, select");
            const obaveznaPolja = forma.querySelectorAll("[required]");


            let prazno = true;

            obaveznaPolja.forEach(polje => {
                const tip = polje.type;

                if (
                    (tip === "checkbox" && polje.checked) ||
                    (tip === "radio" && forma.querySelector(`input[name="${polje.name}"]:checked`)) ||
                    (tip !== "checkbox" && tip !== "radio" && polje.value.trim() !== "")
                ) {
                    prazno = false;
                }
            });

            polja.forEach(p => p.classList.remove("greska"));

            if (prazno) {

                alert("Obrazac je prazan. Molimo ispunite barem jedno obavezno polje.");
                ispravno = false;
            }


            polja.forEach(polje => {

                const vrijednost = polje.value.trim();
                const tip = polje.type;

                if (polje.hasAttribute("required") && vrijednost === "" && tip !== "file") {

                    ispravno = false;
                    polje.classList.add("greska");
                    return;
                }


                if (polje.tagName === "TEXTAREA") {

                    if (vrijednost.length < 200 || vrijednost.length > 1000 ||
                        /\$|€/.test(vrijednost) ||
                        !/(https?:\/\/)[\w\-\.]+\.(com|hr|org|net|ai)/i.test(vrijednost)) {

                        ispravno = false;
                        polje.classList.add("greska");
                        return;
                    }
                }


                if (tip === "number") {

                    if (!/^\d+(\.\d{1,2})?$/.test(vrijednost)) {

                        ispravno = false;
                        polje.classList.add("greska");
                        return;
                    }
                }
            });

            const uvjeti = forma.querySelector("input[name='uvjeti']");
            if (uvjeti && !uvjeti.checked) {
                ispravno = false;
                uvjeti.classList.add("greska");
            }



            const spolOdabrano = forma.querySelector("input[name='spol']:checked");
            const spolUnosi = forma.querySelectorAll("input[name='spol']");

            if (!spolOdabrano && spolUnosi.length > 0) {

                ispravno = false;

                spolUnosi.forEach(unos => {

                    const krug = forma.querySelector(`label[for="${unos.id}"] .tocka`);
                    if (krug) krug.classList.add("greska");
                });
            }

            if (!ispravno) {

                e.preventDefault();
                alert("Molimo ispravite označena polja prije slanja obrasca.");
            }
        });
    });
});
