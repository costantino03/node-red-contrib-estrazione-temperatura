module.exports = function (RED) {
    function ExtractEventStateNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.name = config.name;
        node.passThrough = !!config.passThrough;

        node.on('input', function (msg, send, done) {
            try {
                // Trova i dati dell'evento (compatibile con HA events)
                var data = msg.data || (msg.payload && msg.payload.data) || msg.payload;

                var newState = null;
                if (data && typeof data === 'object' && data.new_state !== undefined) {
                    newState = data.new_state;
                } else {
                    newState = data;
                }

                // Messaggio 1: msg con data aggiornato
                var out1 = RED.util.cloneMessage(msg);
                out1.data = newState;
                out1.payload = newState;
                out1.topic = out1.topic || 'new_state';

                // Messaggio 2: originale (opzionale)
                var out2 = null;
                if (node.passThrough) {
                    out2 = RED.util.cloneMessage(msg);
                }

                if (send) {
                    send([out1, out2]);
                } else {
                    node.send([out1, out2]);
                }

                node.status({
                    fill: "green",
                    shape: "dot",
                    text: "ok"
                });
                if (done) done();
            } catch (err) {
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: "error"
                });
                node.error("Error extracting event state: " + err.message, msg);
                if (done) done(err);
            }
        });

        node.on('close', function () {
            node.status({});
        });
    }
    RED.nodes.registerType("extract-event-state", ExtractEventStateNode);
}