import { createContext, useState, useEffect } from "react"

export const WatchListContext = createContext()
//["GOOGL", "MSFT", "AMZN"]
export const WatchListContextProvider = (props) => {

  // watchlist contains a list of stocks
  const [watchList, setWatchList] = useState(
    localStorage.getItem("watchList")?.split(",") || ["GOOGL", "MSFT", "AMZN"]
  )

  useEffect(() => {
    localStorage.setItem("watchList", watchList)
  }, [watchList])


  const addStock = (stock) => {
     // if stock not in watchlist then add it to watchlist
    if (watchList.indexOf(stock) === -1) {
      setWatchList([...watchList, stock])
    }

  }

  const deleteStock = (stock) => {

    // check all of the current stock in watchlist
    // if match then they filter it out otherwise they don't
    setWatchList(watchList.filter((el) => {
      return el !== stock
    }))
  }

  // watchlistcontext.provider allowed all of its children to have access to it's value
  return <WatchListContext.Provider value={{ watchList, addStock, deleteStock }}>
    {props.children}
  </WatchListContext.Provider>
}

