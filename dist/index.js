import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { json, urlencoded } from "express";
const port = process.env.PORT || 3000;
const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
const clients = [
    {
        id: "2311",
        name: "Martin Zulu",
        sex: "male",
        nrc: "236700/17/1",
        phone: "0973751057",
        email: "martin.zulu@example.com",
        address: "Garden Chilulu, Lusaka",
        plotDetails: {
            plotSize: "20 x 20",
            plotNumber: "7",
            siteName: "F",
            grandPrice: 15000,
            amountPaid: 15000,
            balance: 0,
            allocated: "yes",
            allocationDate: "2024-09-20",
            paymentStatus: "fully paid",
            dateBought: "01-02-2020",
            dateUpdated: "15-09-2025",
        },
        witness: {
            name: "Jane Doe",
            sex: "female",
            nrc: "449952/10/7",
            email: "jane.doe@example.com",
            phone: "0973751058",
            address: "123 Main St, Anytown, USA",
            relationship: "sister",
        },
        documents: {
            nrcLink: "https://gdrive.com/file/1234567890",
            letterOfSaleLink: "https://gdrive.com/file/1232547899",
            landAgreementLink: "https://gdrive.com/file/3232547853",
            allocationFormLink: "https://gdrive.com/file/3232547855",
            authorizationLetterLink: "https://gdrive.com/file/3232547854",
        },
    },
];
app.get("/", (req, res) => {
    res.json(clients);
});
app.listen(port, () => {
    console.log(`server is listening on port: http://localhost:${port}`);
});
