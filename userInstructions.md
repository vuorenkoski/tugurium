# Tugurium - käyttöohjeet

## Käyttö selaimella

Tugurium kerää ja visualisoi dataa käyttäjän sensoreista, kytkimistä ja kameroista.

Sensorit voivat mitata esimerkiksi lämpötiloja, liikettä, tuulennopeutta ja sademääriä. Sensorit lähettävät mittaustuloksia serverille graphql api:n kautta. Sensorien lähettämä tallennetaan pysyvästi.

Kytkimet voivat olla suoraan integroitu serveriin, tai jos ne ovat erillisiä ne voivat pollata uutta kytkimen asentoa serveriltä tasaisin väliajoin.

Kamerat lähettävät kuvan serverille jpg muodossa. Serverillä on tallennettuna vain viimeiseksi lähetetty kuva.

### Kirjautuminen

Sovellukseen tulee kirjautua valmiiksi luodolla käyttäjätunnuksella ja salasanalla. Admin käyttäjällä on laajemmat oikeudet kuin tavallisilla käyttäjillä. Admin käyttäjän oletussalasana asetetaan servirin asennuksen yhteydessä.

Kirjautumisen jälkeen sovelluksen yläpalkista käyttäjää voi valita haluamansa sivun.

### Lämpötilat nyt

Kirjautumisen jälkeen aukeaa automaattisesti välilehti ’Lämpötilat nyt’. Tässä listassa näkyvät kaikki asennut sensorit, niiden viimeisin mittaustulos ja tieto koska tämä mittaus on tehty.

### Aikasarjat

Tällä välilehdellä käyttäjä voi tutkia sensorien mittaustuloksia määrittelemällään aikaperiodilla. Aikaperiodi valitaan alasvetovalikosta ’ ajanjakso’.

Käyttäjä voi myös valita miten mittauspisteitä yhdistetään. Oletusarvona on ’tunti’, joka tarkoittaa sitä, että saman tunnin aikana tulleet useammat mittaustulokset yhdistetään yhdeksi mittaukseksi. Vaihtoehto ’päivä’ on vastaava, mutta kaikki yhden vuorokauden mittauspisteet niputetaan yhdeksi. Lisäksi käyttäjä voi valita että yhdistämistä ei tehdä ollenkaan. Tämä voi kuitenkin potentiaalisesti tuoda sovellukseen huomattavaa hitautta jos sensorista tulee mittaustuloksia tiheällä frekvenssillä.

Lopuksi käyttäjä voi valita yhden tai useamman sensorin, joiden mittaukset otetaan mukaan kuvaajaan. Kun sensorit on valittu, näytetään käyttäjälle graafi mittaustuloksista määritellyllä ajanjaksolla.

Graafia voi zoomata hiiren rullapainikkeella. Zoomattu osuus koko ajanjaksosta näkyy graafin alapuolella, jonka harmaa alue on zoomattuna. Zoomattua kohtaa voi muuttaa tarttumalla hiirellä harmaaseen kohtaan ja liikuttelemalla sitä. Yksittäisten mittauspisteiden arvo tulee näkyviin kun hiiren siirtää kuvaajan kyseisen kohdan päälle.

### Vuosivertailu

Tällä välilehdellä käyttäjä voi verrata sensoreiden mittaustuloksia eri vuosien välillä. Ensimmäiseksi käyttäjän tulee valita sensori, jonka mittauksia halutaan tarkastella. Tämän jälkeen käyttäjä valitsee yhdistetäänkö tulokset päivittäin vai kuukausittain. Yhden vuorokauden/kuukauden mittaustulokset yhdistetään siis yhdeksi mittauspisteeksi. Lopuksi käyttäjä valitsee yhden tai useamman tarkasteltavan vuoden. Käyttäjä voi myös valita kuvaajaan kaikkien vuosien keskiarvon.

Graafi on interaktiivinen kuten ’Aikasarjat’ kohdassa esiteltiin.

### Kamerat

Välilehdellä näkyvät kaikki serveriin ytektyt kamerat ja niiden lähettämä viimeisin kuva ja sen aikaleima. Kun kuvaa painaa, tulee näkyviin kuva täydellä resoluutiolla. Täst pääse takaisin painamalla 'takaisin' nappia.

### Kytkimet

Välilehdellä luetellaan kaikki serverin kytkimet. Siinä näkyy myös kytkimen tila ja viimeisen aikaleima. Kytkimen tilaa voi vaihtaa painammalla sinistä/harmaata komento -napia. Kytkimen tila päivittyy kun kytkin on tosiasiassa vaihtanut tilaansa.

Komentojen antaminen on mahdollista vain admin käyttäjälle. Tavalliselle käyttäjälle ei näy kommennon antamisen painikkeita.

### Tilastoja

Välilehti näyttää luettelon kaisista sensoreista, niiden mittauspisteiden lukumäristä ja päivästä jollein ensimmäinen mittaus on tallennettu.

Lisäksi välilehdellä voi valita sensorin, jonka osalta näytetään graafi mittauspisteiden lukumäärästä vuorokaudessa. Graafi on interaktiivinen kuten ’Aikasarjat’ kohdassa esiteltiin.

### Asetukset

Välilehdellä voi vaihtaa käyttäjät vaihtaa salasanansa. Kaikki käyttäjät neäkevän myös linstan käyttäjistä, sensoreista, kameroista ja kytkimistä. Admin käyttäjä voi myös lisätä/päivittää ja poistaa näitä (admin käyttäjää ei voi poistaa). Admin käyttäjä näkee myös tokenin jonka avulla sensorit, kytkimet ja kamerat tunnistautuvat lähettäessään tai kysellessään dataa.

Poistaminen tapahtuu painamalla punaista 'poista tekstiä'. Ennen poistoa sovellus kysyy varmistusta popup ikkunassa. Kun sensori poistetaan, niin samalla poistetaan kaikki sen tuotttamat mittauspisteet.

Päivittäminen tapahtuu painamalla päivitystekstiä. Tällöin tulee näkyviin popup ikkuna, jossa tietoja voi päivittää. Lopuksi painetaan 'päivitä tiedot' nappia. Lisääminen tapahtuu vastaavalla tavalla painamalla 'lisää uuusi' nappia.

Koontimetodilla tarkoitetaan menetelmää jossa mittauspisteitä yhdistetään tunneittain, päivittäin tai kuukausittain. Tässä on kaksi vaihtoehtoa summa (SUM) tai keskiarvo (AVG). Keskiarvo soveltuu esimerkiksi lämpötiloille, jossa päivän lämpötila on päivän kaikkien mittauspisteiden keskiarvo. Summa soveltuu esimerkiksi sademäärälle: vuorokauden sademäärä on tuntikohtaisten sademäärien summa.

## Käyttö mobiilissa

Sovellusta voi käyttää mobiiliversiossa vastaavalla tavalla kuin selaimessakin. Tähän on kuitenkin muutamia poikkeuksia:

- Käyttäjän tulee kirjatuessa syöttää myös käytettävän servirin nimi. Serverin nimi säilyy sovelluksen muistissa myös kirjautumisen jälkeen.
- Navigaatio tulee näkyviin painamalla menu-logoa sovelluksen oikeassa yläkulmassa.
- Graafeja ei voi zoomata eikä niissä näy yksittäisten datapisteiden tiedot.
- Kun kameran koko kuva on valittu, pääsee tästä takaisin panamalla kuvaa.
- Ssetuksista on käytössä vain salanan vaihto.
