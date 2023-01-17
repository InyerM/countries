import express from "express"
import axios from "axios"
import { ICountriesResponse } from "./interfaces"
import fs from "fs"

const app = express()

app.use(express.json())
app.use(express.urlencoded(
  { extended: true }
))

app.get("/", async (req, res) => {
  const { data } = await axios.get<ICountriesResponse[]>("https://restcountries.com/v3.1/all")
  const countries = data.map(country => {
    const { idd, name: { common }, cca2, languages } = country
    const { root, suffixes } = idd
    return {
      dialCode: `${root}${suffixes}`,
      name: common,
      code: cca2,
      languages,
    }
  })

  fs.writeFileSync("countries.json", JSON.stringify(countries, null, 2))
  res.status(200).send()
})

app.listen(4000, () => console.log("Running in port 4000"))
