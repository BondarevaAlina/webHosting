import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import s from './ChannelPage.module.css';
import Container2 from '/src/Components/Container2/Container2';

function ChannelPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [channel, setChannel] = useState(null);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCoursePreview, setNewCoursePreview] = useState(''); // Ссылка на превью
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для открытия/закрытия модалки

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                const res = await fetch(`/api/channels/${id}`, {
                    headers: { 'Accept': 'application/json' }
                });
                if (!res.ok) throw new Error('Ошибка загрузки канала');
                const data = await res.json();
                setChannel(data);
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить канал');
            }
        };

        const fetchCourses = async () => {
            try {
                const res = await fetch(`/api/channels/${id}/courses`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (!res.ok) throw new Error('Ошибка загрузки курсов');
                const data = await res.json();
                setCourses(data);
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить курсы');
            }
        };

        fetchChannel();
        fetchCourses();
    }, [id, token]);

    const handleCreateCourse = async () => {
    if (!newCourseName.trim()) {
        alert('Введите название курса');
        return;
    }

    if (!newCoursePreview) {
        alert('Введите ссылку на превью курса');
        return;
    }

    try {
        const data = {
            name: newCourseName.trim(),
            is_public: true,  // или по вашему условию, если нужно
            preview: newCoursePreview,  // ссылка на превью
        };

        // Логируем отправляемые данные для отладки
        console.log('Отправляемые данные:', data);

        const res = await fetch(`/api/channels/${id}/courses`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',  // Устанавливаем тип контента как JSON
            },
            body: JSON.stringify(data),  // Преобразуем данные в строку JSON
        });

        if (!res.ok) {
            throw new Error('Ошибка создания курса');
        }

        const newCourse = await res.json();
        setCourses(prev => [...prev, newCourse]);
        setNewCourseName('');
        setNewCoursePreview('');
        setIsModalOpen(false); // Закрытие модалки
    } catch (err) {
        console.error('Ошибка при создании курса:', err);
        setError('Не удалось создать курс');
    }
};

    const handleDeleteCourse = async (courseId) => {
        try {
            const res = await fetch(`/api/channels/${id}/courses/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!res.ok) throw new Error('Ошибка удаления курса');
            setCourses(prev => prev.filter(course => course.id !== courseId));
        } catch (err) {
            console.error(err);
            setError('Не удалось удалить курс');
        }
    };

    return (
        <Container2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {channel ? (
                <>
                    <h1>Канал: {channel.id}</h1>
                    <p>Подписчиков: {channel.subscribers_count}</p>
                    {channel.avatar_url && (
                        <img
                            src={channel.avatar_url}
                            alt="Аватар канала"
                            style={{ width: '300px', borderRadius: '16px' }}
                        />
                    )}

                    <h2>Курсы</h2>
                    <ul>
                        {courses.map(course => (
                            <li key={course.id} style={{ marginBottom: '1rem' }}>
                                <strong
                                    className={s.course__name}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/course/${course.id}`)}
                                >
                                    {course.name}
                                </strong>
                                <span> – Студентов: {course.student_count}</span>
                                <button
                                    style={{ marginLeft: '1rem', color: 'red' }}
                                    onClick={() => handleDeleteCourse(course.id)}
                                >
                                    Удалить
                                </button>
                            </li>
                        ))}
                    </ul>

                    <button className={s.course__createButton} onClick={() => setIsModalOpen(true)}>Создать курс</button>

                    {/* Модальное окно */}
                    {isModalOpen && (
                        <div className={s.modal}>
                            <div className={s.modal__content}>
                                <h3 className={s.modal__h3}>Создать курс</h3>
                                <input
                                    type="text"
                                    placeholder="Название курса"
                                    value={newCourseName}
                                    onChange={(e) => setNewCourseName(e.target.value)}
                                />
                                {/* Заменили инпут для файла на поле ввода ссылки */}
                                <input
                                    type="text"
                                    placeholder="Ссылка на превью курса"
                                    value={newCoursePreview}
                                    onChange={(e) => setNewCoursePreview(e.target.value)}
                                />
                                <button onClick={handleCreateCourse}>Создать курс</button>
                                <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p>Загрузка...</p>
            )}
        </Container2>
    );
}

export default ChannelPage;
