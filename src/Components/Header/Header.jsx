import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import s from './Header.module.css'
import Container from '/src/Components/Container/Container'

function Header(props) {
    let token = null
    if (localStorage.token) {
        token = localStorage.token
    }

    async function me(token) {
            try {
                const response = await fetch(`${props.API_IP}/api/auth/me`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `${token}`,
                        'Accept': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Ошибка ${response.status}`)
                }
    
                const data = await response.json();
    
                if (response.ok) {
                    console.log('Успешно:', data);
                    await props.setAvatarUrl(data.avatar_url)
                }
            } catch (error) {
                console.error('Ошибка:', error);
            }
        }
        useEffect(() => {
            me(`Bearer ${token}`)
        }, [])

    let navigate = useNavigate()

    function toggleSearch(e, id) {
        id == 0 ? e.target.parentElement.getElementsByClassName(s.header__allInputMobile)[0].style.display = 'flex' : e.target.closest('svg').parentElement.parentElement.getElementsByClassName(s.header__allInputMobile)[0].style.display = 'none'
    }

    return (
        <>
            <header className={`${s.header} ${props.modalOpened ? s.lowOpacity : ''}`}>
                <Container>
                    <div className={s.header__all}>
                        <img onClick={() => navigate('/')} className={s.header__logo} src="/img/logo.png" alt="Логотип" />
                        <div className={s.header__allInput}>
                            <input placeholder='Название курса' className={s.header__input} type="text" />
                            <img className={s.header__search} src="/img/searchIcon.svg" alt="Логотип" />
                        </div>
                        <img onClick={(e) => toggleSearch(e, 0)} className={s.header__mobileSearch} src="/img/searchIcon.svg" alt="Логотип" />
                        <hr />
                        <div className={s.header__account}>
                            <label className={s.switch}>
                                <span className={s.sun}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="#ffd43b"><circle r="5" cy="12" cx="12"></circle><path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path></g></svg></span>
                                <span className={s.moon}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path></svg></span>
                                <input onChange={props.toggleTheme} type="checkbox" className={s.input} checked={props.theme === 'dark'} />
                                <span className={s.slider}></span>
                            </label>
                            <img onClick={() => !token ? props.setModalOpened(props.modalOpened ? false : true) : navigate('/user')} className={s.header__avatar} src={props.avatarUrl ? props.avatarUrl : '/img/emptyAvatar.jpg'} alt="" />
                        </div>
                        <div className={s.header__allInputMobile}>
                            <input placeholder='Название курса' className={s.header__input} type="text" />
                            <img className={s.header__search} src="/img/searchIcon.svg" alt="Логотип" />
                            <svg onClick={(e) => toggleSearch(e, 1)} className={s.header__cross} viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnssketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cross</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" sketchtype="MSPage"> <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-469.000000, -1041.000000)" fill="#000000"> <path d="M487.148,1053.48 L492.813,1047.82 C494.376,1046.26 494.376,1043.72 492.813,1042.16 C491.248,1040.59 488.712,1040.59 487.148,1042.16 L481.484,1047.82 L475.82,1042.16 C474.257,1040.59 471.721,1040.59 470.156,1042.16 C468.593,1043.72 468.593,1046.26 470.156,1047.82 L475.82,1053.48 L470.156,1059.15 C468.593,1060.71 468.593,1063.25 470.156,1064.81 C471.721,1066.38 474.257,1066.38 475.82,1064.81 L481.484,1059.15 L487.148,1064.81 C488.712,1066.38 491.248,1066.38 492.813,1064.81 C494.376,1063.25 494.376,1060.71 492.813,1059.15 L487.148,1053.48" id="cross" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>
                        </div>
                    </div>

                </Container>
            </header>
        </>
    )
}

export default Header