import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Container2 from '/src/Components/Container2/Container2';
import CourseStructure from '../CourseStructure/CourseStructure';
import s from './CoursePage.module.css';

function CoursePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);
    const [rawResponse, setRawResponse] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showModal, setShowModal] = useState(null); // 'senior' | 'junior' | 'student'
    const [targetUserId, setTargetUserId] = useState('');
    const [permissionStatus, setPermissionStatus] = useState('');
    const [expirationDate, setExpirationDate] = useState('');

    const fileInputRef = useRef(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`/api/courses/${id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                const text = await res.text();
                setRawResponse(text);

                if (!res.ok) {
                    console.error('Ошибка сервера:', text);
                    setError(text || 'Ошибка загрузки курса');
                    return;
                }

                const data = JSON.parse(text);
                const normalized = {
                    ...data,
                    preview: data.preview ?? data.preview_url ?? ''
                };

                setCourse(normalized);
            } catch (err) {
                console.error('Ошибка парсинга:', err);
                setError('Не удалось загрузить курс');
            }
        };

        fetchCourse();
    }, [id, token]);

    const handleDelete = async () => {
        if (!course) return;

        try {
            const res = await fetch(`/api/channels/${course.channel_id}/courses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Ошибка при удалении курса');

            alert('Курс удалён');
            navigate('/user');
        } catch (err) {
            console.error('Ошибка удаления:', err);
            setError('Не удалось удалить курс');
        }
    };

    const handlePreviewClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !course) return;

        setIsUploading(true);

        try {
            const metaRes = await fetch(`/api/upload/course_preview?course_id=${course.id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type
                })
            });

            const text = await metaRes.text();

            if (!metaRes.ok) {
                throw new Error(`Ошибка получения upload_url: ${text || metaRes.status}`);
            }

            if (!text || text.trim() === '') {
                throw new Error('Пустой ответ от сервера (upload_url)');
            }

            let meta = JSON.parse(text);

            const putRes = await fetch(meta.upload_url, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                    'x-amz-acl': 'public-read'
                },
                body: file
            });

            if (!putRes.ok) {
                throw new Error(`Ошибка загрузки файла: ${putRes.status}`);
            }

            const patchRes = await fetch(`/api/channels/${encodeURIComponent(course.channel_id)}/courses/${course.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ preview_url: meta.public_url })
            });

            const patchText = await patchRes.text();
            let updatedCourse;

            if (!patchRes.ok) {
                throw new Error(`Ошибка обновления превью: ${patchText || patchRes.status}`);
            }

            if (!patchText || patchText.trim() === '') {
                const previewWithBypassCache = `${meta.public_url}?t=${Date.now()}`;
                updatedCourse = { ...course, preview: previewWithBypassCache };
            } else {
                updatedCourse = JSON.parse(patchText);
            }

            setCourse(updatedCourse);
        } catch (err) {
            console.error('Ошибка при загрузке превью:', err);
            setError(err.message || 'Не удалось загрузить превью');
        } finally {
            setIsUploading(false);
        }
    };

    const handleGrantPermission = async () => {
        if (!targetUserId.trim() || !course) {
            setPermissionStatus('Введите user_id');
            return;
        }

        // определяем роль по открытому модальному окну
        const role = showModal === 'senior' ? 'senior' : showModal === 'junior' ? 'junior' : 'student';

        const payload = {
            user_id: targetUserId.trim(),
            role,                                           
            ...(expirationDate && {
                expiration_date: new Date(expirationDate).toISOString()
            })
        };

        try {
            const res = await fetch(`/api/courses/${course.id}/permissions`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)                 // ← теперь тело есть
            });

            const text = await res.text();

            if (!res.ok) {
                const err = JSON.parse(text);
                setPermissionStatus(`Ошибка: ${err.detail?.[0]?.msg || res.status}`);
                return;
            }

            const data = JSON.parse(text);
            setPermissionStatus(`Успешно назначено. ID: ${data.user_id}`);
        } catch (e) {
            console.error('Ошибка запроса:', e);
            setPermissionStatus('Сетевая ошибка или ошибка сервера');
        }
    };


    return (
        <>
            <section style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                {error && (
                    <div style={{ color: 'red' }}>
                        <p>Ошибка: {error}</p>
                        <details>
                            <summary>Подробности</summary>
                            <pre style={{ whiteSpace: 'pre-wrap' }}>{rawResponse}</pre>
                        </details>
                    </div>
                )}
                {course ? (
                    <Container2>
                        <div className={s.course__aboutAll}>
                            <div className={s.course__mainInfo}>
                                <h1 className={s.mainColors}>{course.name}</h1>
                                <p className={s.mainColors}>Канал: {course.channel_id}</p>
                                <p className={s.mainColors}>Студентов: {course.student_count}</p>
                                <p className={s.mainColors}>Создан: {new Date(course.created_at).toLocaleString()}</p>
                                <button
                                    style={{
                                        marginTop: '1rem',
                                        color: 'white',
                                        background: 'red',
                                        padding: '0.5rem 1rem',
                                        border: 'none',
                                        borderRadius: '8px'
                                    }}
                                    onClick={handleDelete}
                                >
                                    Удалить курс
                                </button>
                            </div>

                            <div className={s.course__previews}>
                                <img
                                    className={s.course__preview}
                                    src={
                                        course.preview
                                            ? `${course.preview}?cachebuster=${Date.now()}`
                                            : 'https://opttour.ru/wp-content/uploads/2015/07/splash.jpg'
                                    }
                                    alt="Превью курса"
                                    onClick={handlePreviewClick}
                                    style={{
                                        cursor: 'pointer',
                                        opacity: isUploading ? 0.5 : 1
                                    }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />

                                <div className={s.course__buttons}>
                                    <button onClick={() => setShowModal('senior')} className={s.modalButton}>
                                        Назначить старшего модератора
                                    </button>
                                    <button onClick={() => setShowModal('junior')} className={s.modalButton}>
                                        Назначить младшего модератора
                                    </button>
                                    <button onClick={() => setShowModal('student')} className={s.modalButton}>
                                        Управление студентами
                                    </button>
                                </div>
                            </div>
                        </div>

                        {showModal && (
                            <div className={s.modalOverlay}>
                                <div className={s.modal}>
                                    <h2>
                                        {showModal === 'senior' && 'Назначить старшего модератора'}
                                        {showModal === 'junior' && 'Назначить младшего модератора'}
                                        {showModal === 'students' && 'Управление студентами'}
                                    </h2>

                                    {(showModal === 'senior' || showModal === 'junior' || showModal === 'student') ? (
                                        <>
                                            {permissionStatus && <p>{permissionStatus}</p>}

                                            <input
                                                type="text"
                                                placeholder="Введите user_id"
                                                value={targetUserId}
                                                onChange={(e) => setTargetUserId(e.target.value)}
                                                className={s.modalInput}
                                            />

                                            <div className={s.modalEXP}>
                                                <p>Срок истечения прав:</p>
                                                <input
                                                    type="datetime-local"
                                                    value={expirationDate}
                                                    onChange={(e) => setExpirationDate(e.target.value)}
                                                    className={s.modalInput}
                                                />
                                            </div>

                                            <button className={s.modalButton} onClick={handleGrantPermission}>
                                                Назначить
                                            </button>
                                        </>
                                    ) : (
                                        <p>Управление студентами пока не реализовано</p>
                                    )}

                                    <button
                                        onClick={() => {
                                            setShowModal(null);
                                            setTargetUserId('');
                                            setExpirationDate('');
                                            setPermissionStatus('');
                                        }}
                                        className={s.closeButton}
                                    >
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        )}

                    </Container2>
                ) : (
                    !error && <p>Загрузка...</p>
                )}

                {
                    course && (
                        <CourseStructure channelId={course.channel_id} courseId={id} token={token} />)

                }
            </section>
        </>
    );
}

export default CoursePage;
