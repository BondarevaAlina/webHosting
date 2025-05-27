import s from './User.module.css'
import ModalWindow from '/src/Components/ModalWindow/ModalWindow.jsx'
import Info from '/src/Components/Info/Info.jsx'
import History from '/src/Components/History/History.jsx'
import { useOutletContext } from 'react-router-dom';
import CreateCourse from '../CreateCourse/CreateCourse';
import YVideos from '../YVideos/YVideos';

function User() {
    let [modalOpened, setModalOpened, API_IP, avatarUrl, setAvatarUrl] = useOutletContext()

    return (
        <>
            <main onClick={() => setModalOpened(false)} className={modalOpened ? s.lowOpacity : ''}>
                <h1 className={s.main__h1}>Образовательный видеохостинг EduStream</h1>
                <Info avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} API_IP={API_IP}/>
                <CreateCourse API_IP={API_IP}/>
                <History API_IP={API_IP}/>
                {/* <YVideos/> */}
            </main>
                <ModalWindow setAvatarUrl={setAvatarUrl} API_IP={API_IP} modalOpened={modalOpened} setModalOpened={setModalOpened} />
        </>
    )
}

export default User