import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import { useOutletContext } from "react-router-dom";

function Layout() {
    let [modalOpened, setModalOpened] = useState(false)

    return (
        <>
            <Header modalOpened={modalOpened} setModalOpened={setModalOpened} />
            <Outlet context={[modalOpened, setModalOpened]} />
            <Footer modalOpened={modalOpened} setModalOpened={setModalOpened} />
        </>
    )
}

export default Layout