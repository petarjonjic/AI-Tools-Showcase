const fs = require("fs");
const path = require("path");

class AlatiServis {

    constructor() {

        this.putanja = path.join(__dirname, "../../resursi/alati.csv");
    }

    dohvatiSve(kategorija = null) {

        const podaci = fs.readFileSync(this.putanja, "utf-8")
            .split("\n")
            .filter(r => r.trim() !== "");

        const alati = podaci.map(red => {

            const [naziv, opis, kategorijaAlata, url, godina] = red.split(";");

            return { naziv, opis, kategorija: kategorijaAlata, url, godina };
        });

        if (!kategorija || kategorija.trim() === "") return alati;

        return alati.filter(a =>

            a.kategorija.toLowerCase() === kategorija.toLowerCase()
        );
    }

    dohvatiPoNazivu(nazivAlata) {

        return this.dohvatiSve().find(

            a => a.naziv.toLowerCase() === nazivAlata.toLowerCase()

        ) || null;
    }

    ukloniPoNazivu(nazivAlata) {

        const svi = this.dohvatiSve();

        const filtrirani = svi.filter(

            a => a.naziv !== nazivAlata
        );

        const noviSadrzaj = filtrirani.map(

            a => [a.naziv, a.opis, a.kategorija, a.url, a.godina].join(";")

        ).join("\n");

        fs.writeFileSync(this.putanja, noviSadrzaj + "\n", "utf-8");
    }

    dodajNovi(alat) {

        const red = [alat.naziv, alat.opis, alat.kategorija, alat.url, alat.godina].join(";");

        fs.appendFileSync(this.putanja, red + "\n", "utf-8");
    }

    azurirajPostojeci(nazivAlata, noviAlat) {

        const svi = this.dohvatiSve();

        const noviSadrzaj = svi.map(

            a => {

                if (a.naziv === nazivAlata) {

                    return [noviAlat.naziv, noviAlat.opis, noviAlat.kategorija, noviAlat.url, noviAlat.godina].join(";");
                }
                else {

                    return [a.naziv, a.opis, a.kategorija, a.url, a.godina].join(";");
                }

            }).join("\n");

        fs.writeFileSync(this.putanja, noviSadrzaj + "\n", "utf-8");
    }
}

module.exports = new AlatiServis();