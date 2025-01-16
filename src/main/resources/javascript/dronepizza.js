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
        deliveryList.innerHTML = ""; // Clear the list

        deliveries.forEach(delivery => {
            const deliveryItem = document.createElement("li");

            const droneInfo = delivery.drone
                ? `Drone ID: ${delivery.drone.id}`
                : "No drone assigned";

            deliveryItem.innerHTML = `
                <span>
                    <strong>Address:</strong> ${delivery.address} <br>
                    <strong>Expected Delivery:</strong> ${delivery.expectedDeliveryTime} <br>
                    <strong>${droneInfo}</strong>
                </span>
                ${
                !delivery.drone
                    ? `<button onclick="assignDrone(${delivery.id})">Assign Drone</button>`
                    : ""
            }
            `;

            deliveryList.appendChild(deliveryItem);
        });
    } catch (error) {
        console.error("Error loading deliveries:", error);
    }
}

async function loadDrones() {
    try {
        const response = await fetch(dronesUrl);
        const drones = await response.json();

        const droneList = document.getElementById("drone-list");
        droneList.innerHTML = ""; // Clear the list

        drones.forEach(drone => {
            const droneItem = document.createElement("li");

            droneItem.innerHTML = `
                <span>
                    <strong>UUID:</strong> ${drone.uuid} <br>
                    <strong>Status:</strong> ${drone.status} <br>
                </span>
                <button onclick="changeDroneStatus(${drone.id}, 'enable')">Enable</button>
                <button onclick="changeDroneStatus(${drone.id}, 'disable')">Disable</button>
                <button onclick="changeDroneStatus(${drone.id}, 'retire')">Retire</button>
            `;

            droneList.appendChild(droneItem);
        });
    } catch (error) {
        console.error("Error loading drones:", error);
    }
}

async function addDrone() {
    try {
        const response = await fetch(addDroneUrl, { method: "POST" });
        const message = await response.text();
        alert(message);

        loadDrones();
    } catch (error) {
        console.error("Error adding drone:", error);
    }
}

async function assignDrone(deliveryId) {
    try {
        const assignDroneUrl = `${deliveriesUrl}/${deliveryId}/schedule`;
        const response = await fetch(assignDroneUrl, { method: "POST" });
        const message = await response.text();
        alert(message);

        loadDeliveries();
    } catch (error) {
        console.error("Error assigning drone:", error);
    }
}

async function simulateDelivery() {
    try {
        const pizzaId = prompt("Enter Pizza ID:");
        const address = prompt("Enter Delivery Address:");

        if (!pizzaId || !address) {
            alert("Both Pizza ID and Address are required.");
            return;
        }

        const response = await fetch(addDeliveryUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `pizzaId=${pizzaId}&address=${encodeURIComponent(address)}`,
        });

        const message = await response.text();
        alert(message);

        loadDeliveries();
    } catch (error) {
        console.error("Error simulating delivery:", error);
    }
}

async function changeDroneStatus(droneId, status) {
    try {
        const response = await fetch(changeDroneStatusUrl(droneId, status), { method: "POST" });
        const message = await response.text();
        alert(message);

        loadDrones();
    } catch (error) {
        console.error(`Error changing drone status to ${status}:`, error);
    }
}
