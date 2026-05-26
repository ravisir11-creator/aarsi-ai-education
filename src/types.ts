export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown / HTML Content
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  tags: string[];
  commentsCount: number;
}

export interface AITool {
  id: string;
  name: string;
  gujName: string;
  description: string;
  iconName: string; // Lucide icon name mapping
  endpoint: string;
  inputs: {
    key: string;
    label: string;
    type: "text" | "number" | "select";
    placeholder?: string;
    options?: { label: string; value: string }[];
    defaultValue?: any;
  }[];
}

export interface ResourceHubItem {
  id: string;
  title: string;
  description: string;
  category: "teacher" | "student";
  fileType: "PDF" | "Template" | "Interactive" | "Document";
  downloadUrl?: string;
  gujTitle: string;
}

export interface StudentChapterResource {
  chapterNo: number;
  title: string;
  gujTitle: string;
  keyFormulas: string[];
  keyNotes: string;
  mcqs: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface ERPFeature {
  id: string;
  title: string;
  gujTitle: string;
  description: string;
  iconName: string;
  metrics: { label: string; value: string }[];
}
