import { useEffect, useMemo, useState } from 'react'
import { courseInstructors, courses, courseWeekCounts } from './data.js'
import Icon from './icons.jsx'
import MarkdownDocument from './MarkdownDocument.jsx'

const materialTypeLabels = {
  md: 'Assignment',
  pdf: 'PDF reading',
  video: 'Lecture video',
  youtube: 'Video',
}

const materialTypeIcons = {
  md: 'clipboard',
  pdf: 'file',
  video: 'video',
  youtube: 'youtube',
}

function routeCourseId() {
  const match = window.location.hash.match(/^#\/courses\/([^/]+)$/)
  return match?.[1] ?? null
}

function courseSearchText(course) {
  return [course.id, course.name, course.shortDescription, course.instructor.name].join(' ').toLocaleLowerCase()
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`))
}

function youtubeEmbedUrl(source) {
  try {
    const url = new URL(source)
    const videoId = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v')
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : source
  } catch {
    return source
  }
}

function CourseImage({ course, className = '' }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [course.imageUrl])

  return (
    <div className={`course-image ${failed ? 'course-image--fallback' : ''} ${className}`}>
      {!failed && <img alt="" src={course.imageUrl} onError={() => setFailed(true)} />}
      {failed && <><Icon name="compass" size={32} /><span>{course.id}</span></>}
    </div>
  )
}

function Brand() {
  return (
    <div className="brand" aria-label="Epoch home">
      <span className="brand-mark"><span /></span>
      <span><strong>EPOCH</strong><small>History, in context</small></span>
    </div>
  )
}

function CatalogHeader() {
  return (
    <header className="site-header">
      <a className="brand-link" href="#/"><Brand /></a>
      <nav aria-label="Primary navigation">
        <a className="nav-link nav-link--active" href="#catalog">Course catalog</a>
        <span className="header-count">{courses.length} courses</span>
      </nav>
    </header>
  )
}

function CourseCard({ course, onOpen }) {
  return (
    <article className="course-card">
      <div className="course-card__image-wrap">
        <CourseImage course={course} />
        <span className="course-code">{course.id}</span>
      </div>
      <div className="course-card__body">
        <div className="course-card__meta"><span>{course.weekCount} weeks</span><span>{course.classCount} classes</span></div>
        <h3>{course.name}</h3>
        <p>{course.shortDescription}</p>
        <div className="course-card__footer">
          <span className="instructor-name"><span className="avatar"><img alt="" src={course.instructor.photoUrl} /></span>{course.instructor.name}</span>
          <span className="card-arrow"><Icon name="arrowRight" size={18} /></span>
        </div>
      </div>
      <button className="course-card__action" onClick={() => onOpen(course.id)} type="button" aria-label={`Open ${course.name}`} />
    </article>
  )
}

function Catalog({ onOpenCourse }) {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [weekCount, setWeekCount] = useState('all')
  const [sortOrder, setSortOrder] = useState('catalog')
  const featuredCourse = courses.find((course) => course.id === 'HIST111') ?? courses[0]

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const results = courses.filter((course) => {
      const matchesQuery = !normalizedQuery || courseSearchText(course).includes(normalizedQuery)
      const matchesInstructor = instructorId === 'all' || course.instructor.id === instructorId
      const matchesLength = weekCount === 'all' || course.weekCount === Number(weekCount)
      return matchesQuery && matchesInstructor && matchesLength
    })

    if (sortOrder === 'title') return [...results].sort((first, second) => first.name.localeCompare(second.name))
    if (sortOrder === 'length') return [...results].sort((first, second) => first.weekCount - second.weekCount || first.id.localeCompare(second.id))
    return results
  }, [query, instructorId, weekCount, sortOrder])

  function clearFilters() {
    setQuery('')
    setInstructorId('all')
    setWeekCount('all')
    setSortOrder('catalog')
  }

  return (
    <div className="catalog-page">
      <CatalogHeader />
      <main>
        <section className="catalog-hero">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Online history courses</p>
            <h1>The past is never<br />just <em>past.</em></h1>
            <p className="hero-intro">Follow the ideas, empires, encounters, and ordinary lives that shaped our world. Every course is built around evidence, context, and a better question.</p>
            <a className="hero-link" href="#catalog">Explore the catalog <Icon name="arrowRight" size={18} /></a>
          </div>
          <a className="featured-course" href={`#/courses/${featuredCourse.id}`} onClick={(event) => { event.preventDefault(); onOpenCourse(featuredCourse.id) }}>
            <CourseImage course={featuredCourse} />
            <span className="featured-shade" />
            <span className="featured-kicker">Course spotlight</span>
            <span className="featured-content">
              <span>{featuredCourse.id} · {featuredCourse.weekCount} weeks</span>
              <strong>{featuredCourse.name}</strong>
              <span className="featured-action">View course <Icon name="arrowRight" size={17} /></span>
            </span>
          </a>
        </section>

        <section className="catalog-section" id="catalog" aria-labelledby="catalog-heading">
          <div className="section-heading">
            <div><p className="section-index">01 / COURSE CATALOG</p><h2 id="catalog-heading">Choose where to begin.</h2></div>
            <p>From the ancient world to the twentieth century, explore history through connected people, places, and ideas.</p>
          </div>

          <div className="catalog-tools" aria-label="Course search and filters">
            <label className="search-field">
              <span className="sr-only">Search courses</span>
              <Icon name="search" size={19} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a place, period, or course" type="search" />
              {query && <button aria-label="Clear search" onClick={() => setQuery('')} type="button"><Icon name="x" size={17} /></button>}
            </label>
            <label className="select-field">
              <span className="sr-only">Filter by instructor</span>
              <Icon name="user" size={18} />
              <select value={instructorId} onChange={(event) => setInstructorId(event.target.value)}>
                <option value="all">All instructors</option>
                {courseInstructors.map((instructor) => <option key={instructor.id} value={instructor.id}>{instructor.name}</option>)}
              </select>
              <Icon name="chevronDown" size={16} />
            </label>
            <label className="select-field select-field--compact">
              <span className="sr-only">Filter by course length</span>
              <Icon name="calendar" size={18} />
              <select value={weekCount} onChange={(event) => setWeekCount(event.target.value)}>
                <option value="all">Any length</option>
                {courseWeekCounts.map((weeks) => <option key={weeks} value={weeks}>{weeks} weeks</option>)}
              </select>
              <Icon name="chevronDown" size={16} />
            </label>
            <label className="select-field select-field--compact">
              <span className="sr-only">Sort courses</span>
              <Icon name="layers" size={18} />
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                <option value="catalog">Catalog order</option>
                <option value="title">Title A–Z</option>
                <option value="length">Shortest first</option>
              </select>
              <Icon name="chevronDown" size={16} />
            </label>
          </div>

          <div className="results-line" aria-live="polite">
            <span><strong>{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'course' : 'courses'}</span>
            {(query || instructorId !== 'all' || weekCount !== 'all' || sortOrder !== 'catalog') && <button type="button" onClick={clearFilters}>Reset filters</button>}
          </div>

          {filteredCourses.length ? (
            <div className="course-grid">{filteredCourses.map((course) => <CourseCard course={course} key={course.id} onOpen={onOpenCourse} />)}</div>
          ) : (
            <div className="empty-state"><Icon name="compass" size={34} /><h3>No courses found</h3><p>Try a broader search or clear the filters.</p><button type="button" onClick={clearFilters}>Show all courses</button></div>
          )}
        </section>
      </main>
      <footer className="site-footer"><Brand /><p>History rewards the curious.</p><span>Course catalog · 2026</span></footer>
    </div>
  )
}

function MaterialButton({ material, selected, onSelect }) {
  return (
    <button className={`material-button ${selected ? 'material-button--selected' : ''}`} onClick={() => onSelect(material)} type="button" aria-pressed={selected}>
      <span className="material-icon"><Icon name={materialTypeIcons[material.type]} size={17} /></span>
      <span><strong>{material.title}</strong><small>{materialTypeLabels[material.type]}</small></span>
      <Icon name="arrowRight" size={15} />
    </button>
  )
}

function MaterialViewer({ course, material }) {
  if (!material) {
    return (
      <div className="course-cover" data-testid="course-cover">
        <CourseImage course={course} />
        <div className="course-cover__shade" />
        <div className="course-cover__caption">
          <span>{course.id} · Course overview</span>
          <h2>{course.name}</h2>
          <p>{course.shortDescription}</p>
        </div>
        <div className="cover-coordinate">{course.weekCount} WEEKS <span /> {course.classCount} CLASSES</div>
      </div>
    )
  }

  if (material.type === 'pdf') {
    return <div className="document-frame"><iframe src={`${material.source}#view=FitH`} title={material.title} /><a href={material.source} target="_blank" rel="noreferrer">Open PDF in a new tab <Icon name="arrowRight" size={15} /></a></div>
  }

  if (material.type === 'video') {
    return <div className="video-frame"><video controls preload="metadata" src={material.source}>Your browser does not support embedded video.</video></div>
  }

  if (material.type === 'youtube') {
    return <div className="video-frame"><iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen src={youtubeEmbedUrl(material.source)} title={material.title} /></div>
  }

  if (material.type === 'md') {
    return <div className="markdown-frame"><MarkdownDocument source={material.content} /></div>
  }

  return <div className="viewer-empty"><Icon name="file" size={32} /><p>This material cannot be previewed.</p></div>
}

function CourseSidebar({ course, selectedMaterial, onSelectMaterial }) {
  return (
    <div className="sidebar-scroll">
      <div className="course-summary">
        <p className="course-summary__code">{course.id} / ONLINE COURSE</p>
        <h1>{course.name}</h1>
        <p>{course.longDescription}</p>
        <div className="course-facts">
          <div><Icon name="calendar" size={17} /><span><small>Duration</small><strong>{course.weekCount} weeks</strong></span></div>
          <div><Icon name="book" size={17} /><span><small>Schedule</small><strong>{course.classCount} classes</strong></span></div>
        </div>
        <div className="instructor-card">
          <img alt="" src={course.instructor.photoUrl} />
          <span><small>COURSE INSTRUCTOR</small><strong>{course.instructor.name}</strong><a href={`mailto:${course.instructor.email}`}>{course.instructor.email}</a></span>
        </div>
      </div>

      <div className="syllabus-section">
        <div className="syllabus-heading"><div><p>COURSE CONTENT</p><h2>Syllabus</h2></div><span>{course.classCount} classes</span></div>
        <div className="syllabus-table-wrap">
          <table className="syllabus-table">
            <thead><tr><th>Week</th><th>Date</th><th>Class content</th></tr></thead>
            <tbody>
              {course.classes.map((classMeeting) => (
                <tr key={classMeeting.id}>
                  <td><span className="week-number">{String(classMeeting.week).padStart(2, '0')}</span></td>
                  <td><time dateTime={classMeeting.date}>{formatDate(classMeeting.date)}</time></td>
                  <td>
                    <h3>{classMeeting.name}</h3>
                    {classMeeting.materials.length ? (
                      <div className="material-list">
                        {classMeeting.materials.map((material) => <MaterialButton key={material.id} material={material} selected={selectedMaterial?.id === material.id} onSelect={onSelectMaterial} />)}
                      </div>
                    ) : <span className="materials-pending">Materials forthcoming</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function CoursePage({ course, onBack }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  useEffect(() => {
    setSidebarOpen(true)
    setSelectedMaterial(null)
  }, [course.id])

  return (
    <div className="course-page">
      <header className="course-header">
        <button className="back-button" onClick={onBack} type="button"><Icon name="arrowLeft" size={18} /> Catalog</button>
        <Brand />
        <div className="course-header__context"><span>{course.id}</span><strong>{course.name}</strong></div>
      </header>
      <main className={`course-workspace ${sidebarOpen ? '' : 'course-workspace--collapsed'}`}>
        <aside id="course-sidebar" className="course-sidebar" aria-label="Course information and syllabus" aria-hidden={!sidebarOpen}>
          <CourseSidebar course={course} onSelectMaterial={setSelectedMaterial} selectedMaterial={selectedMaterial} />
        </aside>
        <button
          className="sidebar-toggle"
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-controls="course-sidebar"
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? 'Collapse course information' : 'Expand course information'}
        >
          <Icon name={sidebarOpen ? 'closePanel' : 'openPanel'} size={19} />
          <span>{sidebarOpen ? 'Hide syllabus' : 'Show syllabus'}</span>
        </button>
        <section className="material-panel" aria-label="Course material viewer">
          <div className="material-toolbar">
            <div><span>{selectedMaterial ? materialTypeLabels[selectedMaterial.type] : 'Course introduction'}</span><strong>{selectedMaterial?.title ?? 'Begin with the course overview'}</strong></div>
            {selectedMaterial && <button type="button" onClick={() => setSelectedMaterial(null)}><Icon name="x" size={16} /> Close material</button>}
          </div>
          <div className="material-stage"><MaterialViewer course={course} material={selectedMaterial} /></div>
        </section>
      </main>
    </div>
  )
}

/** Displays the data-driven course catalog and course learning workspace. */
export default function App() {
  const [selectedCourseId, setSelectedCourseId] = useState(routeCourseId)

  useEffect(() => {
    function handleRouteChange() {
      setSelectedCourseId(routeCourseId())
      if (window.location.hash !== '#catalog') window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', handleRouteChange)
    return () => window.removeEventListener('hashchange', handleRouteChange)
  }, [])

  function openCourse(courseId) {
    window.location.hash = `/courses/${courseId}`
  }

  function showCatalog() {
    window.location.hash = '/'
  }

  const selectedCourse = courses.find((course) => course.id === selectedCourseId)
  return selectedCourse ? <CoursePage course={selectedCourse} onBack={showCatalog} /> : <Catalog onOpenCourse={openCourse} />
}
