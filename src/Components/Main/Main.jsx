import s from './Main.module.css'
import Videos from '/src/Components/Videos/Videos.jsx'
import Courses from '/src/Components/Courses/Courses.jsx'

function Main() {
    return (
        <>
            <h1 className={s.main__h1}>Образовательный видеохостинг EduStream</h1>
            <Videos/>
            <Courses/>
        </>
    )
}

export default Main