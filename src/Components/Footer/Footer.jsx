import s from './Footer.module.css'
import Container from '/src/Components/Container/Container'

function Footer(props) {
    return (
        <>
            <footer className={`${s.footer}  ${props.modalOpened ? s.lowOpacity : ''}`}>
                <Container>
                    <div className={s.footer__all}>
                        <p className={s.footer__company}>EduStream</p>
                        <p className={s.footer__mail}>info@edustream.ru</p>
                    </div>
                </Container>
            </footer>
        </>
    )
}

export default Footer