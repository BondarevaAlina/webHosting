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
                            <img className={s.card__img} src="https://i.pinimg.com/originals/6c/ff/a7/6cffa7dc642c4d27bbb41768580d1a6c.jpg" alt="" />
                            <div className={s.card__allBlock}>
                                <div className={s.card__textBlock}>
                                    <p className={s.card__title}>НАЗВАНИЕ</p>
                                    <div className={s.card__about}>
                                        <p className={s.card__name}>СТАТИСТИКА ВИДЕО</p>
                                        <p className={s.card__descr}>ОПИСАНИЕ</p>
                                    </div>
                                </div>
                            </div>
                        </article>
                        <article className={s.history__card}>
                            <img className={s.card__img} src="https://i.pinimg.com/originals/6c/ff/a7/6cffa7dc642c4d27bbb41768580d1a6c.jpg" alt="" />
                            <div className={s.card__allBlock}>
                                <div className={s.card__textBlock}>
                                    <p className={s.card__title}>НАЗВАНИЕ</p>
                                    <div className={s.card__about}>
                                        <p className={s.card__name}>СТАТИСТИКА ВИДЕО</p>
                                        <p className={s.card__descr}>ОПИСАНИЕ</p>
                                    </div>
                                </div>
                            </div>
                        </article>
                        <article className={s.history__card}>
                            <img className={s.card__img} src="https://i.pinimg.com/originals/6c/ff/a7/6cffa7dc642c4d27bbb41768580d1a6c.jpg" alt="" />
                            <div className={s.card__allBlock}>
                                <div className={s.card__textBlock}>
                                    <p className={s.card__title}>НАЗВАНИЕ</p>
                                    <div className={s.card__about}>
                                        <p className={s.card__name}>СТАТИСТИКА ВИДЕО</p>
                                        <p className={s.card__descr}>ОПИСАНИЕ</p>
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


    