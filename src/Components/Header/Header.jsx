import s from './Header.module.css'
import Container from '/src/Components/Container/Container'

function Header() {
    return (
        <>
            <Container>
                <div className={s.header}>
                    <img className={s.header__logo} src="/public/img/logo.png" alt="Логотип" />
                    <div className={s.header__allInput}>
                        <input placeholder='Название курса' className={s.header__input} type="text" />
                        <img className={s.header__search} src="/public/img/searchIcon.svg" alt="Логотип" />
                    </div>
                    <hr />
                    <img className={s.header__avatar} src="/public/img/emptyAvatar.jpg" alt="" />
                </div>
            </Container>
        </>
    )
}

export default Header