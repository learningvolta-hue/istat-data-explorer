# ISTAT Data Explorer

Prototipo web interattivo in italiano. Apri `index.html` con un browser moderno; non richiede installazione. La cartella contiene anche una prima configurazione per Netlify.

## Funzioni incluse

- Navigazione tra panoramica, catalogo, query builder, viste salvate, profilo e area amministrativa.
- Ricerca e filtri nel catalogo dimostrativo e consultazione dei metadati.
- Query guidata con selezione di territorio, intervallo temporale e tipo di vista.
- Salvataggio, riapertura, duplicazione ed eliminazione delle viste nel browser corrente (`localStorage`).
- Esportazione XLSX (se disponibile la libreria caricata da CDN), report tramite stampa PDF del browser e fallback CSV.
- Layout responsive con navigazione da tastiera, alternative tabellari e messaggi di stato.

## Limiti della demo

I valori, i conteggi, gli account e gli indicatori mostrati sono dimostrativi e non costituiscono dati ufficiali ISTAT. Le viste rimangono nel browser locale. Registrazione, verifica email, recupero credenziali, ruoli reali, pagamenti, amministrazione, database e cancellazione dell'account richiedono un backend e non sono implementati nel prototipo.

La documentazione ufficiale ISTAT descrive l'accesso machine-to-machine tramite web service SDMX: [Web Services SDMX](https://www.istat.it/classificazioni-e-strumenti/web-services-sdmx/). È presente una prima funzione Netlify che inoltra in modo controllato le richieste di metadati, interrompe le attese troppo lunghe e usa la cache condivisa Netlify per limitare le richieste ripetute. Il limite per visitatore è impostato a 4 richieste al minuto. ISTAT segnala 5 query al minuto per IP; il limite per visitatore e la cache non garantiscono da soli un tetto globale condiviso quando molte persone chiedono dati diversi nello stesso momento. Prima di aprire l'accesso pubblico va quindi collegata una coda condivisa lato backend e verificato il flusso ISTAT scelto.

Per pubblicare questa cartella su Netlify, il progetto va distribuito tramite Git oppure Netlify CLI, così viene pubblicata anche la funzione server. Il caricamento del solo file HTML non basta per attivare il backend.

Chart.js e SheetJS sono caricati da CDN: le visualizzazioni e l'esportazione Excel richiedono connettività. Se la libreria Excel non è disponibile, il pulsante esporta un CSV.
