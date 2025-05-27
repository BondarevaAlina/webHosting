import React, { useEffect, useState, useRef } from 'react';
import s from './YVideos.module.css';
import Hls from 'hls.js';
import Container from '/src/Components/Container/Container';

function YVideos(props) {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchMyVideos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Нет токена авторизации');
        return;
      }

      try {
        const res = await fetch('/api/videos/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });

        if (!res.ok) {
          const text = await res.text();
          console.error('Ошибка при загрузке видео:', res.status, text);
          throw new Error('Не удалось получить видео');
        }

        const data = await res.json();
        const filtered = data.filter(video => video.name);
        setVideos(filtered);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchMyVideos();
  }, []);

  useEffect(() => {
    if (activeVideo && videoRef.current) {
      const video = videoRef.current;
      const url = activeVideo.video_url;

      // Сброс источника
      video.removeAttribute('src');
      video.load();

      if (url.endsWith('.m3u8') && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
        });
      } else {
        // Обычный .mp4 или другой формат
        video.src = url;
      }
    }
  }, [activeVideo]);

  return (
    <section className={s.yvideos}>
      <Container>
        <h2 className={s.yvideos__title}>Ваши видео</h2>
        {error && <p className={s.error}>Ошибка: {error}</p>}

        <div className={s.videoGrid}>
          {videos.map((video) => (
            <div
              key={video.id}
              className={s.videoCard}
              onClick={() => setActiveVideo(video)}
            >
              <img
                src={video.preview_url || '/img/placeholder.webp'}
                alt={video.name}
                className={s.preview}
              />
              <div className={s.videoInfo}>
                <h3>{video.name}</h3>
                <p>{video.description || 'Без описания'}</p>
              </div>
            </div>
          ))}
        </div>

        {activeVideo && (
          <div className={s.videoPlayerModal}>
            <h3>{activeVideo.name}</h3>
            <video
              ref={videoRef}
              controls
              autoPlay
              style={{ width: '100%', maxHeight: '500px', borderRadius: '8px' }}
            />
            <button
              className={s.closeBtn}
              onClick={() => setActiveVideo(null)}
            >
              Закрыть
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}

export default YVideos;
