// Tipos base para o sistema de anamnese

export type TipoFormulario = 
  | "punho"
  | "abdome"
  | "atm"
  | "cabeca"
  | "coluna"
  | "cotovelo"
  | "joelho"
  | "membros"
  | "ombro"
  | "quadril"
  | "tornozelo"
  | "mama";

// Formulário de Punho/Mão
export interface FormPunho {
  exame: string;
  paciente: string;
  idade: string;
  contraste: "Sim" | "Não";
  lado: "Direito" | "Esquerdo";
  tempoComDor: string;
  localizacao: string;
  praticaEsporte: "Sim" | "Não";
  qualEsporte: string;
  ehDigitador: "Sim" | "Não";
  limitacaoMovimento: "Sim" | "Não";
  teveDerrame: "Sim" | "Não";
  quandoDerrame: string;
  alteracaoSensibilidade: "Sim" | "Não";
  doencaReumatica: "Sim" | "Não";
  historiaTrauma: "Sim" | "Não";
  quandoTrauma: string;
  jaFoiOperado: "Sim" | "Não";
  oqueFeitoCircurgia: string;
  observacoes: string;
}

// Formulário de Abdome
export interface FormAbdome {
  exame: string;
  nome: string;
  idade: string;
  tipoExame: string[];
  trabalho: string;
  motivoExame: string;
  problemaSaude: string;
  jaFoiOperado: "Sim" | "Não";
  cirurgias: string;
  quimioterapia: "Sim" | "Não";
  quandoQuimio: string;
  radioterapia: "Sim" | "Não";
  quandoRadio: string;
  regiaoRadio: string;
  numeroGestacoes: string;
  numeroCesareas: string;
  abortoComCuretagem: string;
  dataUltimaMenstruacao: string;
  reposicaoHormonal: string;
  jaFezBiopsia: string;
  gleason: string;
  valorPSA: string;
  fuma: "Sim" | "Não";
  tempoFumando: string;
  estaPerdendoPeso: "Sim" | "Não";
  tempoPerdendoPeso: string;
  jaFezRMouTC: string;
  ondeRealizou: string;
}

// Formulário de ATM/Pescoço
export interface FormATM {
  exame: string;
  nome: string;
  idade: string;
  tipoExame: string;
  trabalho: string;
  motivoExame: string;
  jaFoiOperado: "Sim" | "Não";
  cirurgias: string;
  quimioterapia: "Sim" | "Não";
  quandoQuimio: string;
  radioterapia: "Sim" | "Não";
  quandoRadio: string;
  regiaoRadio: string;
  problemasSaude: string;
  jaFezBiopsia: "Sim" | "Não";
  quandoBiopsia: string;
  fuma: "Sim" | "Não";
  tempoFumando: string;
  estaPerdendoPeso: "Sim" | "Não";
  tempoPerdendoPeso: string;
  dataUltimaMenstruacao: string;
  jaFezTCouRM: string;
  ondeRealizou: string;
}

// Formulário de Cabeça
export interface FormCabeca {
  exame: string;
  paciente: string;
  idade: string;
  contraste: "Sim" | "Não";
  trabalho: string;
  motivoExame: string;
  localizacaoCefaleia: string;
  tipoDor: string;
  duracaoDor: string;
  percebeQuandoVaiTerCrise: "Sim" | "Não";
  comoPercebe: string;
  alguemTestemunhouCrise: string;
  descricaoCrise: string;
  quantasCrisesUltimoMes: string;
  aumentoFrequenciaCrises: "Sim" | "Não";
  quantoAumento: string;
  fezEEG: string;
  sintomas: string[];
  medicamentosEmUso: string;
  fezCirurgiasCabeca: string;
  quaisCirurgias: string;
  radioQuimioterapia: string;
  tempoLocal: string;
  fuma: "Sim" | "Não";
  tempoFumando: string;
  estaPerdendoPeso: "Sim" | "Não";
  tempoPerdendoPeso: string;
  gestacaoNormal: "Sim" | "Não";
  complicacoes: string;
  partoNormal: string;
  atrasoDesenvolvimento: string;
  jaFezTCouRM: string;
  ondeRealizou: string;
}

// Formulário de Coluna
export interface FormColuna {
  exame: string;
  paciente: string;
  idade: string;
  contraste: "Sim" | "Não";
  inicioSintomatologia: string;
  trabalho: string;
  tipoDor: string[];
  sintomasAssociados: string[];
  fatoresMelhora: string[];
  fatoresPiora: string[];
  cirurgiasAnteriores: "Sim" | "Não";
  quandoCirurgia: string;
  trauma: "Sim" | "Não";
  quandoTrauma: string;
  quimioterapia: "Sim" | "Não";
  quandoQuimio: string;
  radioterapia: "Sim" | "Não";
  quandoRadio: string;
  perdaSensibilidade: "Sim" | "Não";
  aumentoSensibilidade: "Sim" | "Não";
  fuma: "Sim" | "Não";
  tempoFumando: string;
  estaPerdendoPeso: "Sim" | "Não";
  tempoPerdendoPeso: string;
  dataUltimaMenstruacao: string;
  jaFezTCouRM: string;
}

// Formulário de Cotovelo
export interface FormCotovelo {
  exame: string;
  nome: string;
  idade: string;
  lado: "Direito" | "Esquerdo";
  trabalho: string;
  tempoComDor: string;
  localizacaoDor: string;
  praticaEsporte: "Sim" | "Não";
  qualEsporte: string;
  limitacaoMovimento: "Sim" | "Não";
  teveDerrame: "Sim" | "Não";
  historiaTrauma: "Sim" | "Não";
  quandoTrauma: string;
  jaFoiOperado: "Sim" | "Não";
  oqueFeitoCircurgia: string;
  dataUltimaMenstruacao: string;
  jaFezRMouTC: string;
  ondeRealizou: string;
}

// Formulário de Joelho
export interface FormJoelho {
  exame: string;
  nome: string;
  idade: string;
  lado: "Direito" | "Esquerdo";
  trabalho: string;
  tempoComDor: string;
  localizacaoDor: string;
  doiSubirEscada: "Sim" | "Não";
  doiTempoSentado: "Sim" | "Não";
  teveDerrame: "Sim" | "Não";
  joelhoFalseia: "Sim" | "Não";
  joelhoTrava: "Sim" | "Não";
  historiaTrauma: "Sim" | "Não";
  quandoTrauma: string;
  jaFoiOperado: "Sim" | "Não";
  oqueFeitoCircurgia: string;
  fezInfiltracao: "Sim" | "Não";
  quandoInfiltracao: string;
  dataUltimaMenstruacao: string;
  jaFezTCouRM: string;
  ondeRealizou: string;
}

// Formulário de Membros
export interface FormMembros {
  exame: string;
  regiao: string[];
  lado: string[];
  trabalho: string;
  motivoExame: string;
  jaFoiOperado: "Sim" | "Não";
  cirurgias: string;
  quimioterapia: "Sim" | "Não";
  quandoQuimio: string;
  radioterapia: "Sim" | "Não";
  quandoRadio: string;
  regiaoRadio: string;
  trauma: "Sim" | "Não";
  quandoTrauma: string;
  diabetes: "Sim" | "Não";
  infeccao: "Sim" | "Não";
  estaPerdendoPeso: "Sim" | "Não";
  esporte: "Sim" | "Não";
  qualEsporte: string;
  lesoesCutaneas: "Sim" | "Não";
  jaFezTCouRM: string;
  ondeRealizou: string;
  dataUltimaMenstruacao: string;
}

// Formulário de Ombro
export interface FormOmbro {
  exame: string;
  paciente: string;
  idade: string;
  contraste: "Sim" | "Não";
  lado: "Direito" | "Esquerdo";
  trabalho: string;
  tempoComDor: string;
  dorANoite: "Sim" | "Não";
  praticaEsporte: "Sim" | "Não";
  qualEsporte: string;
  jaLuxou: "Sim" | "Não";
  ultimaLuxacao: string;
  teveDerrame: "Sim" | "Não";
  dificuldadeMaoNaCabeca: "Sim" | "Não";
  dificuldadeMaoNasCostas: "Sim" | "Não";
  dificuldadeMaoOutroOmbro: "Sim" | "Não";
  historiaTrauma: "Sim" | "Não";
  tempoTrauma: string;
  jaFoiOperado: "Sim" | "Não";
  oqueFeitoCircurgia: string;
  fezInfiltracao: "Sim" | "Não";
  quandoInfiltracao: string;
}

// Formulário de Quadril
export interface FormQuadril {
  exame: string;
  nome: string;
  idade: string;
  lado: "Direito" | "Esquerdo";
  trabalho: string;
  tempoOndeTemDor: string;
  doiPernasGruzadas: "Sim" | "Não";
  doiApertarLadoQuadril: "Sim" | "Não";
  doiDeitarSobreQuadril: "Sim" | "Não";
  praticaEsporte: "Sim" | "Não";
  qualEsporte: string;
  doencaQuadrilInfancia: string;
  doencaBase: string;
  historiaTrauma: "Sim" | "Não";
  quandoTrauma: string;
  jaFoiOperado: "Sim" | "Não";
  oqueFeitoCircurgia: string;
  dataUltimaMenstruacao: string;
  quimioRadioterapia: "Sim" | "Não";
  localQuimioRadio: string;
  jaFezTCouRM: string;
  ondeRealizou: string;
}

// Formulário de Tornozelo
export interface FormTornozelo {
  exame: string;
  nome: string;
  idade: string;
  lado: "Direito" | "Esquerdo";
  trabalho: string;
  tempoComDor: string;
  diabetes: "Sim" | "Não";
  outrosProblemasSaude: string;
  localizacao: string;
  entorse: "Sim" | "Não";
  quandoEntorse: string;
  quantasVezesEntorse: string;
  doiCaminhar: "Sim" | "Não";
  fratura: "Sim" | "Não";
  tornozeloFalseia: "Sim" | "Não";
  doiEntreDedos: "Sim" | "Não";
  historiaTrauma: "Sim" | "Não";
  tempoTrauma: string;
  oqueFeitoCircurgia: string;
  dataUltimaMenstruacao: string;
  jaFezTCouRM: string;
  ondeRealizou: string;
}

// Formulário de Mamografia
export interface FormMama {
  exame: string;
  motivoExame: string[];
  ladoSintoma: string;
  outrosMotivos: string;
  jaFezMamografiaAntes: string;
  trouxeExamesAnteriores: "Sim" | "Não";
  temFilhos: string;
  idadePrimeiroFilho: string;
  dataUltimaMenstruacao: string;
  reposicaoHormonal: "Sim" | "Não";
  familiarComCancer: "Sim" | "Não";
  quemFamiliar: string;
  idadeCancerFamiliar: string;
  jaOperouMama: "Sim" | "Não";
  tipoCircurgia: string[];
  ladoCircurgia: string;
  tempoCircurgia: string;
  jaFezBiopsia: "Sim" | "Não";
  ladoBiopsia: string;
  resultadoBiopsia: string;
  jaFezRadioterapia: "Sim" | "Não";
  ladoRadio: string;
  tempoRadio: string;
  outrosProblemasSaude: string;
}

export type FormData = 
  | FormPunho
  | FormAbdome
  | FormATM
  | FormCabeca
  | FormColuna
  | FormCotovelo
  | FormJoelho
  | FormMembros
  | FormOmbro
  | FormQuadril
  | FormTornozelo
  | FormMama;

export interface ImagemAnatomica {
  id: string;
  nome: string;
  url: string;
}

export interface AnamneseData {
  tipo: TipoFormulario;
  dados: FormData;
  imagemMarcada?: string;
  imagemAnatomicaUsada?: string;
  timestamp: string;
  funcionarioRevisor?: string;
  contrasteEndovenoso?: boolean;
  contrasteOral?: boolean;
  contrasteRetal?: boolean;
  gelEndovaginal?: boolean;
  tecnicoResponsavel?: string;
  relatorioFinal?: string;
}
