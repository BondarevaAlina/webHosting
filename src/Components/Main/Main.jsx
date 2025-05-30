import s from './Main.module.css'
import Videos from '/src/Components/Videos/Videos.jsx'
import Courses from '/src/Components/Courses/Courses.jsx'
import ModalWindow from '/src/Components/ModalWindow/ModalWindow.jsx'
import { useOutletContext } from 'react-router-dom';

function Main() {
    let [modalOpened, setModalOpened, API_IP, avatarUrl, setAvatarUrl] = useOutletContext()

    return (
        <>
            <main onClick={() => setModalOpened(false)} className={modalOpened ? s.lowOpacity : ''}>
                <h1 className={s.main__h1}>Образовательный видеохостинг EduStream</h1>
                <Videos />
                <Courses />
            </main>
                <ModalWindow setAvatarUrl={setAvatarUrl} API_IP={API_IP} modalOpened={modalOpened} setModalOpened={setModalOpened} />
        </>
    )
}

export default Main