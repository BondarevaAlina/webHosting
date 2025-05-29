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
    const [showModal, setShowModal] = useState(null); // 'senior' | 'junior' | 'students'
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
        if (!targetUserId || !course) {
            setPermissionStatus('Введите user_id');
            return;
        }

        try {
            let url = `/api/courses/${course.id}/permissions?user_id=${encodeURIComponent(targetUserId)}`;
            if (expirationDate) {
                url += `&expiration_date=${encodeURIComponent(expirationDate)}`;
            }

            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const text = await res.text();

            if (!res.ok) {
                let errData;
                try {
                    errData = JSON.parse(text);
                } catch {
                    throw new Error(`Ошибка: ${text || res.status}`);
                }

                console.error('Ошибка:', errData);
                setPermissionStatus(`Ошибка: ${errData.detail?.[0]?.msg || res.status}`);
                return;
            }

            const data = JSON.parse(text);
            setPermissionStatus(`Успешно назначено. ID: ${data.user_id}`);
        } catch (error) {
            console.error('Ошибка запроса:', error);
            setPermissionStatus('Сетевая ошибка или ошибка сервера');
        }
    };

    return (
        <>
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
                            <h1>{course.name}</h1>
                            <p>Канал: {course.channel_id}</p>
                            <p>Студентов: {course.student_count}</p>
                            <p>Создан: {new Date(course.created_at).toLocaleString()}</p>
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
                                <button onClick={() => setShowModal('students')} className={s.modalButton}>
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

                                {(showModal === 'senior' || showModal === 'junior') ? (
                                    <>
                                        {permissionStatus && <p>{permissionStatus}</p>}

                                        <input
                                            type="text"
                                            placeholder="Введите user_id"
                                            value={targetUserId}
                                            onChange={(e) => setTargetUserId(e.target.value)}
                                            className={s.modalInput}
                                        />

                                        <input
                                            type="datetime-local"
                                            value={expirationDate}
                                            onChange={(e) => setExpirationDate(e.target.value)}
                                            className={s.modalInput}
                                        />

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
            <CourseStructure courseId={id} token={token} />
        </>
    );
}

export default CoursePage;
