import db from "../db/db.js";
function getAllClients(req, res) {
    try {
        // Get all clients
        const getAllClientsQuery = db.prepare(`
      SELECT * FROM clients ORDER BY id
    `);
        const getPlotDetailsByClientId = db.prepare(`
      SELECT * FROM plot_details WHERE client_id = ?
    `);
        const getWitnessByClientId = db.prepare(`
      SELECT * FROM witnesses WHERE client_id = ?
    `);
        const getDocumentsByClientId = db.prepare(`
      SELECT * FROM documents WHERE client_id = ?
    `);
        const clients = getAllClientsQuery.all();
        // Build complete client objects with related data
        const completeClients = clients.map((client) => {
            const plotDetails = getPlotDetailsByClientId.get(client.id);
            const witness = getWitnessByClientId.get(client.id);
            const documents = getDocumentsByClientId.get(client.id);
            // Structure the response to match the client object format
            const clientData = {
                id: client.id,
                name: client.name,
                sex: client.sex || undefined,
                nrc: client.nrc || undefined,
                phone: client.phone || undefined,
                email: client.email,
                address: client.address || undefined,
            };
            // Add plot details if exists
            if (plotDetails) {
                clientData.plotDetails = {
                    plotSize: plotDetails.plot_size || undefined,
                    plotNumber: plotDetails.plot_number || undefined,
                    siteName: plotDetails.site_name || undefined,
                    grandPrice: plotDetails.grand_price || undefined,
                    amountPaid: plotDetails.amount_paid || undefined,
                    balance: plotDetails.balance || undefined,
                    allocated: plotDetails.allocated || undefined,
                    allocationDate: plotDetails.allocation_date || undefined,
                    paymentStatus: plotDetails.payment_status || undefined,
                    dateBought: plotDetails.date_bought || undefined,
                    dateUpdated: plotDetails.date_updated || undefined,
                };
            }
            // Add witness if exists
            if (witness) {
                clientData.witness = {
                    name: witness.name || undefined,
                    sex: witness.sex || undefined,
                    nrc: witness.nrc || undefined,
                    email: witness.email || undefined,
                    phone: witness.phone || undefined,
                    address: witness.address || undefined,
                    relationship: witness.relationship || undefined,
                };
            }
            // Add documents if exists
            if (documents) {
                clientData.documents = {
                    nrcLink: documents.nrc_link || undefined,
                    letterOfSaleLink: documents.letter_of_sale_link || undefined,
                    landAgreementLink: documents.land_agreement_link || undefined,
                    allocationFormLink: documents.allocation_form_link || undefined,
                    authorizationLetterLink: documents.authorization_letter_link || undefined,
                };
            }
            return clientData;
        });
        res.status(200).json(completeClients);
    }
    catch (err) {
        console.error("Error getting all clients:", err);
        res.status(500).json({
            message: "Failed to retrieve clients",
            error: err.message,
        });
    }
}
function addNewClient(req, res) {
    try {
        const clientData = req.body;
        // Validation
        if (!clientData.name || !clientData.email) {
            return res.status(400).json({
                message: "Name and email are required fields",
            });
        }
        // Prepare all SQL statements
        const insertClient = db.prepare(`
      INSERT INTO clients (name, sex, nrc, phone, email, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const insertPlotDetails = db.prepare(`
      INSERT INTO plot_details (
        client_id, plot_size, plot_number, site_name, grand_price,
        amount_paid, balance, allocated, allocation_date, payment_status,
        date_bought, date_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const insertWitness = db.prepare(`
      INSERT INTO witnesses (
        client_id, name, sex, nrc, email, phone, address, relationship
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const insertDocuments = db.prepare(`
      INSERT INTO documents (
        client_id, nrc_link, letter_of_sale_link, land_agreement_link,
        allocation_form_link, authorization_letter_link
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
        // Create a transaction for atomic operations
        const insertClientTransaction = db.transaction((data) => {
            // Insert main client data
            const clientInfo = insertClient.run(data.name, data.sex || null, data.nrc || null, data.phone || null, data.email, data.address || null);
            const clientId = clientInfo.lastInsertRowid;
            // Insert plot details if provided
            if (data.plotDetails) {
                const plot = data.plotDetails;
                insertPlotDetails.run(clientId, plot.plotSize || null, plot.plotNumber || null, plot.siteName || null, plot.grandPrice || null, plot.amountPaid || null, plot.balance || null, plot.allocated || null, plot.allocationDate || null, plot.paymentStatus || null, plot.dateBought || null, plot.dateUpdated || null);
            }
            // Insert witness information if provided
            if (data.witness) {
                const witness = data.witness;
                insertWitness.run(clientId, witness.name || null, witness.sex || null, witness.nrc || null, witness.email || null, witness.phone || null, witness.address || null, witness.relationship || null);
            }
            // Insert documents if provided
            if (data.documents) {
                const docs = data.documents;
                insertDocuments.run(clientId, docs.nrcLink || null, docs.letterOfSaleLink || null, docs.landAgreementLink || null, docs.allocationFormLink || null, docs.authorizationLetterLink || null);
            }
            return clientId;
        });
        // Execute the transaction
        const clientId = insertClientTransaction(clientData);
        res.status(201).json({
            message: "Client added successfully",
            clientId: clientId,
            data: {
                name: clientData.name,
                email: clientData.email,
                id: clientId,
            },
        });
    }
    catch (err) {
        console.error("Error adding new client:", err);
        // Handle specific database errors
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({
                message: "A client with this name already exists",
            });
        }
        res.status(500).json({
            message: "Failed to add client",
            error: err.message,
        });
    }
}
function getClientById(req, res) {
    try {
        const clientId = req.params.id;
        if (!clientId) {
            return res.status(400).json({
                message: "Client ID is required",
            });
        }
        // Prepare SQL statements to get all related data
        const getClient = db.prepare(`
      SELECT * FROM clients WHERE id = ?
    `);
        const getPlotDetails = db.prepare(`
      SELECT * FROM plot_details WHERE client_id = ?
    `);
        const getWitness = db.prepare(`
      SELECT * FROM witnesses WHERE client_id = ?
    `);
        const getDocuments = db.prepare(`
      SELECT * FROM documents WHERE client_id = ?
    `);
        // Get client data
        const client = getClient.get(clientId);
        if (!client) {
            return res.status(404).json({
                message: "Client not found",
            });
        }
        // Get related data
        const plotDetails = getPlotDetails.get(clientId);
        const witness = getWitness.get(clientId);
        const documents = getDocuments.get(clientId);
        // Structure the response to match the original client object format
        const clientData = {
            id: client.id,
            name: client.name,
            sex: client.sex || undefined,
            nrc: client.nrc || undefined,
            phone: client.phone || undefined,
            email: client.email,
            address: client.address || undefined,
        };
        // Add plot details if exists
        if (plotDetails) {
            clientData.plotDetails = {
                plotSize: plotDetails.plot_size || undefined,
                plotNumber: plotDetails.plot_number || undefined,
                siteName: plotDetails.site_name || undefined,
                grandPrice: plotDetails.grand_price || undefined,
                amountPaid: plotDetails.amount_paid || undefined,
                balance: plotDetails.balance || undefined,
                allocated: plotDetails.allocated || undefined,
                allocationDate: plotDetails.allocation_date || undefined,
                paymentStatus: plotDetails.payment_status || undefined,
                dateBought: plotDetails.date_bought || undefined,
                dateUpdated: plotDetails.date_updated || undefined,
            };
        }
        // Add witness if exists
        if (witness) {
            clientData.witness = {
                name: witness.name || undefined,
                sex: witness.sex || undefined,
                nrc: witness.nrc || undefined,
                email: witness.email || undefined,
                phone: witness.phone || undefined,
                address: witness.address || undefined,
                relationship: witness.relationship || undefined,
            };
        }
        // Add documents if exists
        if (documents) {
            clientData.documents = {
                nrcLink: documents.nrc_link || undefined,
                letterOfSaleLink: documents.letter_of_sale_link || undefined,
                landAgreementLink: documents.land_agreement_link || undefined,
                allocationFormLink: documents.allocation_form_link || undefined,
                authorizationLetterLink: documents.authorization_letter_link || undefined,
            };
        }
        res.status(200).json(clientData);
    }
    catch (err) {
        console.error("Error getting client by ID:", err);
        res.status(500).json({
            message: "Failed to retrieve client",
            error: err.message,
        });
    }
}
export { getAllClients, addNewClient, getClientById };
