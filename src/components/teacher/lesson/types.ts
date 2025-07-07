// Types pour les données de cours
export interface LessonData {
  title: string
  content: string
  videoUrl?: string
  createdBy: string
  createdAt: any
}

export interface LessonForm {
  title: string
  content: string
  videoUrl: string
}

// Types pour la navigation
export interface NavigationState {
  selectedGrade: string
  selectedSubject: string
  selectedChapter: string
  selectedSubchapter: string
}

export interface Subject {
  id: string
  name: string
  createdAt: any
}

export interface Chapter {
  id: string
  title: string
  order: number
}

export interface Subchapter {
  id: string
  title: string
  order: number
}

// Types pour l'éditeur
export interface EditorState {
  fontSize: number
  fontFamily: string
  textColor: string
  backgroundColor: string
  highlightColor: string
  lineHeight: number
}

export interface EditorHistory {
  history: string[]
  historyIndex: number
}

// Types pour les props des composants
export interface NavigationSelectorProps {
  selectedGrade: string
  selectedSubject: string
  selectedChapter: string
  selectedSubchapter: string
  subjects: Subject[]
  chapters: Chapter[]
  subchapters: Subchapter[]
  loading: boolean
  onGradeChange: (grade: string) => void
  onSubjectChange: (subjectId: string) => void
  onChapterChange: (chapterId: string) => void
  onSubchapterChange: (subchapterId: string) => void
}

export interface LessonFormProps {
  lessonForm: LessonForm
  setLessonForm: (form: LessonForm) => void
  isZenMode: boolean
  showPreview: boolean
  setShowPreview: (show: boolean) => void
  adding: boolean
  onSubmit: (e: React.FormEvent) => void
  currentUser: any
}

export interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  isZenMode: boolean
}