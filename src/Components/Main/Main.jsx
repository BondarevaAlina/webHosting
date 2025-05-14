import s from './Main.module.css'
import Videos from '/src/Components/Videos/Videos.jsx'
import Courses from '/src/Components/Courses/Courses.jsx'
import ModalWindow from '/src/Components/ModalWindow/ModalWindow.jsx'
import { useOutletContext } from 'react-router-dom';

function Main() {
    let [modalOpened, setModalOpened, API_IP] = useOutletContext()
    console.log(modalOpened);
    

    return (
        <>
            <main onClick={() => setModalOpened(modalOpened ? false : true)} className={modalOpened ? s.lowOpacity : ''}>
                <h1 className={s.main__h1}>Образовательный видеохостинг EduStream</h1>
                <Videos />
                <Courses />
            </main>
                <ModalWindow API_IP={API_IP} modalOpened={modalOpened} setModalOpened={setModalOpened} />
        </>
    )
}

export default Main