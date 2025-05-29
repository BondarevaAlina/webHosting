import { useNavigate } from 'react-router-dom';
import s from './CreateCourse.module.css';
import Container from '/src/Components/Container/Container';
import { useState, useEffect } from 'react';

function CreateCourse(props) {
    const [isPublishing, setIsPublishing] = useState(false);
    const [channels, setChannels] = useState([]);
    const [channelId, setChannelId] = useState(localStorage.getItem('channel_id') || null);
    const [file, setFile] = useState(null);
    const [videoId, setVideoId] = useState(null);
    const [publicUrl, setPublicUrl] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showChannelModal, setShowChannelModal] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchChannels = async () => {
        if (!token) return;
        try {
            const res = await fetch('/api/channels/my', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setChannels(data);
                if (data.length > 0) {
                    setChannelId(data[0].id);
                    localStorage.setItem('channel_id', data[0].id);
                }
            } else {
                console.error('Ожидался массив каналов, получено:', data);
                setChannels([]);
            }
        } catch (err) {
            console.error('Ошибка загрузки каналов:', err);
            setError('Не удалось загрузить каналы');
        }
    };

    useEffect(() => {
        fetchChannels();
    }, []);

    const createNewChannel = async () => {
        if (!newChannelName.trim()) {
            alert('Введите название канала');
            return;
        }

        const exists = Array.isArray(channels) && channels.find(c => c.id === newChannelName.trim());
        if (exists) {
            alert('Канал с таким названием уже существует');
            return;
        }

        try {
            const res = await fetch('/api/channels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id: newChannelName.trim() }),
            });
            if (!res.ok) throw new Error('Ошибка при создании канала');
            setShowChannelModal(false);
            setNewChannelName('');
            await fetchChannels();
        } catch (err) {
            console.error(err);
            setError('Не удалось создать канал');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handlePublish = async () => {
        const videoName = document.querySelector('input[name="name"]').value;
        const videoDescr = document.querySelector('input[name="descr"]').value;

        if (!file || !channelId) {
            alert('Файл или канал не определены');
            return;
        }

        setIsPublishing(true);
        setError(null);

        try {
            const metaRes = await fetch(`/api/upload/video?channel_id=${channelId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content_type: file.type,
                    file_name: file.name,
                }),
            });

            const { upload_url, public_url, video_id } = await metaRes.json();

            const putRes = await fetch(upload_url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'video/mp4',
                    'x-amz-acl': 'public-read'
                },
                body: file,
            });

            if (!putRes.ok) throw new Error('Ошибка загрузки видео');

            setVideoId(video_id);
            setPublicUrl(public_url);

            const publishRes = await fetch(`/api/videos/publish/${video_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: videoName,
                    description: videoDescr,
                    is_free: true,
                    is_public: true,
                    timeline: 0,
                }),
            });

            if (!publishRes.ok) throw new Error('Ошибка публикации');

            alert('Видео успешно загружено и опубликовано!');
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <>
            <section className={s.newcourse}>
                <Container>
                    <h2 className={s.newcourse__title}>Ваши каналы</h2>
                    <div className={s.newcourse__addBlock}>
                        {Array.isArray(channels) && channels.length > 0 ? (
                            channels.map((channel) => (
                                <article onClick={() => navigate(`/channel/${channel.id}`)} key={channel.id} className={s.newcourse__card}>
                                    <div className={s.card__info}>Канал: {channel.id}</div>
                                    <img
                                        src={channel.avatar_url || '/img/placeholder.webp'}
                                        alt="аватар"
                                        style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
                                    />
                                    <p className={s.card__text}>Подписчиков: {channel.subscribers_count}</p>
                                </article>
                            ))
                        ) : (
                            ''
                        )}
                        <article onClick={() => setShowChannelModal(true)} className={s.newcourse__card}>
                            <div className={s.card__add}>+</div>
                            <p className={s.card__text}>Создать канал</p>
                        </article>
                    </div>
                </Container>
            </section>

            {showChannelModal && (
                <div className={s.createModal} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
                    <p onClick={() => setShowChannelModal(false)} className={s.createModal__close}>X</p>
                    <div>
                        <label className={s.createModal__text} htmlFor="channelName">Название канала</label>
                        <input
                            type="text"
                            name="channelName"
                            id="channelName"
                            value={newChannelName}
                            onChange={(e) => setNewChannelName(e.target.value)}
                        />
                    </div>
                    <button className={s.createModal__subm} onClick={createNewChannel}>Создать</button>
                </div>
            )}

            <div className={s.createModal} style={{ display: showModal ? 'block' : 'none' }}>
                <p onClick={() => setShowModal(false)} className={s.createModal__close}>X</p>
                <div>
                    <label className={s.createModal__text} htmlFor="name">Название</label>
                    <input type="text" name="name" id="name" />
                </div>
                <div>
                    <label className={s.createModal__text} htmlFor="descr">Описание</label>
                    <input type="text" name="descr" id="descr" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label className={s.createModal__text} htmlFor="file">Файл</label>
                    <input
                        className={s.createModal__button}
                        type="file"
                        name="file"
                        accept="video/*"
                        onChange={handleFileChange}
                    />
                </div>
                <button className={s.createModal__subm} onClick={handlePublish} disabled={isPublishing}>
                    {isPublishing ? 'Загрузка...' : 'ОПУБЛИКОВАТЬ'}
                </button>
                {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
                {publicUrl && (
                    <p>
                        Готово: <a href={publicUrl} target="_blank" rel="noreferrer">Смотреть видео</a>
                    </p>
                )}
            </div>

            <hr style={{ width: '100%', height: '1px', background: 'gray', marginBottom: '40px' }} />


        </>
    );
}

export default CreateCourse;
