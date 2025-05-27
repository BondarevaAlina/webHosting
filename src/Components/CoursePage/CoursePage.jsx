// CoursePage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Container2 from '/src/Components/Container2/Container2';

function CoursePage() {
    const { id } = useParams();
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

    return (
        <Container2>
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
                    <h1>{course.name}</h1>
                    <p>Канал: {course.channel_id}</p>
                    <p>Студентов: {course.student_count}</p>
                    <p>Создан: {new Date(course.created_at).toLocaleString()}</p>
                    {course.preview && (
                        <img
                            src={course.preview}
                            alt="Превью курса"
                            style={{ width: '300px', borderRadius: '12px' }}
                        />
                    )}
                </>
            ) : (
                !error && <p>Загрузка...</p>
            )}
        </Container2>
    );
}

export default CoursePage;