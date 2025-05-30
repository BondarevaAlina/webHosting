// Playlists.jsx
import React from 'react';
import styles from './Playlists.module.css';
import Container from '/src/Components/Container/Container'

export default function Playlists() {

  const playlists = [
    { id: '1', thumbnail: 'https://avatars.mds.yandex.net/i?id=ba472197999158cf11bd03238cbc3a89_l-5298203-images-thumbs&n=13', title: 'Плейлист 1', count: 12 },
    { id: '2', thumbnail: 'https://avatars.mds.yandex.net/i?id=ba472197999158cf11bd03238cbc3a89_l-5298203-images-thumbs&n=13', title: 'Плейлист 2', count: 7 },
    { id: '3', thumbnail: 'https://avatars.mds.yandex.net/i?id=ba472197999158cf11bd03238cbc3a89_l-5298203-images-thumbs&n=13', title: 'Плейлист 3', count: 5 },
    { id: '4', thumbnail: 'https://avatars.mds.yandex.net/i?id=ba472197999158cf11bd03238cbc3a89_l-5298203-images-thumbs&n=13', title: 'Плейлист 4', count: 9 },
  ];

  return (
    <section className={styles.container}>
      <Container>
        <h2 className={styles.heading}>Плейлисты</h2>
        <div className={styles.list}>
          {playlists.map(pl => (
            <div key={pl.id} className={styles.card}>
              <img
                src={pl.thumbnail}
                alt={pl.title}
                className={styles.thumb}
              />
              <div className={styles.info}>
                <h3 className={styles.title}>{pl.title}</h3>
                <p className={styles.count}>{pl.count} видео</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
