import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import { useOutletContext } from "react-router-dom";

function Layout() {
    let [modalOpened, setModalOpened] = useState(false)
    var API_IP = 'http://94.131.97.131'

    return (
        <>
            <Header API_IP={API_IP} modalOpened={modalOpened} setModalOpened={setModalOpened} />
            <Outlet context={[modalOpened, setModalOpened, API_IP]} />
            <Footer modalOpened={modalOpened} setModalOpened={setModalOpened} />
        </>
    )
}

export default Layout