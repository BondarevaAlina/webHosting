import s from './OKAK.module.css'

export default function OKAK() {
    return (
        <div className={s.app}>
            <p className={s.text}>
                Страница не найдена
            </p>
            <div className={s.error}>
                404
            </div>
            <div className={s.error}>
                <img src="/img/cat.png" alt="cat" />
                <h1 className={s.okak}>ОКАК</h1>
            </div>
        </div>
    )
}