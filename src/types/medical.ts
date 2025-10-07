export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  patientId: string;
  studyDescription?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface N8nConfig {
  worklistUrl: string;
  chatUrl: string;
  reportUrl: string;
  transcriptionUrl?: string;
}

export interface ReportData {
  patientId: string;
  patientName: string;
  content: string;
  timestamp: string;
}