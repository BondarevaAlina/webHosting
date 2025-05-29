// CourseStructure.jsx — v5: исправлен дублирующийся блок в конце
import { useState, useEffect } from 'react';
import s from './CourseStructure.module.css';

function CourseStructure({ courseId, token }) {
    const [structure, setStructure] = useState({ content: [] });
    const [expandedModules, setExpandedModules] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /* ------------ POST патч ---------- */
    const postPatch = async (patch, optimistic = false) => {
        if (optimistic) {
            setStructure(prev => ({ content: [...prev.content, ...patch.content] }));
        }
        try {
            const res = await fetch(`/api/courses/${courseId}/structure/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ structure: patch }),
            });
            if (!res.ok) throw new Error(await res.text());
            await fetchStructure();
        } catch (e) {
            console.error('POST structure fail', e);
            setError('Не удалось сохранить изменения');
        }
    };

    /* ------------ GET структура ---------- */
    const fetchStructure = async () => {
        setLoading(true);
        try {
            const r = await fetch(`/api/courses/${courseId}/structure/`, {
                credentials: 'include',
                headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
            });
            const txt = await r.text();
            if (!r.ok) {
                if (r.status === 404) {
                    setStructure({ content: [] });
                    postPatch({ content: [] });
                } else {
                    throw new Error(txt);
                }
            } else {
                const data = JSON.parse(txt);
                setStructure(data.structure ?? { content: [] });
                setError('');
            }
        } catch (e) {
            console.error('fetch structure error', e);
            setError('Ошибка загрузки структуры');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId && token) fetchStructure();
    }, [courseId, token]);

    /* ------------ хелперы добавления ---------- */
    const addModule = () => {
        const idx = structure.content.length + 1;
        postPatch({ content: [{ module: { name: `Модуль ${idx}`, is_active: true, submodules: [] } }] }, true);
    };

    const addSubmodule = (mIdx) => {
        const subIdx = structure.content[mIdx].module.submodules.length + 1;
        postPatch({ content: [{ module: { name: structure.content[mIdx].module.name, is_active: true, submodules: [{ name: `Подмодуль ${mIdx+1}.${subIdx}`, lessons: [] }] } }] });
    };

    const addLesson = (mIdx, sIdx) => {
        const lIdx = structure.content[mIdx].module.submodules[sIdx].lessons.length + 1;
        postPatch({ content: [{ module: { name: structure.content[mIdx].module.name, is_active: true, submodules: [{ name: structure.content[mIdx].module.submodules[sIdx].name, lessons: [{ name: `Урок ${mIdx+1}.${sIdx+1}.${lIdx}`, homework: false, content: [`video_${mIdx+1}_${sIdx+1}_${lIdx}.mp4`] }] }] } }] });
    };

    /* ------------ рендер UI ---------- */
    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className={s.structureBlock}>
                {structure.content.map((item, mi) => (
                    <div key={mi} className={s.module}>
                        <div className={s.moduleHeader}>
                            <strong onClick={() => setExpandedModules(p => ({ ...p, [mi]: !p[mi] }))}>
                                {expandedModules[mi] ? '▼' : '▶'} {item.module.name}
                            </strong>
                            <button onClick={() => addSubmodule(mi)}>+ Подмодуль</button>
                        </div>
                        {expandedModules[mi] && item.module.submodules.length > 0 && (
                            <div className={s.submodules}>
                                {item.module.submodules.map((sub, si) => (
                                    <div key={si} className={s.submodule}>
                                        <div className={s.submoduleHeader}>
                                            <span>{sub.name}</span>
                                            <button onClick={() => addLesson(mi, si)}>+ Урок</button>
                                        </div>
                                        <ul>
                                            {sub.lessons.map((les, li) => <li key={li}>{les.name}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <button onClick={addModule}>+ Модуль</button>
            </div>
        </div>
    );
}

export default CourseStructure;
