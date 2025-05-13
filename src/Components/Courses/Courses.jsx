import s from './Courses.module.css'
import Container from '/src/Components/Container/Container'

function Courses() {
    return (
        <>
            <Container>
                <div className={s.courses}>
                    <h2 className={s.courses__title}>Авторские курсы</h2>
                    <div className={s.courses__cards}>
                        <article className={s.courses__card}>
                            <img className={s.card__img} src="/img/courseimg.jpg" alt="" />
                            <div className={s.card__allBlock}>
                                <div className={s.card__textBlock}>
                                    <p className={s.card__title}>ЛЕГКИЙ ЗАРАБОТОК НА МАМОНТАХ</p>
                                    <div>
                                        {/* <p className={s.card__name}>Джигурда</p> */}
                                        <button className={s.card__btn}>ПОЛУЧИТЬ</button>
                                    </div>
                                </div>
                            </div>
                        </article>
                        <article className={s.courses__card}>
                            <img className={s.card__img} src="/img/courseimg.jpg" alt="" />
                            <div className={s.card__allBlock}>
                                <div className={s.card__textBlock}>
                                    <p className={s.card__title}>ЛЕГКИЙ ЗАРАБОТОК НА МАМОНТАХ</p>
                                    <div>
                                        {/* <p className={s.card__name}>Джигурда</p> */}
                                        <button className={s.card__btn}>ПОЛУЧИТЬ</button>
                                    </div>
                                </div>
                            </div>
                        </article>
                        <article className={s.courses__card}>
                            <img className={s.card__img} src="/img/courseimg.jpg" alt="" />
                            <div className={s.card__allBlock}>
                                <div className={s.card__textBlock}>
                                    <p className={s.card__title}>ЛЕГКИЙ ЗАРАБОТОК НА МАМОНТАХ</p>
                                    <div>
                                        {/* <p className={s.card__name}>Джигурда</p> */}
                                        <button className={s.card__btn}>ПОЛУЧИТЬ</button>
                                    </div>
                                </div>
                            </div>
                        </article>
                        <article className={s.courses__card}>
                            <img className={s.card__img} src="/img/courseimg.jpg" alt="" />
                            <div className={s.card__allBlock}>
                                <div className={s.card__textBlock}>
                                    <p className={s.card__title}>ЛЕГКИЙ ЗАРАБОТОК НА МАМОНТАХ</p>
                                    <div>
                                        {/* <p className={s.card__name}>Джигурда</p> */}
                                        <button className={s.card__btn}>ПОЛУЧИТЬ</button>
                                    </div>
                                </div>
                            </div>
                        </article>
                        <article className={s.courses__card}>
                            <img className={s.card__img} src="/img/courseimg.jpg" alt="" />
                            <div className={s.card__allBlock}>
                                <div className={s.card__textBlock}>
                                    <p className={s.card__title}>ЛЕГКИЙ ЗАРАБОТОК НА МАМОНТАХ</p>
                                    <div>
                                        {/* <p className={s.card__name}>Джигурда</p> */}
                                        <button className={s.card__btn}>ПОЛУЧИТЬ</button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Courses