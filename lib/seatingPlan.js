const TABLES = [
  {
    mesa: 1,
    mesaNome: 'Amsterdã',
    convidados: [
      'Marisa de Fátima Vigarani de Camargo',
      'Claudio de Camargo',
      'Wagner Vigarani de Camargo',
      'Fabiana Vigarani de Camargo',
      'Willian Alves Pereira',
      'Yasmine Vigarani de Camargo Pereira'
    ]
  },
  {
    mesa: 2,
    mesaNome: 'Campos do Jordão',
    convidados: [
      'Andreia Moreira de Medeiros',
      'Brasilio Leão de Medeiros',
      'Sophia Moreira de Medeiros',
      'Lucas Vasconcelos',
      'João Moreira de Medeiros',
      'Giovanna de Cássia Borocino'
    ]
  },
  {
    mesa: 3,
    mesaNome: 'Colônia',
    convidados: [
      'Geny Ferreira',
      'Benicia de Jesus Medeiros',
      'Paulo Sérgio Barros',
      'Andreia Dias Medeiros',
      'Byron Medeiros',
      'Pedro Dias'
    ]
  },
  {
    mesa: 4,
    mesaNome: 'Copenhague',
    convidados: [
      'Bruna Kaiani Moreira',
      'Denis Wilson Santos de Sá',
      'Nicole Gomes de Sá',
      'Davi Patrick Gomes de Sá',
      'Vinicius Moreira Santos de Sá',
      'Rogério Moreira',
      'Renata Sampaio'
    ]
  },
  {
    mesa: 5,
    mesaNome: 'Patagônia',
    convidados: [
      'Camila Laragnoit',
      'Gustavo Mitsui',
      'Glaucy Concórdia Medeiros',
      'Renato Concórdia',
      'Julia Concórdia',
      'Allan Ferreira',
      'Giovana Gatto'
    ]
  },
  {
    mesa: 6,
    mesaNome: 'Estocolmo',
    convidados: [
      'Rafaella Cruaia',
      'Anderson Borges',
      'Jhenifer Ernandes',
      'Gabriel Bernadone',
      'Andreia Borges',
      'Evangelista Cunha',
      'Edvaldo Junior'
    ]
  },
  {
    mesa: 7,
    mesaNome: 'Giethoorn',
    convidados: [
      'Rosangela Scarpa',
      'Custódio Scarpa',
      'Gabriela Scarpa',
      'Leticia Scarpa',
      'Vera Lúcia Pinheiro',
      'Antônio Pinheiro'
    ]
  },
  {
    mesa: 8,
    mesaNome: 'Kefalonia',
    convidados: [
      'Daniel Camargo Brindo da Cruz',
      'Isabele Camargo Brindo da Cruz',
      'Miguel Oliveira Brindo da Cruz',
      'Rafael Oliveira Brindo da Cruz',
      'Beatriz Sanches da Silva',
      'Bárbara Ingrid Assis da Glória'
    ]
  },
  {
    mesa: 9,
    mesaNome: 'Las Vegas',
    convidados: [
      'Luis Felipe Cimino',
      'Bianca de Sousa Carvalho',
      'Guilherme Siqueira',
      'Eduarda Rodrigues Siqueira',
      'Thiago Sousa',
      'Camila Pinheiro'
    ]
  },
  {
    mesa: 10,
    mesaNome: 'Madrid',
    convidados: [
      'Alice Oliveira',
      'Sthefani Leite Bispo da Silva',
      'Mayara Brigida Magalhães Silveira',
      'Lucas Pereira Gracindo',
      'Tatiane Fernandes',
      'Hernane Faria'
    ]
  },
  {
    mesa: 11,
    mesaNome: 'Milão',
    convidados: [
      'Gabriele Taiani Moreira',
      'Willian Lucena Santos',
      'Cecilia Lucena Moreira',
      'Alice Lucena Moreira',
      'Isadora Rafaeli Moreira',
      'Jeferson Moreira',
      'Janaina Sabioni',
      'Maria Eduarda Moreira',
      'Maria Valentina Moreira',
      'Arthur Sabioni'
    ]
  },
  {
    mesa: 12,
    mesaNome: 'Paris',
    convidados: [
      'Bárbara Cristina Moreira',
      'Erasmo Avelar',
      'Luidy Moreira',
      'Beatriz Marinho Marcondes',
      'Thaynara Moreira',
      'Carlos Eduardo Batista dos Reis Santos',
      'Catia Ferreira',
      'Caroline Silva Damasceno Brandão',
      'Guilherme Moreira Brandão'
    ]
  },
  {
    mesa: 13,
    mesaNome: 'Roma',
    convidados: [
      'Camila Marcolino da Silva So',
      'Borny So',
      'Alessandra Francisco de Melo Franco',
      'Felipe de Melo Franco',
      'Cristina Wolter',
      'Ricardo Tamisari',
      'Daniela Fonzar',
      'Patrícia Fonzar',
      'Rodrigo Antunes'
    ]
  },
  {
    mesa: 14,
    mesaNome: 'Salar de Uyuni',
    convidados: [
      'Ivan Lecci La Rosa',
      'Bianca Riva',
      'Denis Araújo Luiz',
      'Priscila Sousa Rosa',
      'Braian de Almeida',
      'Miguel Sousa Rosa',
      'Giulia Pietropaollo Guimarães',
      'Joeli Rocha',
      'Bruno Galvão Oliveira',
      'Mayra Ampuero Davanço'
    ]
  },
  {
    mesa: 15,
    mesaNome: 'Santorini',
    convidados: [
      'Felipe Fernandes',
      'Tassia da Cruz Fernandes',
      'Pamella Nagen',
      'Henrique Tancredi',
      'Filipe Moreira',
      'Caroline dos Santos Pizzo',
      'Marco Delpoio',
      'Thalissa Galvanin',
      'Ely Guedes',
      'Rayssa Vaz'
    ]
  },
  {
    mesa: 16,
    mesaNome: 'Sarajevo',
    convidados: [
      'Pedro Ferreira',
      'Janaína Borbely',
      'Theo Borbely',
      'Guilherme Aizner',
      'Brenda Saito',
      'Leonardo Almudin de Oliveira',
      'Rebecca Belasco',
      'Felipe Taveira de Lima',
      'Beatriz Aguiar',
      'Gabriel Saragó',
      'Cristielen Araújo Saragó',
      'Mariana Saragó'
    ]
  },
  {
    mesa: 17,
    mesaNome: 'Split',
    convidados: [
      'Rosemeire Munhoz',
      'Moisés Achcar',
      'Joyce Munhoz',
      'Guilherme Lucena',
      'Rebecca Munhoz',
      'Alexsandro Virgilio',
      'Barbara Cristine Carvalho',
      'Claudemir Munhoz da Silva',
      'Bernardo Munhoz',
      'Maria Eduarda Munhoz',
      'Davi Munhoz',
      'Arthur Munhoz'
    ]
  },
  {
    mesa: 18,
    mesaNome: 'Treze Tílias',
    convidados: [
      'Barbara Munhoz',
      'Guilherme Pereira',
      'Marli Munhoz',
      'Cicero Antônio Gonçalves',
      'Rafael Gonçalves',
      'Julia Munhoz',
      'Manuela Munhoz',
      'Silvana Munhoz',
      'Marco Antonio Pacheco'
    ]
  },
  {
    mesa: 19,
    mesaNome: 'Zurique',
    convidados: [
      'Alice Almeida',
      'Sandra Oliveira',
      'Paulo Oliveira',
      'Tania Fernandes',
      'Guilherme Fernandes',
      'Barbara Maruyama',
      'Regina Pinheiro',
      'Marcelo Pinheiro',
      'Mariana Pinheiro',
      'Igor Silva'
    ]
  },
  {
    mesa: 20,
    mesaNome: 'Sucre',
    convidados: [
      'Cristiano Rodrigues',
      'Josie Anny Marcopito Rodrigues',
      'Carlos Alberto Penci',
      'Valeria Penci',
      'Regina Ferreira de Carvalho',
      'José Soares Malta',
      'Fernanda Masaracchia',
      'Alexandre Masaracchia',
      'Manuela Masaracchia'
    ]
  }
];

function buildSeatingGuests() {
  return TABLES.flatMap((table) =>
    table.convidados.map((nome, index) => ({
      id: `seating-${table.mesa}-${index + 1}`,
      nome,
      nomeOriginal: nome,
      nomeConvite: table.mesaNome,
      grupo: table.mesaNome,
      mesa: table.mesa,
      mesaNome: table.mesaNome,
      confirmado: true,
      source: 'seating-plan'
    }))
  );
}

const SEATING_GUESTS = buildSeatingGuests();

module.exports = {
  TABLES,
  SEATING_GUESTS
};
