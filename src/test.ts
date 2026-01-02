const user = {
  name: "andrew mweene",
  nrc: "099432/10/1",
  phone: "0973751049",
  address: "katimamulilo road, lusaka",
  witness_name: "evans mweene",
  witness_phone: "0966122324",
  relationship: "brother",
  site_id: 1,
  plot_size: "30 x 20",
  plot_number: "3",
  plot_id: 5,
  status: "sold",
  total: "5000",
  paid: "4000",
  balance: "1000",
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

addClient("POST", user);
//addClient();
