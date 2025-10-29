module.exports = function (RED) {
    function ExtractTemperatureNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.name = config.name;
        node.source = config.source || "auto";

        node.on('input', function (msg, send, done) {
            try {
                // Determina la sorgente dati
                var data = null;
                if (node.source === "msg.data") {
                    data = msg.data;
                } else if (node.source === "msg.payload") {
                    data = msg.payload;
                } else {
                    data = msg.data || (msg.payload && msg.payload.data) || msg.payload;
                }

                // Estrai attributi
                var currentTemp = null;
                var setpoint = null;

                if (data && typeof data === 'object') {
                    var attrs = data.attributes || data;
                    if (attrs && typeof attrs === 'object') {
                        if (attrs.current_temperature !== undefined) currentTemp = attrs.current_temperature;
                        if (attrs.temperature !== undefined) setpoint = attrs.temperature;
                    }
                }

                // Prepara messaggi per le due uscite (cloniamo per sicurezza)
                var out1 = RED.util.cloneMessage(msg);
                var out2 = RED.util.cloneMessage(msg);

                out1.payload = currentTemp;
                out1.topic = out1.topic || 'current_temperature';
                out2.payload = setpoint;
                out2.topic = out2.topic || 'setpoint';

                // invia sempre due output (null se non trovato)
                if (send) {
                    send([out1, out2]);
                } else {
                    node.send([out1, out2]);
                }

                node.status({
                    fill: "green",
                    shape: "dot",
                    text: (currentTemp !== null ? "ok" : "no-temp")
                });
                if (done) done();
            } catch (err) {
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: "error"
                });
                node.error("Error extracting temperature: " + err.message, msg);
                if (done) done(err);
            }
        });

        node.on('close', function () {
            node.status({});
        });
    }
    RED.nodes.registerType("extract-temperature", ExtractTemperatureNode);
}