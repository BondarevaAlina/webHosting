// CoursePage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Container2 from '/src/Components/Container2/Container2';
import s from './CoursePage.module.css'

function CoursePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);
    const [rawResponse, setRawResponse] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            const token = localStorage.getItem('token');
            console.log('Course ID:', id);

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
                setCourse(data);
            } catch (err) {
                console.error('Ошибка парсинга:', err);
                setError('Не удалось загрузить курс');
            }
        };

        fetchCourse();
    }, [id]);

    const handleDelete = async () => {
        if (!course) return;
        const token = localStorage.getItem('token');

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
                <>
                    {course.preview && (
                        <img
                            className={s.course__preview}
                            src={course.preview}
                            alt="Превью курса"
                        />
                    )}
                    <Container2>
                        <h1>{course.name}</h1>
                        <p>Канал: {course.channel_id}</p>
                        <p>Студентов: {course.student_count}</p>
                        <p>Создан: {new Date(course.created_at).toLocaleString()}</p>
                        <button
                            style={{ marginTop: '1rem', color: 'white', background: 'red', padding: '0.5rem 1rem', border: 'none', borderRadius: '8px' }}
                            onClick={handleDelete}
                        >
                            Удалить курс
                        </button>
                    </Container2>
                </>
            ) : (
                !error && <p>Загрузка...</p>
            )}
        </>
    );
}

export default CoursePage;
