'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Lang = 'pt' | 'en'

const t = {
  pt: {
    nav: {
      home: 'Home',
      elenco: 'Elenco',
      producoes: 'Produções',
      contato: 'Contato',
      casting: 'Casting',
      atrizes: 'Atrizes',
      atores: 'Atores',
      estrangeiros: 'Estrangeiros',
      criativos: 'Criativos',
      sobre: 'Sobre',
      close: 'Fechar',
      open: 'Abrir menu',
      menuAria: 'Menu',
      logoAria: 'Veredas',
      back: 'Voltar',
    },
    brand: {
      name: 'VEREDAS',
    },
    carousel: {
      drag: '— arraste para explorar',
    },
    hero: {
      titulo: 'Encontre o Elenco Perfeito',
      subtexto: 'Agência de casting para cinema, televisão e publicidade.',
      cta: 'Ver Elenco',
      overlayTagline: 'VEREDAS — AGENCIAMENTO ARTÍSTICO',
      rec: 'REC',
    },
    sections: {
      producoes: 'Produções',
      elenco: 'Elenco',
    },
    elenco: {
      selectArtist: 'Selecionar artista',
      artistPage: 'Página do artista',
      selectedSingular: 'selecionado',
      selectedPlural: 'selecionados',
      clear: 'Limpar',
      empty: 'Nenhum artista cadastrado ainda.',
    },
    pages: {
      criativos: 'Criativos',
      atores: 'Atores',
      atrizes: 'Atrizes',
      estrangeiros: 'Estrangeiros',
      sobre: 'Sobre',
      eyebrow: 'Veredas',
    },
    homeAgencia: {
      imageAlt: 'Veredas — ambiente da agência',
      verticalLabel: 'SOBRE A AGÊNCIA',
      title: 'Direção e Travessia',
      body:
        'A Veredas atua entre o talento e a obra, entre o posicionamento e a oportunidade. Com uma curadoria rigorosa, garantimos a construção de caminhos consistentes para artistas de alto nível no audiovisual e em projetos com marcas.',
      quote: 'Gente que toca antes de encostar.',
      cta: 'Conheça a Veredas',
    },
    contatoPage: {
      eyebrow: 'Contato',
      title: 'Vamos conversar',
      description:
        'Entre em contato com a equipe Veredas para parcerias, elenco, criativos e projetos audiovisuais.',
      formTitle: 'Envie sua mensagem',
      emailLabel: 'E-mail',
      addressLabel: 'Endereço',
      brandTitle: 'Veredas',
      name: 'Nome',
      email: 'E-mail',
      subject: 'Assunto',
      message: 'Mensagem',
      submit: 'Enviar',
      submitting: 'Enviando...',
      success: 'Mensagem enviada com sucesso. Responderemos em breve.',
      fallback:
        'Não foi possível enviar agora. Tente de novo ou envie para contato@veredas.art.',
    },
    hireForm: {
      title: 'Contrate nosso elenco',
      description:
        'Preencha o formulário abaixo e nossa equipe entrará em contato.',
      name: 'Nome completo',
      email: 'Melhor e-mail',
      phone: 'Telefone',
      message: 'Mensagem',
      submit: 'Enviar mensagem',
      submitting: 'Enviando...',
      success: 'Mensagem enviada com sucesso. Responderemos em breve.',
      fallback:
        'Não foi possível enviar agora. Tente de novo ou envie para contato@veredas.art.',
      subjectPrefix: 'Contratação',
    },
    formSuccess: {
      title: 'Recebemos seu contato! Entraremos em contato em breve!',
      tagline: 'Gente que toca antes de encostar.',
      close: 'Fechar',
    },
    sobre: {
      hero: {
        eyebrow: 'SOBRE A VEREDAS',
        title: 'VEREDAS SINCE 2021',
        brand: 'VEREDAS',
        subtitle: 'AGÊNCIA DE GESTÃO E EMPRESARIAMENTO ARTÍSTICO',
        location: 'SÃO PAULO, BRASIL',
      },
      sections: {
        essence: 'NOSSA ESSÊNCIA',
        direction: 'DIREÇÃO E TRAVESSIA',
        process: 'COMO TRABALHAMOS',
        commitment: 'NOSSO COMPROMISSO',
        signature: 'NOSSA ASSINATURA',
        team: 'NOSSO TIME',
        heading: 'CONHEÇA QUEM CONDUZ',
      },
      processSteps: [
        {
          title: 'CURADORIA',
          body: 'Seleção rigorosa de talentos com potencial artístico, profissional e de mercado.',
        },
        {
          title: 'ESTRATÉGIA',
          body: 'Construção de posicionamento, repertório e narrativa de carreira sólida e autêntica.',
        },
        {
          title: 'OPORTUNIDADES',
          body: 'Conexão com projetos no audiovisual e com marcas alinhadas ao perfil de cada artista.',
        },
        {
          title: 'RELAÇÕES',
          body: 'Relacionamento ativo com produtoras, plataformas e parceiros estratégicos.',
        },
        {
          title: 'ACOMPANHAMENTO',
          body: 'Condução sensível e próxima em cada etapa da carreira, das escolhas ao mercado.',
        },
      ],
      media: {
        introAria: 'Bastidores da agência',
        commitmentAlt: 'Cena em preto e branco',
      },
      p1: 'A Veredas é uma agência de gestão de carreira e empresariamento artístico, dedicada à construção de caminhos consistentes para artistas de alto nível de atuação, com foco no audiovisual e em projetos com marcas.',
      p2: 'Atuamos como direção e travessia: entre o talento e a obra, entre o posicionamento e a oportunidade, entre a escolha e o percurso. Nosso trabalho se apoia em curadoria rigorosa, estratégia e acompanhamento próximo, da definição de repertório às decisões de mercado.',
      p3: 'Mantemos um casting seletivo para assegurar condução personalizada e relações sólidas com produtoras, plataformas e parceiros estratégicos.',
      tagline: 'Veredas — gente que toca antes de encostar.',
      teamHeading: 'Nosso Time',
      founders: {
        natalia: {
          role: 'Empresária artística e Diretora Executiva',
          name: 'Natalia Crivilin',
        },
        laila: {
          role: 'Coordenadora executiva',
          name: 'Laila Lima',
        },
        shay: {
          role: 'Social media',
          name: 'Shay Panzera',
        },
      },
    },
    labels: {
      idade: 'Idade',
      altura: 'Altura',
      local: 'Naturalidade',
      idiomas: 'Idiomas',
    },
    actions: {
      verDetalhes: 'Ver Detalhes',
      selecionar: 'Selecionar',
      selecionado: '✓ Selecionado',
      baixarPdf: 'Baixar PDF',
      gerando: 'Gerando…',
      gerarPdf: 'Gerar PDF',
      verTodosCriativos: 'Ver todos os criativos',
      voltarElenco: 'Voltar ao elenco',
      voltarCriativos: 'Criativos',
      verPerfil: 'Ver Perfil',
      fechar: 'Fechar',
      nenhumCriativo: 'Nenhum criativo cadastrado ainda.',
    },
    selectionBar: {
      selecionado: 'selecionado',
      selecionados: 'selecionados',
      limpar: 'Limpar',
      gerarPdf: 'Gerar PDF',
      gerando: 'Gerando…',
      remover: 'Remover',
    },
    pdf: {
      brand: 'VEREDAS',
      tagline: 'AGENCIAMENTO ARTÍSTICO',
      siteLabel: 'SITE',
      instagramLabel: 'IG',
    },
    preloader: {
      loadingAria: 'Carregando Veredas',
    },
    videoModal: {
      closeVideoAria: 'Fechar vídeo',
      defaultTitle: 'Vídeo',
      openVideo: 'Abrir vídeo',
    },
    legal: {
      privacy: {
        title: 'Política de Privacidade',
        body: 'Conteúdo em atualização.',
      },
      terms: {
        title: 'Termos de Serviço',
        body: 'Conteúdo em atualização.',
      },
    },
    footer: {
      navHeading: 'Navegação',
      contactsHeading: 'Contatos',
      addressHeading: 'Endereço',
      connectHeading: 'Conecte-se',
      email: 'contato@veredas.art',
      addressLine1: 'Av. Brig. Faria Lima, 3.729 Conj.5',
      addressLine2: 'Itaim Bibi - SP/São Paulo',
      addressLine3: 'Brasil',
      instagram: 'Instagram',
      copyright: '© 2026 Veredas Art',
      privacy: 'Política de Privacidade',
      terms: 'Termos de Serviço',
      developedBy: 'Desenvolvido por',
      energy: 'Energy',
      marqueeLine: 'VEREDAS AGENCIAMENTO',
    },
  },
  en: {
    nav: {
      home: 'Home',
      elenco: 'Cast',
      producoes: 'Productions',
      contato: 'Contact',
      casting: 'Casting',
      atrizes: 'Actresses',
      atores: 'Actors',
      estrangeiros: 'International',
      criativos: 'Creatives',
      sobre: 'About',
      close: 'Close',
      open: 'Open menu',
      menuAria: 'Menu',
      logoAria: 'Veredas',
      back: 'Back',
    },
    brand: {
      name: 'VEREDAS',
    },
    carousel: {
      drag: '— drag to explore',
    },
    hero: {
      titulo: 'Find the Perfect Cast',
      subtexto: 'Casting agency for cinema, television and advertising.',
      cta: 'View Cast',
      overlayTagline: 'VEREDAS — ARTIST MANAGEMENT',
      rec: 'REC',
    },
    sections: {
      producoes: 'Productions',
      elenco: 'Cast',
    },
    elenco: {
      selectArtist: 'Select artist',
      artistPage: 'Artist page',
      selectedSingular: 'selected',
      selectedPlural: 'selected',
      clear: 'Clear',
      empty: 'No artists listed yet.',
    },
    pages: {
      criativos: 'Creatives',
      atores: 'Actors',
      atrizes: 'Actresses',
      estrangeiros: 'International',
      sobre: 'About',
      eyebrow: 'Veredas',
    },
    homeAgencia: {
      imageAlt: 'Veredas — agency setting',
      verticalLabel: 'ABOUT THE AGENCY',
      title: 'Direction and Crossing',
      body:
        'Veredas operates between talent and work, between positioning and opportunity. With rigorous curation, we build consistent paths for high-level artists in audiovisual and brand-led projects.',
      quote: 'People who touch before they land.',
      cta: 'Discover Veredas',
    },
    contatoPage: {
      eyebrow: 'Contact',
      title: "Let's talk",
      description:
        'Get in touch with the Veredas team for partnerships, casting, creatives and audiovisual projects.',
      formTitle: 'Send your message',
      emailLabel: 'E-mail',
      addressLabel: 'Address',
      brandTitle: 'Veredas',
      name: 'Name',
      email: 'E-mail',
      subject: 'Subject',
      message: 'Message',
      submit: 'Send',
      submitting: 'Sending...',
      success: 'Message sent successfully. We will get back to you soon.',
      fallback:
        'Could not send right now. Try again or email contato@veredas.art.',
    },
    hireForm: {
      title: 'Hire our cast',
      description:
        'Fill out the form below and our team will get in touch.',
      name: 'Full name',
      email: 'Best e-mail',
      phone: 'Phone',
      message: 'Message',
      submit: 'Send message',
      submitting: 'Sending...',
      success: 'Message sent successfully. We will get back to you soon.',
      fallback:
        'Could not send right now. Try again or email contato@veredas.art.',
      subjectPrefix: 'Hiring',
    },
    formSuccess: {
      title: 'We received your message! We will get in touch soon.',
      tagline: 'People who touch before they land.',
      close: 'Close',
    },
    sobre: {
      hero: {
        eyebrow: 'ABOUT VEREDAS',
        title: 'VEREDAS SINCE 2021',
        brand: 'VEREDAS',
        subtitle: 'ARTISTIC MANAGEMENT & CAREER AGENCY',
        location: 'SÃO PAULO, BRAZIL',
      },
      sections: {
        essence: 'OUR ESSENCE',
        direction: 'DIRECTION & CROSSING',
        process: 'HOW WE WORK',
        commitment: 'OUR COMMITMENT',
        signature: 'OUR SIGNATURE',
        team: 'OUR TEAM',
        heading: 'MEET WHO LEADS',
      },
      processSteps: [
        {
          title: 'CURATION',
          body: 'Rigorous talent selection with artistic, professional and market potential.',
        },
        {
          title: 'STRATEGY',
          body: 'Positioning, repertoire and career storytelling with long-term consistency.',
        },
        {
          title: 'OPPORTUNITIES',
          body: 'Connection with audiovisual projects and brands aligned to each profile.',
        },
        {
          title: 'RELATIONSHIPS',
          body: 'Active relationships with production companies, platforms and strategic partners.',
        },
        {
          title: 'FOLLOW-UP',
          body: 'Close and thoughtful guidance through every career decision and opportunity.',
        },
      ],
      media: {
        introAria: 'Agency backstage',
        commitmentAlt: 'Black and white scene',
      },
      p1: 'Veredas is a career management and artistic entrepreneurship agency, committed to building consistent paths for highly accomplished artists, with a focus on audiovisual work and brand-led projects.',
      p2: 'We operate as direction and crossing: between talent and work, between positioning and opportunity, between choice and journey. Our work rests on rigorous curation, strategy and close support—from repertoire choices to market decisions.',
      p3: 'We maintain a selective casting approach to ensure tailored guidance and solid relationships with production companies, platforms and strategic partners.',
      tagline: 'Veredas — people who touch before they land.',
      teamHeading: 'Our Team',
      founders: {
        natalia: {
          role: 'Artistic entrepreneur & Executive Director',
          name: 'Natalia Crivilin',
        },
        laila: {
          role: 'Executive coordinator',
          name: 'Laila Lima',
        },
        shay: {
          role: 'Social media',
          name: 'Shay Panzera',
        },
      },
    },
    labels: {
      idade: 'Age',
      altura: 'Height',
      local: 'Place of birth',
      idiomas: 'Languages',
    },
    actions: {
      verDetalhes: 'View Details',
      selecionar: 'Select',
      selecionado: '✓ Selected',
      baixarPdf: 'Download PDF',
      gerando: 'Generating…',
      gerarPdf: 'Generate PDF',
      verTodosCriativos: 'View all creatives',
      voltarElenco: 'Back to cast',
      voltarCriativos: 'Creatives',
      verPerfil: 'View Profile',
      fechar: 'Close',
      nenhumCriativo: 'No creatives listed yet.',
    },
    selectionBar: {
      selecionado: 'selected',
      selecionados: 'selected',
      limpar: 'Clear',
      gerarPdf: 'Generate PDF',
      gerando: 'Generating…',
      remover: 'Remove',
    },
    pdf: {
      brand: 'VEREDAS',
      tagline: 'ARTIST MANAGEMENT',
      siteLabel: 'SITE',
      instagramLabel: 'IG',
    },
    preloader: {
      loadingAria: 'Loading Veredas',
    },
    videoModal: {
      closeVideoAria: 'Close video',
      defaultTitle: 'Video',
      openVideo: 'Open video',
    },
    legal: {
      privacy: {
        title: 'Privacy Policy',
        body: 'Content coming soon.',
      },
      terms: {
        title: 'Terms of Service',
        body: 'Content coming soon.',
      },
    },
    footer: {
      navHeading: 'Navigation',
      contactsHeading: 'Contacts',
      addressHeading: 'Address',
      connectHeading: 'Connect',
      email: 'contato@veredas.art',
      addressLine1: 'Av. Brig. Faria Lima, 3.729 Conj.5',
      addressLine2: 'Itaim Bibi - SP/São Paulo',
      addressLine3: 'Brazil',
      instagram: 'Instagram',
      copyright: '© 2026 Veredas Art',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      developedBy: 'Developed by',
      energy: 'Energy',
      marqueeLine: 'VEREDAS AGENCIAMENTO',
    },
  },
}

type Translations = typeof t.pt

const LanguageContext = createContext<{
  lang: Lang
  translations: Translations
  setLang: (l: Lang) => void
}>({
  lang: 'pt',
  translations: t.pt,
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt')
  return (
    <LanguageContext.Provider value={{ lang, translations: t[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
