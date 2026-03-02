const path = require("path");
const fs = require("fs");
const Alati = require("./js/server/obradaAlata.js");
const os = require("os");

const HOST = os.hostname();

let express;

if (process.platform === "linux") {
    express = require("/usr/lib/node_modules/express");
} else {
    express = require("C:/node_global/node_modules/express");
}

const server = express();

function dajPort(korime) {
    let port = 12222;
    if (process.platform === "linux") {
        const portovi = require("/var/www/OWT/2025/portovi.js");
        port = portovi[korime];
    }
    return port;
}

const port = dajPort("pjonjic23");
const putanja = __dirname;

console.log(putanja);

server.use(express.urlencoded({ extended: true }));

server.use(express.json());

server.use("/JSklijent", express.static(path.join(putanja, "js/klijent")));
server.use("/dizajn", express.static(path.join(putanja, "css")));
server.use("/resursi", express.static(path.join(putanja, "resursi")));


server.get("/", (zahtjev, odgovor) => {
    odgovor.redirect("/index.html");
});

server.get("/index.html", (zahtjev, odgovor) => {

    odgovor.sendFile(path.join(putanja, "html/index.html"));
});

server.get("/oAutoru.html", (zahtjev, odgovor) => {

    odgovor.sendFile(path.join(putanja, "html/oAutoru.html"));
});

server.get("/dokumentacija.html", (zahtjev, odgovor) => {

    odgovor.sendFile(path.join(putanja, "html/dokumentacija.html"));
});

server.get("/recenzija.html", (zahtjev, odgovor) => {

    odgovor.sendFile(path.join(putanja, "html/ostalo/recenzija.html"));
});

server.get("/katalog.html", (zahtjev, odgovor) => {

    odgovor.sendFile(path.join(putanja, "html/ostalo/katalog.html"));
});

server.get("/detalji.html", (zahtjev, odgovor) => {

    odgovor.sendFile(path.join(putanja, "html/ostalo/detalji.html"));
});

server.post("/obrazac", (zahtjev, odgovor) => {

    odgovor.send(`
    <!DOCTYPE html>
    <html lang="hr">
    <head>
      <meta charset="UTF-8">
      <title>Obrazac poslan</title>
    </head>
    <body>
      <h2>Obrazac je uspješno poslan!</h2>
      <a href="/index.html">⟵ Povratak na početnu stranicu</a>
    </body>
    </html>
  `);
});


server.get("/alati", (zahtjev, odgovor) => {
    const kategorija = zahtjev.query.kategorija;
    const alati = Alati.dohvatiSve(kategorija);

    let html = `
<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <title>Popis AI alata</title>
    <link rel="stylesheet" href="/dizajn/pjonjic23.css">
    <link rel="stylesheet" href="/dizajn/index.css">
</head>
<body class="alat-omotac">

    <h1>Popis AI alata</h1>

    <form method="GET" action="/alati" class="alat-obrazac">
        <label for="kategorija">Filtriraj po kategoriji:</label>
        <input type="text" name="kategorija" id="kategorija" value="${kategorija || ""}" />
        <button type="submit">Filtriraj</button>
    </form>

    <ul class="alat-lista">
`;

    let i = 1;
    alati.forEach(alat => {
        html += `
        <li>
            <strong>${i++}. ${alat.naziv}</strong> (${alat.godina}) – <em>${alat.kategorija}</em>
            <a href="/alati/detalji?naziv=${encodeURIComponent(alat.naziv)}">Detalji</a>
            <form method="POST" action="/alati/ukloni" class="u-retku">
                <input type="hidden" name="naziv" value="${alat.naziv}">
                <button type="submit">Ukloni</button>
            </form>
        </li>
        `;
    });

    html += `
    </ul>
    <p><a href="/index.html" class="povratak-link">← Povratak na početnu stranicu</a></p>
</body>
</html>
`;

    odgovor.send(html);
});



server.post("/alati/ukloni", (zahtjev, odgovor) => {

    const naziv = zahtjev.body.naziv;

    if (naziv) {

        Alati.ukloniPoNazivu(naziv);
    }

    odgovor.redirect("/alati");
});

server.get("/alati/detalji", (zahtjev, odgovor) => {
    const naziv = zahtjev.query.naziv;

    if (!naziv) {
        odgovor.status(400).send(`
            <!DOCTYPE html>
            <html lang="hr">
            <head>
                <meta charset="UTF-8">
                <title>Greška</title>
                <link rel="stylesheet" href="/dizajn/pjonjic23.css">
                <link rel="stylesheet" href="/dizajn/index.css">
            </head>
            <body class="alat-omotac">
                <h1>Greška</h1>
                <p>Nedostaje naziv alata!</p>
                <p><a href="/alati">Vrati se na popis alata</a></p>
            </body>
            </html>
        `);
        return;
    }

    const alat = Alati.dohvatiPoNazivu(naziv);

    if (!alat) {
        odgovor.status(404).send(`
            <!DOCTYPE html>
            <html lang="hr">
            <head>
                <meta charset="UTF-8">
                <title>Alat nije pronađen</title>
                <link rel="stylesheet" href="/dizajn/pjonjic23.css">
                <link rel="stylesheet" href="/dizajn/index.css">
            </head>
            <body class="alat-omotac">
                <h1>Traženi AI alat nije pronađen</h1>
                <p><a href="/alati">Vrati se na popis alata</a></p>
            </body>
            </html>
        `);
        return;
    }

    const html = `
    <!DOCTYPE html>
    <html lang="hr">
    <head>
        <meta charset="UTF-8">
        <title>Detalji AI alata</title>
        <link rel="stylesheet" href="/dizajn/pjonjic23.css">
        <link rel="stylesheet" href="/dizajn/index.css">
    </head>
    <body class="alat-omotac">
        <h1>Detalji AI alata</h1>
        <ul class="alat-lista">
            <li><strong>Naziv:</strong> ${alat.naziv}</li>
            <li><strong>Opis:</strong> ${alat.opis}</li>
            <li><strong>Kategorija:</strong> ${alat.kategorija}</li>
            <li><strong>URL:</strong> <a href="${alat.url}" target="_blank">${alat.url}</a></li>
            <li><strong>Godina pokretanja:</strong> ${alat.godina}</li>
        </ul>
        <p><a href="/alati" class="povratak-link">← Povratak na popis</a></p>
    </body>
    </html>
    `;

    odgovor.send(html);
});


server.get("/api/alati", (zahtjev, odgovor) => {

    const sviAlati = Alati.dohvatiSve();
    odgovor.status(200).json(sviAlati);
});

server.post("/api/alati", (zahtjev, odgovor) => {

    const { naziv, opis, kategorija, url, godina } = zahtjev.body;

    if (!naziv || !opis || !kategorija || !url || !godina) {

        odgovor.status(400).json({ "greska": "Neispravni ili nepotpuni podaci za alat." });
        return;
    }

    const noviAlat = { naziv, opis, kategorija, url, godina };

    Alati.dodajNovi(noviAlat);

    odgovor.status(201).json(noviAlat);
});

server.put("/api/alati", (zahtjev, odgovor) => {

    odgovor.status(405).json({ "greska": "Metoda nije dopuštena za popis alata." });
});

server.delete("/api/alati", (zahtjev, odgovor) => {

    odgovor.status(405).json({ "greska": "Metoda nije dopuštena za popis alata." });
});

server.get("/api/alati/:naziv", (zahtjev, odgovor) => {

    const naziv = zahtjev.params.naziv;
    const alat = Alati.dohvatiPoNazivu(naziv);

    if (!alat) {

        odgovor.status(404).json({ "greska": "AI alat s traženim nazivom nije pronađen." });
        return;
    }

    odgovor.status(200).json(alat);
});

server.post("/api/alati/:naziv", (zahtjev, odgovor) => {

    odgovor.status(405).json({ "greska": "Metoda nije dopuštena za specifični alat." });
});

server.put("/api/alati/:naziv", (zahtjev, odgovor) => {

    const naziv = zahtjev.params.naziv;

    const { naziv: noviNaziv, opis, kategorija, url, godina } = zahtjev.body;

    if (!noviNaziv || !opis || !kategorija || !url || !godina) {

        odgovor.status(400).json({ "greska": "Neispravni podaci za ažuriranje." });
        return;
    }

    const postojeci = Alati.dohvatiPoNazivu(naziv);

    if (!postojeci) {

        odgovor.status(404).json({ "greska": "AI alat s traženim nazivom nije pronađen za ažuriranje." });
        return;
    }

    const azuriran = { naziv: noviNaziv, opis, kategorija, url, godina };

    Alati.azurirajPostojeci(naziv, azuriran);

    odgovor.status(200).json(azuriran);
})

server.delete("/api/alati/:naziv", (zahtjev, odgovor) => {

    const naziv = zahtjev.params.naziv;

    const postojeci = Alati.dohvatiPoNazivu(naziv);

    if (!postojeci) {

        odgovor.status(404).json({ "greska": "AI alat s traženim nazivom nije pronađen za brisanje." });
        return;
    }

    Alati.ukloniPoNazivu(naziv);

    odgovor.status(204).send();
});

server.use((zahtjev, odgovor) => {

    odgovor.status(404).send(`
    <h1>Stranica ne postoji!</h1>
    <p><a href="/index.html">Vrati se na početnu stranicu</a></p>
  `);
});


server.listen(port, () => {
    console.log(`server je pokrenut na http://${process.platform === "linux" ? "spider.foi.hr" : "localhost"}:${port}`);
});