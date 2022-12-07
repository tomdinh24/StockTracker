import axios from "axios"

const TOKEN = "cdtbugiad3i41v7hnbegcdtbugiad3i41v7hnbf0" // Used your own token from finnhub

export default axios.create({
  baseURL: "https://finnhub.io/api/v1",
  params: {
    token: TOKEN
  }
})
