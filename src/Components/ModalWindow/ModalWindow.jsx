import { useEffect, useState } from 'react';
import s from './ModalWindow.module.css'

function Modal(props) {
    let [typeLogin, setTypeLogin] = useState('login')

    async function register(e) {
        e.preventDefault();

        try {
            let email = e.target.closest('form').getElementsByClassName(s.modal__input)[0].value
            let password = e.target.closest('form').getElementsByClassName(s.modal__input)[1].value
            console.log(email, password);

            const response = await fetch(`${props.API_IP}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            console.log('Успешно:', data);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    async function login(e) {
        e.preventDefault();

        try {
            let grant_type = 'password'
            let scope = 'scope'
            let username = e.target.closest('form').getElementsByClassName(s.modal__input)[0].value
            let password = e.target.closest('form').getElementsByClassName(s.modal__input)[1].value
            console.log(username, password);

            const params = new URLSearchParams();
            params.append('grant_type', grant_type);
            params.append('username', username);
            params.append('password', password);
            params.append('scope', scope);

            const response = await fetch(`${props.API_IP}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            const data = await response.json();
            console.log('Успешно:', data);
            const token = await data.access_token
            localStorage.setItem("token", token)
            await me(token)

        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    async function me(token) {
        try {
            const response = await fetch(`${props.API_IP}/api/auth/me`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}`)
            }

            const data = await response.json();

            if (response.ok) {
                props.setAvatarUrl(data.avatar_url)
                console.log('Успешно:', data);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }

    }


    return (
        <>
        <div className={s.modal}>
            <div className={`${s.modalWindow} ${!props.modalOpened ? s.dnone : ''}`}>
                <p className={s.modal__title}>{typeLogin == 'login' ? 'Войти' : 'Регистрация'}</p>
                <form action="POST">
                    <div className={s.modal__group}>
                        <label className={s.modal__label} htmlFor="mail">Почта</label>
                        <input className={s.modal__input} type="email" name="mail" id="mail" />
                    </div>
                    <div className={s.modal__group}>
                        <label className={s.modal__label} htmlFor="tel">Пароль</label>
                        <input className={s.modal__input} type="tel" name="tel" id="tel" />
                    </div>
                    <button onClick={(e) => typeLogin == 'register' ? (register(e), e.preventDefault()) : (login(e), e.preventDefault())} className={s.modal__btn} type="submit">{typeLogin == 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
                    <div className={s.modal__more}>
                        <p onClick={() => setTypeLogin(typeLogin == 'login' ? 'register' : 'login')} className={s.modal__link}>{typeLogin == 'login' ? 'Регистрация' : 'Есть аккаунт?'}</p>
                        <hr className={s.modal__hr} />
                        <p className={s.modal__link}>Забыли пароль?</p>
                    </div>
                </form>
            </div>
                {/* {successLogin && (
                    <div className={`${s.modal__success} ${!props.modalOpened ? s.dnone : ''}`}>
                        <p>Вы успешно {typeLogin == 'register' ? 'зарегестрировались' : 'авторизовались'}</p>
                    </div>
                )} */}
        </div>
        </>
    )
}

export default Modal