// ChannelPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Container from '/src/Components/Container/Container';

function ChannelPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [channel, setChannel] = useState(null);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCoursePreview, setNewCoursePreview] = useState('');

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

        try {
            const res = await fetch(`/api/channels/${id}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newCourseName.trim(),
                    is_public: true,
                    preview: newCoursePreview.trim(),
                })
            });
            if (!res.ok) throw new Error('Ошибка создания курса');
            const newCourse = await res.json();
            setCourses(prev => [...prev, newCourse]);
            setNewCourseName('');
            setNewCoursePreview('');
        } catch (err) {
            console.error(err);
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
        <Container>
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
                                    style={{ cursor: 'pointer', color: 'blue' }}
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

                    <h3>Создать курс</h3>
                    <input
                        type="text"
                        placeholder="Название курса"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Ссылка на превью"
                        value={newCoursePreview}
                        onChange={(e) => setNewCoursePreview(e.target.value)}
                    />
                    <button onClick={handleCreateCourse}>Создать курс</button>
                </>
            ) : (
                <p>Загрузка...</p>
            )}
        </Container>
    );
}

export default ChannelPage;