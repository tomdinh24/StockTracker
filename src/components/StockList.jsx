import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs"
import finnHub from "../apis/finnHub"
import { WatchListContext } from "../context/watchListContext.jsx"




export const StockList = () => {

    // stock contains individual stock
    const [stock, setStock] = useState([])

    // extrack watchlist value from WatchListContext
    const { watchList, deleteStock } = useContext(WatchListContext)
    
    const navigate = useNavigate()

    // render color based on whether the stock goes up or down
    const changeColor = (change) => {
        return change > 0 ? "success" : "danger"
    }

    // render icon based on whether the stock goes up or down
    const renderIcon = (change) => {
        return change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />
    }


    useEffect(() => {
        // mounted means an instance of the component being added to the interface
        let isMounted = true
        const fetchData = async () => {

            try {
                // for browser rendering as each stock have their own page
                const responses = await Promise.all(watchList.map((stock) => {
                    return finnHub.get("/quote", {
                        params: {
                        symbol: stock
                        }
                    })
                }))

                // extract data objects and symbol from api
                const data = responses.map((response) => {
                    return {
                        data: response.data,
                        symbol: response.config.params.symbol
                    }

                })
                
                // check see if new instance being added to dom, if so set the new instance to stock data
                if (isMounted) {
                    setStock(data)
                }

            } catch (err) {

            }
        }

        fetchData()

        return () => (isMounted = false)
    }, [watchList])

    const handleStockSelect = (symbol) => {
        navigate(`detail/${symbol}`)
    }


    // bootstrap element
    // mt stands for margin top at size 5 on hovering over table
    // thead stands for table header
    // tr stands for table row
    // th stands for cell header
    // td stands for table data cell
    return (<div>
        <table className="table hover mt-5">

            <thead style={{ color: "rgb(79,89,102)" }}>
                <tr>
                <th scope="col">Name</th>
                <th scope="col">Last</th>
                <th scope="col">Chg</th>
                <th scope="col">Chg%</th>
                <th scope="col">High</th>
                <th scope="col">Low</th>
                <th scope="col">Open</th>
                <th scope="col">Close</th>

                </tr>
            </thead>

            <tbody>
                {stock.map((stockData) => {
                return (
                    <tr style={{ cursor: "pointer" }} onClick={() => handleStockSelect(stockData.symbol)} className="table-row" key={stockData.symbol}>
                    <th scope="row">{stockData.symbol}</th>
                    <td>{stockData.data.c}</td>
                    <td className={`text-${changeColor(stockData.data.d)}`}>{stockData.data.d} {renderIcon(stockData.data.d)}</td>
                    <td className={`text-${changeColor(stockData.data.d)}`}>{stockData.data.dp} {renderIcon(stockData.data.d)} </td>
                    <td>{stockData.data.h}</td>
                    <td>{stockData.data.l}</td>
                    <td>{stockData.data.o}</td>
                    <td>{stockData.data.pc} <button className="btn btn-danger btn-sm ml-3 d-inline-block delete-button" onClick={(e) => {
                        e.stopPropagation()
                        deleteStock(stockData.symbol)
                    }}>Remove</button></td>
                    </tr>
                )
                })}
            </tbody>
        </table>

    </div>)
}