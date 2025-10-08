export interface Patient {
  id: string;
  name: string;
  birthDate?: string;
  patientId: string;
  studyDescription?: string;
  modality?: string;
  procedure?: string;
  ds_paciente?: string;
  nr_controle?: string;
  cd_atendimento?: string;
  ds_modalidade?: string;
  ds_procedimento?: string;
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