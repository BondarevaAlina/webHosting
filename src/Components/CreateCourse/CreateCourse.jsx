import s from './CreateCourse.module.css'
import Container from '/src/Components/Container/Container'

function CreateCourse(props) {

    return (
        <>
            <section className={s.newcourse}>
                <Container>
                    <h2>Создание курса</h2>
                    <div className={s.newcourse__addBlock}>
                        <article className={s.newcourse__card}>
                            <div className={s.card__add}>+</div>
                            <p className={s.card__text}>СОЗДАТЬ КУРС</p>
                        </article>
                        <article className={s.newcourse__card}>
                            <div className={s.card__add}>+</div>
                            <p className={s.card__text}>ЗАГРУЗИТЬ ВИДЕО</p>
                        </article>
                    </div>
                </Container>
            </section>
        </>
    )
}

export default CreateCourse