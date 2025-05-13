import s from './Footer.module.css'
import Container from '/src/Components/Container/Container'

function Footer() {
    return (
        <>
            <footer className={s.footer}>
                <Container>
                    <div className={s.footer__all}>
                        <div className={s.footer__logos}>
                            <img className={s.footer__logo} src="/public/img/logo.png" alt="Логотип" />
                        </div>
                        <div className={s.footer__links}>
                            <a className={s.footer__link} href="mailto:support@edustreams.ru">support@edustreams.ru</a>
                            <a className={s.footer__link} href="tel:89528128080">+79528128080</a>
                            <div className={s.footer__group}>
                                <img className={s.footer__tgLogo} src="/public/img/tgLogo.svg" alt="" />
                                <p>EduStream Group</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </footer>
        </>
    )
}

export default Footer