/**
 * Samuel.dev - Portfólio Profissional de TI
 * JavaScript modular para interações, filtros, tema e modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypewriter();
  initNavbar();
  initStatsCounter();
  initSkillsFilter();
  initProjectsFilter();
  initProjectModal();
  initCertificates();
  initContactForm();
  initBackToTop();
  initFooterYear();
});

/* ==========================================================================
   1. GERENCIADOR DE TEMA (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Verifica preferência prévia salva ou preferência do sistema
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (!systemPrefersDark) {
    root.setAttribute('data-theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      showToast(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado!`, 'info');
    });
  }
}

/* ==========================================================================
   2. EFEITO MÁQUINA DE ESCREVER (TYPEWRITER)
   ========================================================================== */
function initTypewriter() {
  const textElement = document.getElementById('typed-text');
  if (!textElement) return;

  const words = [
    'HTML5, CSS3 & JavaScript',
    'Flutter & Dart Mobile',
    'PHP & Banco MySQL',
    'Python & Automações',
    'Design de Interfaces no Figma',
    'Versionamento com Git & GitHub'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pausa ao final da palavra
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. NAVBAR & MENU MOBILE
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Efeito de blur/sombra ao rolar a página
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Marcação do link ativo conforme a seção visível
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Alternar Menu Mobile
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Fechar ao clicar em um link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   4. CONTADOR DINÂMICO DE ESTATÍSTICAS
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-num');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const duration = 1500;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) observer.observe(statsContainer);
}

/* ==========================================================================
   5. FILTRO DE HABILIDADES
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. FILTRO DE PROJETOS
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-category');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. MODAL INTERATIVO DE DETALHES DO PROJETO
   ========================================================================== */
const projectData = {
  'proj-1': {
    title: '⚡ Pokédex Mobile & Trainer Card | Primeiro Projeto em Flutter 🎮',
    image: 'projeto pokedex/tela1.png',
    video: 'projeto pokedex/videoaplicativo.mp4',
    tags: ['Flutter', 'Dart', 'Android Studio', 'GridView', 'GIF Animado', 'Mobile'],
    overview: 'Uma aplicação mobile moderna e interativa inspirada na franquia Pokémon, desenvolvida como projeto prático para consolidar fundamentos de Flutter e Dart! O app simula a experiência de um Cartão de Treinador (Trainer Card) digital, integrando perfil personalizado, coleção de insígnias de ginásio com rolagem horizontal e um time de batalha com suporte a GIFs animados e navegação individual para cada Pokémon.',
    challenges: 'O principal desafio foi organizar a arquitetura do app de forma modular com navegação entre múltiplas telas (charizard_page.dart, garchomp_page.dart, etc.), garantindo fluidez visual com GIFs animados via GridView.builder e criando um carrossel horizontal de insígnias com bordas douradas estilizadas usando SingleChildScrollView.',
    features: [
      '🆔 Perfil do Treinador: foto, ID único, pontos de conquistas e Kanto League Champion',
      '🏅 Galeria de Insígnias: carrossel horizontal com 8 insígnias da região de Kanto com bordas douradas',
      '⚔️ Esquadrão de Batalha: grid com Greninja, Charizard, Gengar, Garchomp, Tyranitar e Gardevoir',
      '🎮 Navegação dinâmica: toque em qualquer Pokémon para acessar sua tela detalhada individual',
      '📱 Desenvolvido com Flutter 3.x + Dart em Android Studio com GIFs animados e PNG estáticos'
    ],
    liveUrl: 'projeto pokedex/videoaplicativo.mp4',
    githubUrl: 'https://github.com/SPACEzinxl',
    gallery: [
      'projeto pokedex/tela1.png',
      'projeto pokedex/tela2.png',
      'projeto pokedex/tela3.png',
      'projeto pokedex/tela4.png',
      'projeto pokedex/tela5.png',
      'projeto pokedex/tela6.png',
      'projeto pokedex/tela7.png',
      'projeto pokedex/tela8.png'
    ]
  },
  'proj-2': {
    title: '🐾 PetShop 3 — Sistema de Gestão Completo',
    image: 'assets/petshop-logo.png',
    video: null,
    tags: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Full Stack'],
    overview: 'Sistema web completo para gestão de petshop desenvolvido com PHP e MySQL. O sistema oferece controle total do negócio: cadastro e autenticação de usuários, gerenciamento de estoque com alertas de quantidade mínima, módulo de caixa para registro de vendas, e dashboard com indicadores em tempo real como total de produtos cadastrados, itens em estoque e produtos abaixo do estoque mínimo.',
    challenges: 'O maior desafio foi garantir integridade transacional nas vendas: verificar estoque disponível antes de registrar cada venda, atualizar automaticamente a quantidade em estoque após a transação e manter consistência entre as tabelas produtos, estoque, venda e itens_venda usando prepared statements para segurança contra SQL injection.',
    features: [
      '🔐 Autenticação com controle de sessão PHP e redirecionamento seguro',
      '📊 Dashboard com cards de métricas: produtos, total em estoque e alertas de estoque mínimo',
      '📦 Módulo de estoque com controle de quantidade mínima e alertas visuais',
      '💰 Módulo de caixa/vendas com verificação de disponibilidade e registro completo de transações',
      '📋 Cadastro de produtos com integração direta ao banco de dados MySQL'
    ],
    liveUrl: '#contato',
    githubUrl: 'https://github.com/SPACEzinxl/petshop',
    gallery: []
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const openBtns = document.querySelectorAll('.open-modal-btn');

  if (!modal) return;

  const modalImg = document.getElementById('modal-img');
  const modalVideo = document.getElementById('modal-video');
  const modalVideoSrc = document.getElementById('modal-video-src');
  const modalGallery = document.getElementById('modal-gallery');
  const modalTitle = document.getElementById('modal-title');
  const modalTags = document.getElementById('modal-tags');
  const modalOverview = document.getElementById('modal-overview');
  const modalChallenges = document.getElementById('modal-challenges');
  const modalFeatures = document.getElementById('modal-features');
  const modalLiveLink = document.getElementById('modal-live-link');
  const modalGithubLink = document.getElementById('modal-github-link');

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalOverview.textContent = data.overview;
    modalChallenges.textContent = data.challenges;
    modalGithubLink.href = data.githubUrl;

    // Mostrar vídeo ou imagem
    if (data.video) {
      modalImg.style.display = 'none';
      modalVideoSrc.src = data.video;
      modalVideo.load();
      modalVideo.style.display = 'block';
      modalLiveLink.href = data.video;
      modalLiveLink.querySelector('span').textContent = '▶ Ver Vídeo Demo';
      modalLiveLink.target = '_blank';
    } else {
      modalVideo.style.display = 'none';
      modalVideo.pause();
      modalImg.src = data.image;
      modalImg.alt = data.title;
      modalImg.style.display = 'block';
      modalLiveLink.href = data.liveUrl;
      modalLiveLink.querySelector('span').textContent = 'Acessar Demonstração';
      modalLiveLink.target = '_self';
    }

    // Galeria
    modalGallery.innerHTML = '';
    if (data.gallery && data.gallery.length > 0) {
      modalGallery.style.display = 'grid';
      
      if (data.video) {
        const vidThumb = document.createElement('div');
        vidThumb.className = 'modal-gallery-img';
        vidThumb.style.display = 'flex';
        vidThumb.style.alignItems = 'center';
        vidThumb.style.justifyContent = 'center';
        vidThumb.style.background = 'var(--bg-tertiary)';
        vidThumb.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="var(--text-main)"><path d="M8 5v14l11-7z"/></svg>';
        vidThumb.title = 'Vídeo Demo';
        vidThumb.onclick = () => {
          modalImg.style.display = 'none';
          modalVideoSrc.src = data.video;
          modalVideo.load();
          modalVideo.play();
          modalVideo.style.display = 'block';
        };
        modalGallery.appendChild(vidThumb);
      }

      data.gallery.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.className = 'modal-gallery-img';
        img.onclick = () => {
          modalVideo.style.display = 'none';
          modalVideo.pause();
          modalImg.src = imgSrc;
          modalImg.style.display = 'block';
        };
        modalGallery.appendChild(img);
      });
    } else {
      modalGallery.style.display = 'none';
    }

    // Tags
    modalTags.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    // Features
    modalFeatures.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.textContent = feat;
      modalFeatures.appendChild(li);
    });

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Pausar o vídeo ao fechar
    if (modalVideo) {
      modalVideo.pause();
    }
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      openModal(targetId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. FORMULÁRIO DE CONTATO & VALIDAÇÃO
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email-input');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validação Nome
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    } else {
      nameInput.closest('.form-group').classList.remove('has-error');
    }

    // Validação E-mail
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    } else {
      emailInput.closest('.form-group').classList.remove('has-error');
    }

    // Validação Mensagem
    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    } else {
      messageInput.closest('.form-group').classList.remove('has-error');
    }

    if (isValid) {
      const name = encodeURIComponent(nameInput.value.trim());
      const subject = encodeURIComponent(subjectInput.value.trim() || 'Contato via Portfólio');
      const message = encodeURIComponent(`Olá Samuel,\n\nMeu nome é ${nameInput.value.trim()}.\n\n${messageInput.value.trim()}`);
      
      showToast('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success');
      
      // Abrir cliente de email como fallback amigável ou WhatsApp se o usuário preferir
      const mailtoLink = `mailto:seu-email@exemplo.com?subject=${subject}&body=${message}`;
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 800);

      form.reset();
    } else {
      showToast('Por favor, preencha os campos obrigatórios corretamente.', 'error');
    }
  });

  // Limpar erro ao digitar
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('has-error');
    });
  });
}

/* ==========================================================================
   9. NOTIFICAÇÕES TOAST
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✔';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   10. BOTÃO VOLTAR AO TOPO
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   11. ANO DINÂMICO NO RODAPÉ
   ========================================================================== */
function initFooterYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   12. GERENCIADOR DE CERTIFICADOS (FILTROS, BUSCA & MODAL)
   ========================================================================== */
function initCertificates() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');
  const searchInput = document.getElementById('cert-search-input');
  const clearSearchBtn = document.getElementById('cert-search-clear');
  const visibleCountElem = document.getElementById('cert-visible-count');
  const emptyState = document.getElementById('cert-empty-state');
  const resetFiltersBtn = document.getElementById('btn-reset-cert-filters');

  // Modal elements
  const modal = document.getElementById('cert-modal');
  const modalCloseBtn = document.getElementById('cert-modal-close-btn');
  const modalTitle = document.getElementById('cert-modal-title');
  const modalIframe = document.getElementById('cert-modal-iframe');
  const modalOpenLink = document.getElementById('cert-modal-open-link');
  const modalDownloadLink = document.getElementById('cert-modal-download-link');
  const modalFallbackBtn = document.getElementById('cert-modal-fallback-btn');
  const previewBtns = document.querySelectorAll('.btn-cert-preview');

  if (!certCards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  // Aplica filtros combinados (categoria + busca textual)
  function filterCertificates() {
    let visibleCount = 0;

    certCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const content = card.textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = (!searchTerm || title.includes(searchTerm) || content.includes(searchTerm));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => {
          card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 20);
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Atualiza contagem visível
    if (visibleCountElem) {
      visibleCountElem.textContent = visibleCount;
    }

    // Exibe ou oculta estado vazio
    if (emptyState) {
      emptyState.style.display = (visibleCount === 0) ? 'block' : 'none';
    }

    // Exibe ou oculta botão de limpar busca
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchTerm ? 'flex' : 'none';
    }
  }

  // Eventos de clique nas categorias
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterCertificates();
    });
  });

  // Evento de busca em tempo real com debounce leve
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      filterCertificates();
    });
  }

  // Botão de limpar busca
  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchTerm = '';
      searchInput.focus();
      filterCertificates();
    });
  }

  // Botão de redefinir filtros no estado vazio
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      activeCategory = 'all';
      searchTerm = '';
      if (searchInput) searchInput.value = '';
      filterBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-category') === 'all');
      });
      filterCertificates();
    });
  }

  // ================= MODAL DE VISUALIZAÇÃO DE CERTIFICADO =================
  function openCertModal(title, pdfUrl) {
    if (!modal) return;

    if (modalTitle) modalTitle.textContent = title;
    if (modalOpenLink) modalOpenLink.href = pdfUrl;
    if (modalDownloadLink) {
      modalDownloadLink.href = pdfUrl;
      modalDownloadLink.setAttribute('download', `${title}.pdf`);
    }
    if (modalFallbackBtn) modalFallbackBtn.href = pdfUrl;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Garante que o iframe receba a URL somente após o modal estar visível
    if (modalIframe) {
      modalIframe.src = pdfUrl;
    }
  }

  function closeCertModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Limpa src após a animação de saída para parar a renderização do PDF
    setTimeout(() => {
      if (modalIframe && !modal.classList.contains('open')) {
        modalIframe.src = '';
      }
    }, 300);
  }

  // Ouvintes para abertura do modal via botões de preview
  previewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-title');
      const pdfUrl = btn.getAttribute('data-pdf');
      openCertModal(title, pdfUrl);
    });
  });

  // Fechar modal no botão fechar
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCertModal);
  }

  // Fechar ao clicar fora do modal
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeCertModal();
      }
    });
  }

  // Fechar ao pressionar tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeCertModal();
    }
  });
}
