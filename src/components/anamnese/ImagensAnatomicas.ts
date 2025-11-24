import { TipoFormulario, ImagemAnatomica } from '@/types/anamnese';

export const imagensAnatomicas: Record<TipoFormulario, ImagemAnatomica[]> = {
  punho: [
    { id: 'punho-frontal', nome: 'Punho - Vista Frontal', url: '/images/anatomia/punho-frontal.png' },
    { id: 'punho-lateral', nome: 'Punho - Vista Lateral', url: '/images/anatomia/punho-lateral.png' },
    { id: 'punho-medial', nome: 'Punho - Vista Medial', url: '/images/anatomia/punho-medial.png' },
    { id: 'mao-palmar', nome: 'Mão - Vista Palmar', url: '/images/anatomia/mao-palmar.png' },
    { id: 'mao-dorsal', nome: 'Mão - Vista Dorsal', url: '/images/anatomia/mao-dorsal.png' },
  ],
  abdome: [
    { id: 'abdome-anterior', nome: 'Abdome - Vista Anterior', url: '/images/anatomia/abdome-anterior.png' },
    { id: 'abdome-posterior', nome: 'Abdome - Vista Posterior', url: '/images/anatomia/abdome-posterior.png' },
    { id: 'abdome-lateral-direita', nome: 'Abdome - Vista Lateral Direita', url: '/images/anatomia/abdome-lateral-direita.png' },
    { id: 'abdome-lateral-esquerda', nome: 'Abdome - Vista Lateral Esquerda', url: '/images/anatomia/abdome-lateral-esquerda.png' },
  ],
  atm: [
    { id: 'atm-lateral', nome: 'ATM - Vista Lateral', url: '/images/anatomia/atm-lateral.png' },
    { id: 'pescoco-frontal', nome: 'Pescoço - Vista Frontal', url: '/images/anatomia/pescoco-frontal.png' },
  ],
  cabeca: [
    { id: 'cranio-frontal', nome: 'Cabeça - Vista Anterior', url: '/images/anatomia/cranio-frontal.png' },
    { id: 'cranio-posterior', nome: 'Cabeça - Vista Posterior', url: '/images/anatomia/cranio-posterior.png' },
    { id: 'cranio-lateral-direita', nome: 'Cabeça - Vista Lateral Direita', url: '/images/anatomia/cranio-lateral-direita.png' },
    { id: 'cranio-lateral-esquerda', nome: 'Cabeça - Vista Lateral Esquerda', url: '/images/anatomia/cranio-lateral-esquerda.png' },
  ],
  coluna: [
    { id: 'coluna-cervical', nome: 'Coluna Cervical', url: '/images/anatomia/coluna-cervical.png' },
    { id: 'coluna-toracica', nome: 'Coluna Torácica', url: '/images/anatomia/coluna-toracica.png' },
    { id: 'coluna-lombar', nome: 'Coluna Lombar', url: '/images/anatomia/coluna-lombar.png' },
    { id: 'coluna-completa', nome: 'Coluna Completa', url: '/images/anatomia/coluna-completa.png' },
  ],
  cotovelo: [
    { id: 'cotovelo-frontal', nome: 'Cotovelo - Vista Frontal', url: '/images/anatomia/cotovelo-frontal.png' },
    { id: 'cotovelo-lateral', nome: 'Cotovelo - Vista Lateral', url: '/images/anatomia/cotovelo-lateral.png' },
  ],
  joelho: [
    { id: 'joelho-frontal', nome: 'Joelho - Vista Frontal', url: '/images/anatomia/joelho-frontal.png' },
    { id: 'joelho-lateral', nome: 'Joelho - Vista Lateral', url: '/images/anatomia/joelho-lateral.png' },
    { id: 'joelho-posterior', nome: 'Joelho - Vista Posterior', url: '/images/anatomia/joelho-posterior.png' },
  ],
  membros: [
    { id: 'braco-frontal', nome: 'Braço - Vista Frontal', url: '/images/anatomia/braco-frontal.png' },
    { id: 'antebraco-frontal', nome: 'Antebraço - Vista Frontal', url: '/images/anatomia/antebraco-frontal.png' },
    { id: 'coxa-frontal', nome: 'Coxa - Vista Frontal', url: '/images/anatomia/coxa-frontal.png' },
    { id: 'perna-frontal', nome: 'Perna - Vista Frontal', url: '/images/anatomia/perna-frontal.png' },
  ],
  ombro: [
    { id: 'ombro-frontal', nome: 'Ombro - Vista Frontal', url: '/images/anatomia/ombro-frontal.png' },
    { id: 'ombro-lateral', nome: 'Ombro - Vista Lateral', url: '/images/anatomia/ombro-lateral.png' },
    { id: 'escapula-posterior', nome: 'Escápula - Vista Posterior', url: '/images/anatomia/escapula-posterior.png' },
  ],
  quadril: [
    { id: 'quadril-frontal', nome: 'Quadril - Vista Frontal', url: '/images/anatomia/quadril-frontal.png' },
    { id: 'quadril-lateral', nome: 'Quadril - Vista Lateral', url: '/images/anatomia/quadril-lateral.png' },
    { id: 'bacia-completa', nome: 'Bacia Completa', url: '/images/anatomia/bacia-completa.png' },
  ],
  tornozelo: [
    { id: 'tornozelo-frontal', nome: 'Tornozelo - Vista Frontal', url: '/images/anatomia/tornozelo-frontal.png' },
    { id: 'tornozelo-lateral', nome: 'Tornozelo - Vista Lateral', url: '/images/anatomia/tornozelo-lateral.png' },
    { id: 'pe-plantar', nome: 'Pé - Vista Plantar', url: '/images/anatomia/pe-plantar.png' },
  ],
  mama: [
    { id: 'mama-frontal', nome: 'Mama - Vista Frontal', url: '/images/anatomia/mama-frontal.png' },
    { id: 'mama-lateral', nome: 'Mama - Vista Lateral', url: '/images/anatomia/mama-lateral.png' },
  ],
};
