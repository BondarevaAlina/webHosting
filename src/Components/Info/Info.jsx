import { useEffect, useState, useRef } from 'react';
import s from './Info.module.css'
import Container from '/src/Components/Container/Container'
import Loader from '../Loader';

function Info(props) {
    let token = localStorage.getItem('token')
    const [isLoading, setIsLoading] = useState(true);
    let [name, setName] = useState(null)

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
                await setName(data.username)
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
        finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        me(`Bearer ${token}`)
    }, [])

    function changeNickname(e) {
        console.log(e.target.parentElement);
        e = e.target.closest('DIV')
        e.innerHTML = `<input class=${s.info__newInput} type='text' placeholder='Новый никнейм'/> <svg class=${s.info__submit} id="b1" fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 95.172 95.172" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M93.104,0H2.069C0.926,0,0,0.927,0,2.069v91.035c0,1.142,0.927,2.068,2.069,2.068h91.033c1.144,0,2.069-0.927,2.069-2.068 V2.069C95.172,0.927,94.246,0,93.104,0z M76.948,32.546L38.602,70.893c-0.24,0.239-0.555,0.359-0.869,0.359s-0.63-0.12-0.869-0.359 L18.226,52.256c-0.23-0.23-0.36-0.543-0.36-0.869s0.13-0.639,0.36-0.869l6.542-6.542c0.461-0.461,1.277-0.461,1.738,0 l11.227,11.226l30.936-30.936c0.461-0.461,1.277-0.461,1.738,0l6.541,6.542c0.23,0.23,0.361,0.543,0.361,0.869 C77.309,32.003,77.178,32.315,76.948,32.546z"></path> </g> </g></svg>`
        document.getElementById('b1').onclick = function () {

            const input = e.querySelector('input');
            const newNick = input.value;
            console.log(newNick);
            setNewNick(newNick, e);
        }
    }

    async function setNewNick(username, e) {
        console.log(e);

        e.innerHTML = `${username}`
        token = `Bearer ${token}`

        try {
            const response = await fetch(`${props.API_IP}/api/auth/me/username?username=${encodeURIComponent(username)}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}`)
            }

            if (response.ok) {
                console.log('Успешно');
                setName(username)
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    const [avatarUrl, setAvatarUrl] = useState(null);


    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const response = await fetch('http://94.131.97.131/api/upload/avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                }),
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to get upload URL');
            const data = await response.json();

            const putResponse = await fetch(data.upload_url, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                    'x-amz-acl': 'public-read',
                },
                body: file,
            });

            if (!putResponse.ok) throw new Error('Failed to upload avatar');

            props.setAvatarUrl(data.public_url);
            console.log('Аватар загружен.')
        } catch (error) {
            console.error('Ошибка при загрузке аватара:', error);
        }
    };

    useEffect(() => {
        setAvatarUrl(props.avatarUrl);
    }, [props.avatarUrl]);


    if (isLoading) {
        return (
            <>
                <section className={s.info}>
                    <Loader />
                    <hr className={s.info__hr} />
                </section>
            </>
        )
    } else {
        return (
            <section className={s.info}>
                <Container>
                    <div className={s.info__info}>
                        <img className={s.info__avatar} src={avatarUrl ? avatarUrl : '/img/emptyAvatar.jpg'} alt="" />
                        <svg className={s.info__editAvatar} onClick={handleAvatarClick} style={{ maxWidth: '35px', marginLeft: '10px', cursor: 'pointer' }} fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 348.882 348.882" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M333.988,11.758l-0.42-0.383C325.538,4.04,315.129,0,304.258,0c-12.187,0-23.888,5.159-32.104,14.153L116.803,184.231 c-1.416,1.55-2.49,3.379-3.154,5.37l-18.267,54.762c-2.112,6.331-1.052,13.333,2.835,18.729c3.918,5.438,10.23,8.685,16.886,8.685 c0,0,0.001,0,0.001,0c2.879,0,5.693-0.592,8.362-1.76l52.89-23.138c1.923-0.841,3.648-2.076,5.063-3.626L336.771,73.176 C352.937,55.479,351.69,27.929,333.988,11.758z M130.381,234.247l10.719-32.134l0.904-0.99l20.316,18.556l-0.904,0.99 L130.381,234.247z M314.621,52.943L182.553,197.53l-20.316-18.556L294.305,34.386c2.583-2.828,6.118-4.386,9.954-4.386 c3.365,0,6.588,1.252,9.082,3.53l0.419,0.383C319.244,38.922,319.63,47.459,314.621,52.943z"></path> <path d="M303.85,138.388c-8.284,0-15,6.716-15,15v127.347c0,21.034-17.113,38.147-38.147,38.147H68.904 c-21.035,0-38.147-17.113-38.147-38.147V100.413c0-21.034,17.113-38.147,38.147-38.147h131.587c8.284,0,15-6.716,15-15 s-6.716-15-15-15H68.904c-37.577,0-68.147,30.571-68.147,68.147v180.321c0,37.576,30.571,68.147,68.147,68.147h181.798 c37.576,0,68.147-30.571,68.147-68.147V153.388C318.85,145.104,312.134,138.388,303.85,138.388z"></path> </g> </g></svg>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleUpload}
                        />
                        <div className={s.info__name}>{name}
                            <svg className={s.info__edit} onClick={(e) => changeNickname(e)} style={{ maxWidth: '35px', marginLeft: '10px', cursor: 'pointer' }} fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 348.882 348.882" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M333.988,11.758l-0.42-0.383C325.538,4.04,315.129,0,304.258,0c-12.187,0-23.888,5.159-32.104,14.153L116.803,184.231 c-1.416,1.55-2.49,3.379-3.154,5.37l-18.267,54.762c-2.112,6.331-1.052,13.333,2.835,18.729c3.918,5.438,10.23,8.685,16.886,8.685 c0,0,0.001,0,0.001,0c2.879,0,5.693-0.592,8.362-1.76l52.89-23.138c1.923-0.841,3.648-2.076,5.063-3.626L336.771,73.176 C352.937,55.479,351.69,27.929,333.988,11.758z M130.381,234.247l10.719-32.134l0.904-0.99l20.316,18.556l-0.904,0.99 L130.381,234.247z M314.621,52.943L182.553,197.53l-20.316-18.556L294.305,34.386c2.583-2.828,6.118-4.386,9.954-4.386 c3.365,0,6.588,1.252,9.082,3.53l0.419,0.383C319.244,38.922,319.63,47.459,314.621,52.943z"></path> <path d="M303.85,138.388c-8.284,0-15,6.716-15,15v127.347c0,21.034-17.113,38.147-38.147,38.147H68.904 c-21.035,0-38.147-17.113-38.147-38.147V100.413c0-21.034,17.113-38.147,38.147-38.147h131.587c8.284,0,15-6.716,15-15 s-6.716-15-15-15H68.904c-37.577,0-68.147,30.571-68.147,68.147v180.321c0,37.576,30.571,68.147,68.147,68.147h181.798 c37.576,0,68.147-30.571,68.147-68.147V153.388C318.85,145.104,312.134,138.388,303.85,138.388z"></path> </g> </g></svg>
                        </div>
                    </div>
                </Container>
                <hr className={s.info__hr} />
            </section>
        )
    }
}

export default Info