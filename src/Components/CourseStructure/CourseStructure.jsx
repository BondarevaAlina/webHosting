import React, { useState, useEffect, useRef } from "react";
import styles from "./CourseStructure.module.css";
import Container2 from "/src/Components/Container2/Container2";

/* ----------------------------------------------------
 *  UTILS
 * --------------------------------------------------*/
const isURL = (str) => /^(https?:)?\/\//i.test(str);

export default function CourseStructure({ courseId, token: propToken }) {
  /* ----------------------------------------------------
   *  STATE & CONSTANTS
   * --------------------------------------------------*/
  const token = propToken || localStorage.getItem("token");
  const [channelId, setChannelId] = useState(null);
  const [structure, setStructure] = useState({ content: [] });
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);
  const postingRef = useRef(false);

  const structureURL = `/api/courses/${courseId}/structure/`;
  const courseURL = `/api/courses/${courseId}`;

  /* ----------------------------------------------------
   *  HELPERS
   * --------------------------------------------------*/
  const makeHeaders = () => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const fetchStructure = async () => {
    try {
      const r = await fetch(structureURL, {
        headers: makeHeaders(),
        cache: "no-cache",
      });
      if (r.ok) return (await r.json()).structure;
      if (r.status === 404) return { content: [] };
      throw new Error(`GET ${r.status}`);
    } catch (e) {
      console.error(e);
      setError("Не удалось загрузить структуру курса.");
      return { content: [] };
    }
  };

  const fetchChannelId = async () => {
    try {
      const r = await fetch(courseURL, { headers: makeHeaders() });
      if (!r.ok) return;
      const data = await r.json();
      setChannelId(data.channel_id);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchChannelId();
    fetchStructure().then(setStructure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, token]);

  /* generic PATCH helper */
  const patchStructure = async (updated) => {
    const resp = await fetch(structureURL, {
      method: "PATCH",
      headers: makeHeaders(),
      cache: "no-cache",
      body: JSON.stringify({ structure: updated }),
    });
    if (resp.ok || resp.status === 201) {
      const fresh = await fetchStructure();
      setStructure(fresh);
      return true;
    }
    const text = await resp.text().catch(() => "");
    setError(`PATCH ${resp.status}${text ? `: ${text}` : ""}`);
    return false;
  };

  /* ----------------------------------------------------
   *  MODULE ACTIONS
   * --------------------------------------------------*/
  const promptName = (msg, def = "") => {
    const n = window.prompt(msg, def.trim());
    return n ? n.trim() : null;
  };

  const addModule = async () => {
    if (postingRef.current) return;
    const newName = promptName("Название модуля?");
    if (!newName) return;
    postingRef.current = true;
    setIsPosting(true);
    setError(null);
    try {
      const current = await fetchStructure();
      const newItem = {
        module: { name: newName, is_active: true, submodules: [] },
        submodule: null,
        lesson: null,
      };
      const updated = { content: [...current.content, newItem] };
      await patchStructure(updated);
    } finally {
      postingRef.current = false;
      setIsPosting(false);
    }
  };

  const editModuleName = async (idx) => {
    const currentName = structure.content[idx].module.name;
    const newName = promptName("Новое название модуля", currentName);
    if (!newName || newName === currentName) return;
    const current = await fetchStructure();
    current.content[idx].module.name = newName;
    await patchStructure({ content: current.content });
  };

  const deleteModule = async (idx) => {
    if (!window.confirm("Удалить модуль?")) return;
    const current = await fetchStructure();
    current.content.splice(idx, 1);
    await patchStructure({ content: current.content });
  };

  /* ----------------------------------------------------
   *  SUBMODULE ACTIONS
   * --------------------------------------------------*/
  const addSubmodule = async (moduleIndex) => {
    const subName = promptName("Название подмодуля?");
    if (!subName) return;
    const current = await fetchStructure();
    const subs = [...(current.content[moduleIndex].module.submodules || [])];
    subs.push({ name: subName, lessons: [] });
    current.content[moduleIndex].module.submodules = subs;
    await patchStructure({ content: current.content });
  };

  const editSubmoduleName = async (moduleIndex, subIndex) => {
    const currentName =
      structure.content[moduleIndex].module.submodules[subIndex].name;
    const newName = promptName("Новое название подмодуля", currentName);
    if (!newName || newName === currentName) return;
    const current = await fetchStructure();
    current.content[moduleIndex].module.submodules[subIndex].name = newName;
    await patchStructure({ content: current.content });
  };

  /* ----------------------------------------------------
   *  LESSON ACTIONS
   * --------------------------------------------------*/
  const addLesson = async (moduleIndex, subIndex) => {
    const title = promptName("Название урока?");
    if (!title) return;
    const current = await fetchStructure();
    const lessons = current.content[moduleIndex].module.submodules[subIndex].lessons;
    const num = lessons.length + 1;
    lessons.push({ name: `Урок ${num}: ${title}`, homework: false, content: [] });
    await patchStructure({ content: current.content });
  };

  const uploadVideoToLesson = async (moduleIndex, subIndex, lessonIndex) => {
    if (!channelId) {
      alert("Не удалось определить channel_id");
      return;
    }
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        // 1) Obtain upload URL
        const res = await fetch(`/api/upload/video?channel_id=${channelId}`, {
          method: "POST",
          headers: makeHeaders(),
          body: JSON.stringify({ file_name: file.name, content_type: file.type }),
        });
        if (!res.ok) throw new Error(await res.text());
        const { upload_url, public_url } = await res.json();
        // 2) PUT the file
        const putResp = await fetch(upload_url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "x-amz-acl": "public-read",
          },
          body: file,
        });
        if (!putResp.ok) {
          throw new Error(`Ошибка S3: ${putResp.status}`);
        }
        // 3) Save public_url into lesson.content[0]
        const current = await fetchStructure();
        const lesson = current.content[moduleIndex].module.submodules[subIndex].lessons[lessonIndex];
        lesson.content = lesson.content.filter((c) => !isURL(c)); // remove old video URL if any
        lesson.content.unshift(public_url);
        await patchStructure({ content: current.content });
      } catch (err) {
        console.error(err);
        alert("Ошибка загрузки видео");
      }
    };
    fileInput.click();
  };

  /* ----------------------------------------------------
   *  HOMEWORK ACTIONS
   * --------------------------------------------------*/
  const addHomework = async (moduleIndex, subIndex, lessonIndex) => {
    const hwText = promptName("Текст домашнего задания?");
    if (!hwText) return;
    const current = await fetchStructure();
    const lesson = current.content[moduleIndex].module.submodules[subIndex].lessons[lessonIndex];

    lesson.homework = true; // всегда булево
    lesson.content.push(hwText);
    await patchStructure({ content: current.content });
  };

  /* ----------------------------------------------------
   *  EXPAND/COLLAPSE
   * --------------------------------------------------*/
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedSubmodules, setExpandedSubmodules] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});

  const toggleModule = (n) => setExpandedModules((p) => ({ ...p, [n]: !p[n] }));
  const toggleSubmodule = (m, s) =>
    setExpandedSubmodules((p) => ({
      ...p,
      [m]: { ...(p[m] || {}), [s]: !p[m]?.[s] },
    }));
  const toggleLesson = (m, s, l) =>
    setExpandedLessons((p) => ({
      ...p,
      [m]: {
        ...(p[m] || {}),
        [s]: { ...(p[m]?.[s] || {}), [l]: !p[m]?.[s]?.[l] },
      },
    }));

  /* ----------------------------------------------------
   *  RENDER HELPERS
   * --------------------------------------------------*/
  const getVideoURL = (contentArr) => contentArr.find((c) => isURL(c));
  const getHomeworkList = (contentArr) => contentArr.filter((c) => !isURL(c));

  /* ----------------------------------------------------
   *  RENDER
   * --------------------------------------------------*/
  return (
    <Container2>
      <div className={styles.container}>
        {error && <div className={styles.error}>{error}</div>}

        {/* New module row */}
        <div className={styles.newModuleRow}>
          <button className={styles.button} onClick={addModule} disabled={isPosting}>
            + Модуль
          </button>
        </div>

        {structure.content.length === 0 ? (
          <p className={styles.empty}>Нет модулей.</p>
        ) : (
          <ul className={styles.list}>
            {structure.content.map((item, mIdx) => {
              const module = item.module;
              if (!module) return null;
              const open = expandedModules[module.name];
              return (
                <li key={mIdx} className={styles.moduleItem}>
                  <div className={styles.moduleHeader}>
                    <button className={styles.toggleButton} onClick={() => toggleModule(module.name)}>
                      {open ? "–" : "+"}
                    </button>
                    <span className={styles.moduleName}>{module.name}</span>
                    <button className={styles.editButton} onClick={() => editModuleName(mIdx)}>
                      ✎
                    </button>
                    <button className={styles.deleteButton} onClick={() => deleteModule(mIdx)}>
                      ×
                    </button>
                  </div>

                  {open && (
                    <ul className={styles.submoduleList}>
                      {module.submodules.map((sub, sIdx) => {
                        const subOpen = expandedSubmodules[module.name]?.[sub.name];
                        return (
                          <li key={sIdx} className={styles.submoduleItem}>
                            <div className={styles.submoduleHeader}>
                              <button
                                className={styles.toggleButton}
                                onClick={() => toggleSubmodule(module.name, sub.name)}
                              >
                                {subOpen ? "–" : "+"}
                              </button>
                              <span className={styles.submoduleName}>{sub.name}</span>
                              <button className={styles.editButton} onClick={() => editSubmoduleName(mIdx, sIdx)}>
                                ✎
                              </button>
                            </div>
                            {subOpen && (
                              <>
                                <ul className={styles.lessonList}>
                                  {sub.lessons.map((lesson, lIdx) => {
                                    const lessonOpen = expandedLessons[module.name]?.[sub.name]?.[lesson.name];
                                    const videoURL = getVideoURL(lesson.content);
                                    const hwList = getHomeworkList(lesson.content);
                                    return (
                                      <li key={lIdx} className={styles.lessonItem}>
                                        <div className={styles.lessonHeader}>
                                          <button
                                            className={styles.toggleButton}
                                            onClick={() => toggleLesson(module.name, sub.name, lesson.name)}
                                          >
                                            {lessonOpen ? "–" : "+"}
                                          </button>
                                          {videoURL ? (
                                            <a href={videoURL} target="_blank" rel="noopener noreferrer">
                                              {lesson.name}
                                            </a>
                                          ) : (
                                            <span>{lesson.name}</span>
                                          )}
                                          <button
                                            className={styles.lessonButton}
                                            onClick={() => uploadVideoToLesson(mIdx, sIdx, lIdx)}
                                          >
                                            ⬆︎ Видео
                                          </button>
                                        </div>
                                        {lessonOpen && (
                                          <div className={styles.homeworkSection}>
                                            {lesson.homework && hwList.length > 0 ? (
                                              <ul className={styles.homeworkList}>
                                                {hwList.map((hw, hIdx) => (
                                                  <li key={hIdx} className={styles.homeworkItem}>
                                                    {hw}
                                                  </li>
                                                ))}
                                              </ul>
                                            ) : (
                                              <p className={styles.emptyHomework}>Домашних заданий нет.</p>
                                            )}
                                            <button
                                              className={styles.addSubButton}
                                              onClick={() => addHomework(mIdx, sIdx, lIdx)}
                                            >
                                              + Домашка
                                            </button>
                                          </div>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                                <button className={styles.addSubButton} onClick={() => addLesson(mIdx, sIdx)}>
                                  + Урок
                                </button>
                              </>
                            )}
                          </li>
                        );
                      })}
                      <button className={styles.addSubButton} onClick={() => addSubmodule(mIdx)}>
                        + Подмодуль
                      </button>
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Container2>
  );
}
