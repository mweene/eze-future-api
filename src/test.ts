const formdata = {
  name: "wendy simapuka", //client
  nrc: "331122/67/1", //client
  phone: "0975237100", //client
  address: "garden compound lusaka", //client
  allocated: true, //client
  allocation_date: "2025-12-04", //client
  authorized: true, //client
  authorization_date: "2026-01-06", //client
  witness_name: "kelvin momo", //witness
  witness_nrc: "330010/10/1", //witness
  witness_phone: "0976551227", //witness
  relationship: "uncle", //witness
  letter_of_sale: {
    0: {},
  },
  authorization_letter: {
    0: {},
  },
  nrc_url: {
    0: {},
  }, //crazy works awaits here
  receipts: {
    0: {},
  },
  site_name: "site A", //get all names and ids from sites create an object that links name <==> id
  //site_id: 1,
  plot_size: "20mx20m",
  plot_no: "3", //plot_id is needed here
  total_amount: "12000", //sales
  amount_paid: "12000", //sales
  balance: "0",
  sales_date: "2025-12-11", //sales.created_at
};

const addClient = async (method = "GET", payload = {}) => {
  try {
    const url = "http://localhost:4040/api/dashboard";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
};

//addClient("POST", formdata);
//addClient();

const getSites = async () => {
  try {
    const url = "http://localhost:4040/api/sites";
    const response = await fetch(url);
    if (!response.ok) return "something went wrong";
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

//const sites = await getSites();

const sites = [
  { id: 1, name: "site a", total_plots: 16, available_plots: 0 },
  { id: 2, name: "site a+", total_plots: 5, available_plots: 0 },
  { id: 3, name: "site b", total_plots: 8, available_plots: 0 },
  { id: 4, name: "site c", total_plots: 2, available_plots: 0 },
  { id: 5, name: "site d", total_plots: 20, available_plots: 0 },
  { id: 6, name: "site f", total_plots: 4, available_plots: 0 },
  { id: 7, name: "site g", total_plots: 8, available_plots: 0 },
  { id: 8, name: "site h", total_plots: 35, available_plots: 0 },
  { id: 9, name: "site h+", total_plots: 7, available_plots: 0 },
  { id: 10, name: "site i", total_plots: 16, available_plots: 0 },
  { id: 11, name: "site j", total_plots: 6, available_plots: 0 },
  { id: 12, name: "site k", total_plots: 4, available_plots: 0 },
  { id: 13, name: "site k+", total_plots: 4, available_plots: 0 },
  { id: 14, name: "site l", total_plots: 6, available_plots: 0 },
  { id: 15, name: "site m", total_plots: 12, available_plots: 0 },
  { id: 16, name: "site n", total_plots: 18, available_plots: 0 },
  { id: 17, name: "site n extension", total_plots: 10, available_plots: 0 },
  { id: 18, name: "site n+", total_plots: 12, available_plots: 0 },
  { id: 19, name: "site n+ extension", total_plots: 34, available_plots: 0 },
  { id: 20, name: "site o", total_plots: 13, available_plots: 0 },
  { id: 21, name: "site p", total_plots: 17, available_plots: 0 },
  { id: 22, name: "site r", total_plots: 5, available_plots: 0 },
  { id: 23, name: "site s", total_plots: 16, available_plots: 0 },
  { id: 24, name: "site t", total_plots: 10, available_plots: 0 },
  { id: 25, name: "site u", total_plots: 8, available_plots: 0 },
  { id: 26, name: "site v", total_plots: 10, available_plots: 0 },
  { id: 27, name: "site x", total_plots: 12, available_plots: 0 },
  { id: 28, name: "site y", total_plots: 22, available_plots: 0 },
  { id: 29, name: "site y+", total_plots: 6, available_plots: 0 },
  { id: 30, name: "site z", total_plots: 7, available_plots: 0 },
  { id: 31, name: "site 55", total_plots: 9, available_plots: 0 },
  { id: 32, name: "site 43", total_plots: 15, available_plots: 0 },
  { id: 33, name: "site 44", total_plots: 10, available_plots: 0 },
  { id: 34, name: "site 45", total_plots: 16, available_plots: 0 },
  { id: 35, name: "site 46", total_plots: 14, available_plots: 1 },
  { id: 36, name: "site 47", total_plots: 10, available_plots: 0 },
  { id: 37, name: "site 48", total_plots: 20, available_plots: 15 },
];

const filteredSites = sites.filter((site) => site.available_plots > 0);
console.log(filteredSites);
