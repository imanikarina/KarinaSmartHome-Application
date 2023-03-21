export default {
  startConnect,
  startDisconnect,
  publishMessage
}

var client;

// Function for connect button on webpage
function startConnect(stamp) {
    // Credentials
    const clientID = "clientID - " + parseInt(Math.random() * 100);
    const host = "broker.mqtt-dashboard.com";   
    const port = "8000";  
    const userId  = "";  
    const passwordId = "";

    // Print connection message to log
    document.getElementById("Log").innerHTML += "Connecting to " + host + " on port " + port +"<br>";
    document.getElementById("Log").innerHTML += "Using the client Id " + clientID +"<br>";

    // Create client and connect
    client = new Paho.MQTT.Client(host, Number(port), clientID);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
        onSuccess: () => onConnect(stamp),
        userName: userId,
        password: passwordId
    });
}

// Function when connection succeeds
function onConnect(stamp) {
    // Subscribe to "KarinaSmartHome/out"
    document.getElementById("Log").innerHTML += "Subscribing to topic [KarinaSmartHome/out].<br>";
    client.subscribe("KarinaSmartHome/out", {
        onSuccess: () => {
            document.getElementById("Log").innerHTML += "Subscribed.<br>";

            // Send server time and timer value as message
            // X000000-0000-0000-0000-0000
            console.log(stamp);
            publishMessage("X" + stamp);
        }
    });
}

function onConnectionLost(responseObject) {
    // Write error message
    document.getElementById("Log").innerHTML += "Disconnected.<br>";
    // if (responseObject != 0) {
    //     document.getElementById("Log").innerHTML += "ERROR: " + responseObject.errorMessage + "<br>";
    // }

    // Click disconnect button
    document.getElementById('ConnectButton').click();
}

function onMessageArrived(message) {
    console.log("RECV . . . [" + message.destinationName + "] " + message.payloadString);

    // Cases if message starts with 0, 1, 2, X, and otherwise
    if (message.payloadString.charAt(0) === "X") {
        // If message starts with X: toggle ON/OFF button
        if (message.payloadString.charAt(1) === "0") {
            if (document.getElementById("LampToggle").innerHTML == "ON") {
                document.getElementById("LampToggle").click();
            }
        }
        if (message.payloadString.charAt(1) === "1") {
            if (document.getElementById("LampToggle").innerHTML == "OFF") {
                document.getElementById("LampToggle").click();
            }
        }
        if (message.payloadString.charAt(2) === "0") {
            if (document.getElementById("ACToggle").innerHTML == "ON") {
                document.getElementById("ACToggle").click();
            }
        }
        if (message.payloadString.charAt(2) === "1") {
            if (document.getElementById("ACToggle").innerHTML == "OFF") {
                document.getElementById("ACToggle").click();
            }
        }
    } else if (message.payloadString.charAt(0) !== "0" && message.payloadString.charAt(0) !== "1" && message.payloadString.charAt(0) !== "2") {
        // If message does not start with 0, 1, 2, X, just print whole message to log
        document.getElementById("Log").innerHTML += message.payloadString + "<br>";   
    }
}

function startDisconnect() {
    client.disconnect();
    document.getElementById("Log").innerHTML += "Disconnected.<br>";

    // End both sessions
    if (document.getElementById("LampToggle").innerHTML == "ON") {
        document.getElementById("LampToggle").click();
    }
    if (document.getElementById("ACToggle").innerHTML == "ON") {
        document.getElementById("ACToggle").click();
    }
}

function publishMessage(string) {
    const topic = "KarinaSmartHome/in";
    let Message = new Paho.MQTT.Message(string);
    Message.destinationName = topic;
    client.send(Message);
    console.log("SEND . . . [KarinaSmartHome/in] " + string);
}