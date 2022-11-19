const express = require("express")
const axios = require("axios")
const app = express()
const port = 3000
app.use(express.json)

const BALANCE_CHANGE_THRESHOLD = 0.5
const wallet = "6WZx8AJHjoxCoD1qD2wyKRKyrYwJpSaU3gMbXdFHmDZv"
const apikey = "8e68b129-ff96-4e38-a436-d6677c0713fb"

app.post("/webhooks", (req, res) => {
  console.log("resp: ", req.body)
  const { body } = req;
  if (body[0]?.type == "TRANSFER") {
    const txn = body[0].nativeTransfers.find(x => x.fromUserAccount);
    if (!txn) { return; }
    const { data } = await axios.get(`https://api.helius.xyz/v0/addresses/${wallet}/balances?api-key=${apikey}`);
    const { nativeBalance } = data;
    const pctChange = (txn.amaount) / (nativeBalance + txn.amount);
    if (Math.abs(pctChange) >= BALANCE_CHANGE_THRESHOLD) {
      invokeAlert();
    }
  }
})

app.listen(port, () => {
  console.log(`Example server listening on port ${port}`)
})