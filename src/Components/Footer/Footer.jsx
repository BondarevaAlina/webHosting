import s from './Footer.module.css'
import Container from '/src/Components/Container/Container'

function Footer(props) {
    return (
        <>
            <footer className={`${s.footer}  ${props.modalOpened ? s.lowOpacity : ''}`}>
                <Container>
                    <div className={s.footer__all}>
                        <div className={s.footer__logos}>
                            <img className={s.footer__logo} src="/public/img/logo.png" alt="Логотип" />
                        </div>
                        <div className={s.footer__links}>
                            <p className={s.footer__title}>Контакты EduStream</p>
                            <div className={s.footer__linksAll}>
                                <div className={s.footer__mainGroup}>
                                    <div className={s.footer__group}>
                                        <img className={s.footer__tgLogo} src="/public/img/phoneicon.svg" alt="" />
                                        <a className={s.footer__link} href="mailto:support@edustreams.ru">support@edustreams.ru</a>
                                    </div>
                                    <div className={s.footer__group}>
                                        <img className={s.footer__tgLogo} src="/public/img/mailicon.svg" alt="" />
                                        <a className={s.footer__link} href="tel:89528128080">+79528128080</a>
                                    </div>
                                </div>
                                <div className={s.footer__mainGroup}>
                                    <div className={s.footer__group}>
                                        <img className={s.footer__tgLogo} src="/public/img/tgLogo.svg" alt="" />
                                        <p className={s.footer__groupText}>EduStream Group</p>
                                    </div>
                                    <div className={s.footer__group}>
                                        <img className={s.footer__tgLogo} src="/public/img/vk.svg" alt="" />
                                        <p className={s.footer__groupText}>EduStream Group</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </footer>
        </>
    )
}

export default Footer