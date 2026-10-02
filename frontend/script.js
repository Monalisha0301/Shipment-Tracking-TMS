
const API_URL = "http://localhost:8080/api/shipments";


// Load shipments when page opens

document.addEventListener("DOMContentLoaded", function () {

    loadShipments();

});


// Create shipment

document
    .getElementById("shipmentForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const shipment = {

            trackingNumber:
                document.getElementById("trackingNumber").value,

            customerName:
                document.getElementById("customerName").value,

            pickupLocation:
                document.getElementById("pickupLocation").value,

            deliveryLocation:
                document.getElementById("deliveryLocation").value,

            driverName:
                document.getElementById("driverName").value,

            vehicleNumber:
                document.getElementById("vehicleNumber").value,

            status: "CREATED"

        };


        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(shipment)

            });


            if (!response.ok) {

                throw new Error("Failed to create shipment");

            }


            const data = await response.json();


            document.getElementById("message").innerText =
                "Shipment created successfully!";


            document.getElementById("message").style.color =
                "green";


            document
                .getElementById("shipmentForm")
                .reset();


            loadShipments();


        } catch (error) {

            console.error(error);

            document.getElementById("message").innerText =
                "Cannot connect to backend.";

            document.getElementById("message").style.color =
                "red";

        }

    });


// Get all shipments

async function loadShipments() {

    try {

        const response = await fetch(API_URL);


        if (!response.ok) {

            throw new Error("Failed to load shipments");

        }


        const shipments = await response.json();


        displayShipments(shipments);

        updateDashboard(shipments);


    } catch (error) {

        console.error(error);

        document.getElementById("shipmentTableBody").innerHTML = `

            <tr>

                <td colspan="8">

                    Cannot connect to backend.

                    Make sure Spring Boot is running.

                </td>

            </tr>

        `;

    }

}


// Display shipments in table

function displayShipments(shipments) {

    const tableBody =
        document.getElementById("shipmentTableBody");


    tableBody.innerHTML = "";


    if (shipments.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="8">

                    No shipments found.

                </td>

            </tr>

        `;

        return;

    }


    shipments.forEach(function (shipment) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${shipment.id}</td>

            <td>
                <strong>
                    ${shipment.trackingNumber}
                </strong>
            </td>

            <td>
                ${shipment.customerName}
            </td>

            <td>
                ${shipment.pickupLocation}
                →
                ${shipment.deliveryLocation}
            </td>

            <td>
                ${shipment.driverName || "Not Assigned"}
            </td>

            <td>
                ${shipment.vehicleNumber || "-"}
            </td>

            <td>

                <span class="status status-${shipment.status}">

                    ${formatStatus(shipment.status)}

                </span>

            </td>

            <td>

                <select onchange="updateStatus(${shipment.id}, this.value)">
                    <option value="">Change Status</option>
                    <option value="CREATED">Created</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="PICKED_UP">Picked Up</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                </select>

                <br><br>

                <button
                    class="delete-btn"
                    onclick="deleteShipment(${shipment.id})">

                    Delete

                </button>

        `;


        tableBody.appendChild(row);

    });

}


// Format status

function formatStatus(status) {

    if (!status) {

        return "";

    }


    return status
        .replaceAll("_", " ");

}


// Delete shipment

async function deleteShipment(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this shipment?");


    if (!confirmDelete) {

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error("Delete failed");

        }


        alert("Shipment deleted successfully");


        loadShipments();


    } catch (error) {

        console.error(error);

        alert("Cannot delete shipment");

    }

}


// Dashboard numbers

function updateDashboard(shipments) {

    document.getElementById("totalShipments")
        .innerText = shipments.length;


    const created =
        shipments.filter(
            shipment => shipment.status === "CREATED"
        ).length;


    const transit =
        shipments.filter(
            shipment => shipment.status === "IN_TRANSIT"
        ).length;


    const delivered =
        shipments.filter(
            shipment => shipment.status === "DELIVERED"
        ).length;


    document.getElementById("createdShipments")
        .innerText = created;


    document.getElementById("transitShipments")
        .innerText = transit;


    document.getElementById("deliveredShipments")
        .innerText = delivered;

}
//updatests
async function updateStatus(id, status) {

    if (status === "") {
        return;
    }

    try {

        // Get existing shipment
        const response = await fetch(`${API_URL}/${id}`);

        const shipment = await response.json();

        // Change status
        shipment.status = status;

        // Update shipment
        const updateResponse = await fetch(`${API_URL}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(shipment)

        });

        if (!updateResponse.ok) {
            throw new Error("Status update failed");
        }

        alert("Shipment status updated successfully");

        // Reload table and dashboard
        loadShipments();

    } catch (error) {

        console.error(error);

        alert("Unable to update shipment status");

    }
}

