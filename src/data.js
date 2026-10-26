import coursesCsv from '../project-assets/history_courses.csv?raw'
import classesCsv from '../project-assets/history_classes.csv?raw'
import instructorsCsv from '../project-assets/history_instructors.csv?raw'
import materialsCsv from '../project-assets/course_materials.csv?raw'
import silkRoadsLecturePdf from '../project-assets/materials/silk_roads_class_01_lecture.pdf?url'
import silkRoadsLectureVideo from '../project-assets/materials/silk_roads_class_01_lecture.mp4?url'
import silkRoadsAssignment from '../project-assets/materials/silk_roads_class_02_assignment.md?raw'

function parseCsv(source) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index]

    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        field += character
      }
      continue
    }

    if (character === '"') {
      quoted = true
    } else if (character === ',') {
      row.push(field)
      field = ''
    } else if (character === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (character !== '\r') {
      field += character
    }
  }

  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }

  const [headers, ...dataRows] = rows
  return dataRows
    .filter((values) => values.some(Boolean))
    .map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])))
}

const localMaterials = {
  'materials/silk_roads_class_01_lecture.pdf': { source: silkRoadsLecturePdf },
  'materials/silk_roads_class_01_lecture.mp4': { source: silkRoadsLectureVideo },
  'materials/silk_roads_class_02_assignment.md': { content: silkRoadsAssignment },
}

const instructors = parseCsv(instructorsCsv).map((instructor) => ({
  id: instructor.instructor_id,
  name: instructor.name,
  email: instructor.email,
  photoUrl: instructor.photo_url,
}))

const instructorById = new Map(instructors.map((instructor) => [instructor.id, instructor]))

const materialsByClass = new Map()
parseCsv(materialsCsv).forEach((material) => {
  const localMaterial = localMaterials[material.file_path] ?? {}
  const normalizedMaterial = {
    id: material.material_id,
    classId: material.class_id,
    title: material.material_title,
    type: material.material_type,
    order: Number(material.display_order),
    source: material.material_type === 'youtube' ? material.file_path : localMaterial.source,
    content: localMaterial.content,
  }
  const classMaterials = materialsByClass.get(material.class_id) ?? []
  classMaterials.push(normalizedMaterial)
  materialsByClass.set(material.class_id, classMaterials)
})

const classesByCourse = new Map()
parseCsv(classesCsv).forEach((classMeeting) => {
  const normalizedClass = {
    id: classMeeting.class_id,
    week: Number(classMeeting.week_number),
    date: classMeeting.date,
    name: classMeeting.class_name,
    materials: (materialsByClass.get(classMeeting.class_id) ?? []).sort((first, second) => first.order - second.order),
  }
  const courseClasses = classesByCourse.get(classMeeting.course_id) ?? []
  courseClasses.push(normalizedClass)
  classesByCourse.set(classMeeting.course_id, courseClasses)
})

/** All course, class, instructor, and material data joined from the immutable project assets. */
export const courses = parseCsv(coursesCsv).map((course) => ({
  id: course.course_id,
  name: course.name,
  shortDescription: course.short_description,
  longDescription: course.long_description,
  classCount: Number(course.number_of_classes),
  weekCount: Number(course.number_of_weeks),
  imageUrl: course.image_url,
  instructor: instructorById.get(course.instructor_id),
  classes: (classesByCourse.get(course.course_id) ?? []).sort((first, second) => first.date.localeCompare(second.date)),
}))

/** Instructors available as catalog filters, in the same order as the source data. */
export const courseInstructors = instructors.filter((instructor) => courses.some((course) => course.instructor.id === instructor.id))

/** Distinct course lengths available as catalog filters. */
export const courseWeekCounts = [...new Set(courses.map((course) => course.weekCount))].sort((first, second) => first - second)
