import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import Header from './components/header.jsx'
import ListHouses from './CRUD/list_houses.jsx'
import ListOrders from './CRUD/list_orders.jsx'
import UpdateHouses from './CRUD/update.jsx';
import Report from './CRUD/report.jsx';
import Delete from './CRUD/delete.jsx';
import CreateHouse from './CRUD/create_house.jsx';



const MainWorkspace = () => {


    return (
        <>
            <Header />
            <main className="main">
                <div className="container">
                    <div className="main-items" >
                        <Routes>

                            <Route path='/' element={
                                <>


                                    <ListHouses />

                                </>
                            } />

                            <Route path='create_house/' element={
                                <>


                                    <CreateHouse />

                                </>
                            } />

                            <Route path='update/:id' element={<UpdateHouses />} />


                        </Routes>
                    </div>
                </div>
            </main>
        </>
    )

}


export default MainWorkspace