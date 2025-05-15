import s from './History.module.css'
import Container from '/src/Components/Container/Container'

function History(props) {

    return (
        <>
            <section className={s.history}>
                <Container>
                    <div className={s.history__titles} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 className={s.history__title}>История просмотра</h2>
                        <p className={s.history__allVideos}>Вся история</p>
                    </div>
                    <div className={s.history__cards}>
                        <article className={s.history__card}>
                            <img className={s.card__img} src="https://avatars.mds.yandex.net/i?id=c849ec0d9184c5978879197f65b1c632_l-4334236-images-thumbs&n=13" alt="" />
                            <div className={s.card__allBlock}>
                                <div className={s.card__textBlock}>
                                    <p className={s.card__title}>Соловьёв Лайв | Новый выпуск</p>
                                    <div className={s.card__about}>
                                        <p className={s.card__name}>Кокаин | 52М. Просмотров</p>
                                        <p className={s.card__descr}>ЖЕСТКОЕ ОБРАЩЕНИЕ СОЛОВЬЁВА К АМЕРИКАНЦАМ</p>
                                    </div>
                                </div>
                            </div>
                        </article>
                        <article className={s.history__card}>
                            <img className={s.card__img} src="https://avatars.mds.yandex.net/i?id=c849ec0d9184c5978879197f65b1c632_l-4334236-images-thumbs&n=13" alt="" />
                            <div className={s.card__allBlock}>
                                <div className={s.card__textBlock}>
                                    <p className={s.card__title}>Соловьёв Лайв | Новый выпуск</p>
                                    <div className={s.card__about}>
                                        <p className={s.card__name}>Кокаин | 52М. Просмотров</p>
                                        <p className={s.card__descr}>ЖЕСТКОЕ ОБРАЩЕНИЕ СОЛОВЬЁВА К АМЕРИКАНЦАМ</p>
                                    </div>
                                </div>
                            </div>
                        </article>
                        <article className={s.history__card}>
                            <img className={s.card__img} src="https://avatars.mds.yandex.net/i?id=c849ec0d9184c5978879197f65b1c632_l-4334236-images-thumbs&n=13" alt="" />
                            <div className={s.card__allBlock}>
                                <div className={s.card__textBlock}>
                                    <p className={s.card__title}>Соловьёв Лайв | Новый выпуск</p>
                                    <div className={s.card__about}>
                                        <p className={s.card__name}>Кокаин | 52М. Просмотров</p>
                                        <p className={s.card__descr}>ЖЕСТКОЕ ОБРАЩЕНИЕ СОЛОВЬЁВА К АМЕРИКАНЦАМ</p>
                                    </div>
                                </div>
                            </div>
                        </article> 
                    </div>
                </Container>
                <hr style={{marginTop:"40px"}}/>
            </section>
        </>
    )
}

export default History


    