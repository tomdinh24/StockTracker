import { useState, useEffect, useContext } from "react"
import finnHub from "../apis/finnHub"
import { WatchListContext } from "../context/watchListContext.jsx"


export const AutoComplete = () => {

    // search store user search 
    const [search, setSearch] = useState("")

    // results store user search result
    const [results, setResults] = useState([])
    const { addStock } = useContext(WatchListContext)

    // render the drop down menu
    const renderDropdown = () => {
        // if search have input then show the drop down
        const dropDownClass = search ? "show" : null
       
        return (
        <ul style={{
            height: "500px",
            overflowY: "scroll",
            overflowX: "hidden",
            cursor: "pointer"
        }} className={`dropdown-menu ${dropDownClass}`}>
            {results.map((result) => {
            return (
                <li onClick={() => {
                addStock(result.symbol)
                setSearch("")
                }} key={result.symbol} className="dropdown-item">
                    {result.description} 
                    ({result.symbol})
                </li>
            )
            })}
        </ul>
        )
    }

     // function: retrieve data based on user search and update the search result
    useEffect(() => {

        let isMounted = true

        // retrieve data from finnhub api 
        const fetchData = async () => {
            try {

                // query through available stocks from finnhub and retrieve user search input
                const response = await finnHub.get("/search", {
                params: {
                    q: search
                }
                })

                // if component being inserted in the DOM (website structure) then set the result to user search
                if (isMounted) {
                    setResults(response.data.result)
                }

            } catch (err) {

            }
        }

        // if user type in the search bar then fetch data from finnhub
        if (search.length > 0) {
            fetchData()
        } 
        // otherwise set result back to empty list
        else {
            setResults([])
        }

        // if DOM stayed the same then just return 
        return () => (isMounted = false)
    }, [search])

    // display search bar component using bootstrap
    return <div className="w-50 p-5 rounded mx-auto">
        <div className="form-floating dropdown">
        <input style={{ backgroundColor: "rgba(145, 158, 171, 0.04)" }} id="search" type="text" className="form-control" placeholder="Search" autoComplete="off" value={search} onChange={(e) => setSearch(e.target.value)}></input>
        <label htmlFor="search">Search</label>
        {renderDropdown()}
        </div>
    </div>
}
