```markdown
# node-red-contrib-estrazione-temperatura

Piccola libreria Node-RED per gestire ed estrarre dati da entità di tipo "climate" (Home Assistant).

## Contenuto
La libreria fornisce due nodi semplici e mirati:

- `extract-event-state`  
  - Scopo: riceve un evento (es. payload degli eventi di Home Assistant), estrae `new_state` (se presente) o usa il payload direttamente e lo mette in `msg.data` e `msg.payload`.  
  - Uscite:  
    - Uscita 1: stato estratto (in payload).  
    - Uscita 2: messaggio originale (opzionale, attivabile tramite la proprietà `passThrough`).

- `extract-temperature`  
  - Scopo: riceve un oggetto stato (o il wrapper evento) e estrae i campi `attributes.current_temperature` (uscita 1) e `attributes.temperature` (setpoint, uscita 2). Se i valori non sono presenti, vengono comunque inviati messaggi con `payload: null`.  
  - Uscite:  
    - Uscita 1: `current_temperature` (payload)  
    - Uscita 2: `temperature` (setpoint, payload)

Questi nodi sono pensati per normalizzare gli eventi/stati delle entità `climate` prima di ulteriori elaborazioni (logica, storage, dashboard, ecc.).

## Installazione locale (per test)
1. Scarica o copia la cartella del pacchetto in una posizione sulla tua macchina, ad esempio `~/projects/node-red-contrib-estrazione-temperatura`.
2. Dal folder principale di Node-RED (di solito `~/.node-red`) esegui:
   - npm install /percorso/alla/cartella/node-red-contrib-estrazione-temperatura
   - oppure installa direttamente dallo zip del branch:
     npm install https://github.com/costantino03/node-red-contrib-estrazione-temperatura/archive/refs/heads/feat/estrazione-temperatura.zip
3. Riavvia Node-RED.

Per pubblicare su npm: aggiorna `package.json` con il campo `repository` e usa `npm publish` (assicurati che il nome del pacchetto sia disponibile e che tu abbia eseguito l'accesso con il tuo account npm).

## Esempio rapido di test
1. Crea un nodo Inject (tipo JSON) con questo payload:
```json
{
  "data": {
    "new_state": {
      "attributes": {
        "current_temperature": 21.5,
        "temperature": 22
      }
    }
  }
}
```
2. Collega l'Inject a `extract-event-state` (imposta `passThrough: true` se vuoi vedere anche il messaggio originale).
3. Collega l'uscita 1 di `extract-event-state` a `extract-temperature`.
4. Collega due Debug ai due output di `extract-temperature`:
   - Vedrai `payload: 21.5` (current_temperature) e `payload: 22` (setpoint).

## Configurazione nodi
- `extract-event-state`
  - passThrough: boolean — se true, invia il messaggio originale sulla seconda uscita.
- `extract-temperature`
  - source: `auto` | `msg.data` | `msg.payload` — determina dove cercare i dati (default `auto`).

Nota: i nodi sono volutamente minimal; se vuoi opzioni aggiuntive (nome campo attributes personalizzabile, parsing di stringhe numeriche, gestione unità), posso aggiungerle.

## Troubleshooting
- Se non vedi i nodi in Node-RED dopo l'installazione, verifica di aver riavviato Node-RED e che non ci siano errori nel log (controlla `~/.node-red/logs` o i log del servizio).
- Se i valori non compaiono, controlla la struttura del payload in ingresso (usa un nodo Debug completo per ispezionare `msg`).

## Licenza
MIT — vedi il file `LICENSE` nel repository.

## Autore
costantino03
```
