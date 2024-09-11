import Left from "./components/main/left.jsx"
import Right from "./components/main/right.jsx"
import { useState, useEffect } from "react"


const Main = ({ filters, refHome }) => {

    const [leftFilter, setLeftFilter] = useState(null)
    const [merging, setMerging] = useState(filters)

    useEffect(() => {
        setMerging(
            {
                ...leftFilter,
                ...filters
            }
        )
    }
        , [filters, leftFilter])

    const scrollToHomes = () => {
        if (refHome.current) {
            refHome.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (leftFilter) {
        scrollToHomes()
    }


    return (

        <main className="main">
            <div className="container">
                <div className="main-items">

                    <Left setLeftFilter={setLeftFilter} />
                    <Right props={merging} refHome={refHome} />

                </div>
            </div>
        </main>
    )

}



export default Main