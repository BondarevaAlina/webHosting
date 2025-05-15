import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import {useTheme} from './ThemeContext'
import { useOutletContext } from "react-router-dom";

function Layout() {
    let [modalOpened, setModalOpened] = useState(false)
    let [avatarUrl, setAvatarUrl] = useState(null)
    const { theme, toggleTheme } = useTheme();
    var API_IP = 'http://94.131.97.131'

    return (
        <>
            <Header theme={theme} toggleTheme={toggleTheme} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} API_IP={API_IP} modalOpened={modalOpened} setModalOpened={setModalOpened} />
            <Outlet context={[modalOpened, setModalOpened, API_IP, avatarUrl, setAvatarUrl]} />
            <Footer modalOpened={modalOpened} setModalOpened={setModalOpened} />
        </>
    )
}

export default Layout