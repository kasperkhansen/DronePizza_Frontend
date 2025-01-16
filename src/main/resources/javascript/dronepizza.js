const apiBaseUrl = "http://localhost:8080/api";

const dronesUrl = `${apiBaseUrl}/drones`;
const addDroneUrl = `${dronesUrl}/add`;
const changeDroneStatusUrl = (id, status) => `${dronesUrl}/${id}/${status}`;

const deliveriesUrl = `${apiBaseUrl}/deliveries`;
const addDeliveryUrl = `${deliveriesUrl}/add`;
const deliveryQueueUrl = `${deliveriesUrl}/queue`;

document.addEventListener("DOMContentLoaded", () => {
    loadDeliveries();
    loadDrones();

    document.getElementById("add-drone").addEventListener("click", addDrone);
    document.getElementById("simulate-delivery").addEventListener("click", simulateDelivery);
});

async function loadDeliveries() {
    try {
        const response = await fetch(deliveriesUrl);
        const deliveries = await response.json();

        const deliveryList = document.getElementById("delivery-list");
        deliveryList.innerHTML = ""; // Rens listen

        console.log(deliveries);

        deliveries.forEach(delivery => {
            const deliveryItem = document.createElement("li");

            const droneInfo = delivery.drone
                ? `Drone ID: ${delivery.drone.id}`
                : "Ingen drone tildelt";

            console.log("droneInfo", delivery.drone);

            deliveryItem.innerHTML = `
                <span>
                    <strong>Adresse:</strong> ${delivery.adresse} <br>
                    <strong>Forventet levering:</strong> ${delivery.expectedDeliveryTime} <br>
                    <strong>${droneInfo}</strong>
                </span>
                ${
                !delivery.drone
                    ? `<button onclick="assignDrone(${delivery.id})">Tildel Drone</button>`
                    : ""
            }
            `;

            deliveryList.appendChild(deliveryItem);
        });
    } catch (error) {
        console.error("Fejl ved indlæsning af leveringer:", error);
    }
}

async function loadDrones() {
    try {
        const response = await fetch(dronesUrl);
        const drones = await response.json();

        const droneList = document.getElementById("drone-list");
        droneList.innerHTML = ""; // Rens listen

        drones.forEach(drone => {
            const droneItem = document.createElement("li");

            droneItem.innerHTML = `
                <span>
                    <strong>UUID:</strong> ${drone.uuid} <br>
                    <strong>Status:</strong> ${drone.status} <br>
                </span>
                <button onclick="changeDroneStatus(${drone.id}, 'enable')">I drift</button>
                <button onclick="changeDroneStatus(${drone.id}, 'disable')">Ude af drift</button>
                <button onclick="changeDroneStatus(${drone.id}, 'retire')">Udfaset</button>
            `;

            droneList.appendChild(droneItem);
        });
    } catch (error) {
        console.error("Fejl ved indlæsning af droner:", error);
    }
}

async function addDrone() {
    try {
        const response = await fetch(addDroneUrl, { method: "POST" });
        const message = await response.text();
        alert(message);

        loadDrones();
    } catch (error) {
        console.error("Fejl ved tilføjelse af drone:", error);
    }
}

async function assignDrone(deliveryId) {
    try {
        const assignDroneUrl = `${deliveriesUrl}/${deliveryId}/plan`; // Rettet endpoint
        const droneId = prompt("Indtast Drone ID for tildeling:");

        console.log(droneId);

        if (!droneId) {
            alert("Drone ID er påkrævet.");
            return;
        }

        const response = await fetch(assignDroneUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `droneId=${encodeURIComponent(droneId)}`,
        });

        const message = await response.text();
        alert(message);

        loadDeliveries();
    } catch (error) {
        console.error("Fejl ved tildeling af drone:", error);
    }
}

async function simulateDelivery() {
    try {
        const pizzaId = prompt("Indtast Pizza ID:");
        const adresse = prompt("Indtast leveringsadresse:");

        if (!pizzaId || !adresse) {
            alert("Både Pizza ID og adresse er påkrævet.");
            return;
        }

        const response = await fetch(addDeliveryUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `pizzaId=${pizzaId}&adresse=${encodeURIComponent(adresse)}`, // Rettet parameter til 'adresse'
        });

        const message = await response.text();
        alert(message);

        loadDeliveries();
    } catch (error) {
        console.error("Fejl ved simulering af levering:", error);
    }
}

async function changeDroneStatus(droneId, status) {
    try {
        const response = await fetch(changeDroneStatusUrl(droneId, status), { method: "POST" });
        const message = await response.text();
        alert(message);

        loadDrones();
    } catch (error) {
        console.error(`Fejl ved ændring af dronestatus til ${status}:`, error);
    }
}
