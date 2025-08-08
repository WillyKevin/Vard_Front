import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';

interface Slide {
  backgroundImage: string;
  title: string;
  description: string;
}

interface FAQ {
  title: string;
  description: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'app';

  showOverlay = false;
  isClosing = false;

  toggleOverlay(): void {
    if (this.showOverlay && !this.isClosing) {
      this.isClosing = true;

      setTimeout(() => {
        this.showOverlay = false;
        this.isClosing = false;
      }, 700);
    } else if (!this.showOverlay) {
      this.showOverlay = true;
    }
  }

  isPlaying = true;
  toggleVideo(videoElement: HTMLVideoElement) {
    if (this.isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  slides: Slide[] = [];
  currentSlide = 0;
  slideInterval: any;
  readonly slideDuration = 5000;
  isPaused = false;

  startSlideTimer() {
    clearInterval(this.slideInterval);
    if (!this.isPaused) {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, this.slideDuration);
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      clearInterval(this.slideInterval);
    } else {
      this.resetAnimation();
      this.startSlideTimer();
    }
  }

  resetTimerAndSelectSlide(index: number) {
    this.currentSlide = index;
    this.isPaused = false;
    this.resetAnimation();
    this.startSlideTimer();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.resetAnimation();
    if (!this.isPaused) {
      this.startSlideTimer();
    }
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.resetAnimation();
    if (!this.isPaused) {
      this.startSlideTimer();
    }
  }

  touchStartX = 0;
  touchEndX = 0;

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipeGesture();
  }

  handleSwipeGesture(): void {
    const swipeDistance = this.touchStartX - this.touchEndX;
    if (swipeDistance > 50) {
      this.nextSlide();
    } else if (swipeDistance < -50) {
      this.prevSlide();
    }
  }

  showAnimation = true;

  resetAnimation() {
    this.showAnimation = false;
    setTimeout(() => {
      this.showAnimation = true;
    }, 0);
  }

  videoSources: string[] = [
    'assets/videos/Vard_Campo.mp4',
    'assets/videos/Vard_Video.mp4',
    'assets/videos/Bicudos_Video.mp4'
  ];

  videoOrder: number[] = [0, 1, 2];

  playOnlyCenterVideo() {
    this.videoElements.forEach((videoRef, i) => {
      const videoEl = videoRef.nativeElement;
      if (i === 1) {
        videoEl.play();
      } else {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });
  }

  swapWithCenter(clickedIndex: number) {
    if (clickedIndex === 1) return;

    const temp = this.videoOrder[1];
    this.videoOrder[1] = this.videoOrder[clickedIndex];
    this.videoOrder[clickedIndex] = temp;

    setTimeout(() => {
      this.playOnlyCenterVideo();
    });
  }

  @ViewChildren('videoRef') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;

  ngAfterViewInit() {
    this.playOnlyCenterVideo();
  }

  typedTextIntroduction: string = '';
  fullTextIntroduction: string = 'Boas Vindas à Nossa Plataforma!';

  typedTextFooter: string = '';
  fullTextFooter: string = 'Envie uma Mensagem para nossa Equipe.';

  typingSpeed: number = 100;
  deletingSpeed: number = 50;
  pauseBetweenCycles: number = 2000;

  typeWriterLoop(
    fullText: string,
    setTypedText: (val: string) => void,
    index: number = 0,
    deleting: boolean = false
  ) {
    if (!deleting && index <= fullText.length) {
      setTypedText(fullText.substring(0, index));
      setTimeout(() => this.typeWriterLoop(fullText, setTypedText, index + 1, false), this.typingSpeed);
    } else if (deleting && index >= 0) {
      setTypedText(fullText.substring(0, index));
      setTimeout(() => this.typeWriterLoop(fullText, setTypedText, index - 1, true), this.deletingSpeed);
    } else {
      setTimeout(() => {
        this.typeWriterLoop(fullText, setTypedText, deleting ? 0 : fullText.length, !deleting);
      }, this.pauseBetweenCycles);
    }
  }

  faqs: FAQ[] = [
    {
      title: 'Qual a origem dos projetos?',
      description: 'Os projetos têm origem na Fatec Pompeia - Fundação Shunji Nishimura, sendo frutos da iniciativa acadêmica e do compromisso da instituição com a inovação no agronegócio. Desenvolvidos no ambiente educacional da Fatec, os projetos refletem a aplicação prática do conhecimento adquirido em sala de aula. Toda a concepção, desenvolvimento e execução das soluções ocorreram sob a estrutura e orientação oferecidas pela instituição. Dessa forma, os projetos pertencem oficialmente à Fatec Pompeia e são representações diretas de seu potencial formador e tecnológico.',
      isOpen: false
    },
    {
      title: 'Como funciona o V.A.R.D?',
      description: 'O V.A.R.D funciona a partir da captação de imagens de armadilhas adesivas utilizadas no monitoramento agrícola, que são processadas por um sistema inteligente baseado em Visão Computacional e Inteligência Artificial. Utilizando ferramentas modernas como Google Colab, TensorFlow, YOLOv8 e APIs da Google Cloud, o sistema identifica e contabiliza automaticamente pragas como Tripes e Mosca-branca. Todo o treinamento do modelo foi realizado com um dataset exclusivo, construído do zero pela equipe ao longo de um ano de coleta, rotulagem e curadoria de imagens reais em campo. Essa base robusta de dados garante alta precisão na detecção e torna o V.A.R.D uma solução eficiente e escalável para aplicações em agricultura de precisão, com potencial para auxiliar técnicos e produtores na tomada de decisão rápida e baseada em dados.',
      isOpen: false
    },
    {
      title: 'Como funciona o projeto Bicudo´s?',
      description: 'O projeto Bicudo’s integra o uso de tecnologias modernas com metodologias experimentais voltadas ao estudo do bicudo-da-cana-de-açúcar, uma praga de grande impacto na cultura da cana. A iniciativa conta com testes realizados em laboratórios experimentais e a construção de um viveiro controlado, desenvolvido especialmente para simular condições ideais de reprodução e comportamento da praga. Esse ambiente permite a coleta de dados com maior precisão e frequência, intensificando os padrões de estudo e aumentando a confiabilidade dos resultados. A combinação entre infraestrutura tecnológica, pesquisa aplicada e controle ambiental garante uma base sólida para o desenvolvimento de estratégias mais eficazes de monitoramento e controle biológico, contribuindo diretamente para práticas agrícolas mais sustentáveis.',
      isOpen: false
    },
    {
      title: 'Qual o papel do instituto biológico?',
      description: 'O Instituto Biológico atua como parceiro técnico nos projetos, oferecendo suporte científico e validando metodologias utilizadas em campo. Sua participação contribui significativamente para a credibilidade e a eficácia dos resultados. Um dos principais colaboradores é o pesquisador Fernando Salas, reconhecido nacionalmente por sua expertise no controle biológico de pragas. Sua orientação fortalece as estratégias aplicadas e garante embasamento técnico sólido. A presença do Instituto assegura um elo entre pesquisa aplicada e inovação agrícola..',
      isOpen: false
    }
  ];

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  ngOnInit() {
    this.slides = [
      {
        backgroundImage: 'assets/images/Vard_Card.jpg',
        title: 'Projeto - V.A.R.D',
        description: 'O V.A.R.D (Visão Artificial para Reconhecimento e Detecção) é um projeto inovador que combina Inteligência Artificial e Visão Computacional para automatizar a detecção e contagem de pragas agrícolas a partir de armadilhas adesivas. O sistema é especialmente voltado para o monitoramento de pragas de grande impacto econômico, como Tripes e Mosca-branca, auxiliando no controle fitossanitário de cultivos agrícolas. A partir da captura de imagens das armadilhas, algoritmos avançados de IA identificam e contabilizam os insetos presentes, proporcionando dados precisos e em tempo real para a tomada de decisão no campo. Essa abordagem reduz a necessidade de análises manuais, minimiza erros humanos e otimiza o tempo dos produtores e técnicos agrícolas. O projeto foi desenvolvido por um time multidisciplinar de 12 integrantes, reunindo estudantes de diferentes áreas do conhecimento, com orientação dos professores Hannes Fischer, João Ricardo Favan e Renata Coscolin. A colaboração entre áreas como agronomia, ciência de dados e computação permitiu alcançar resultados promissores na automatização do monitoramento de pragas, contribuindo diretamente para a evolução da agricultura de precisão no Brasil.'
      },
      {
        backgroundImage: 'assets/images/Bicudos_Card.jpg',
        title: 'Projeto - Bicduos',
        description: 'O Projeto Bicudo’s é uma iniciativa de caráter experimental e prático, desenvolvida com foco na captura e estudo do bicudo-da-cana-de-açúcar (Sphenophorus levis), uma das pragas mais relevantes para a cultura da cana no Brasil. Com orientação da docente Renata Coscolin, o projeto propõe o desenvolvimento de uma armadilha específica baseada em feromônios, buscando compreender melhor o comportamento, o ciclo biológico e a distribuição espacial dessa praga. A metodologia envolve a elaboração de armadilhas físicas e a aplicação de atrativos químicos (feromônios sintéticos) para promover a captura eficiente dos insetos em campo. A análise dos resultados obtidos contribuirá para estratégias mais eficazes de monitoramento e controle integrado de pragas (MIP), visando reduzir perdas econômicas e minimizar o uso de defensivos. A pesquisa é conduzida por uma equipe diversificada e interdisciplinar, composta por estudantes e pesquisadores de diferentes áreas do conhecimento, unindo esforços entre agronomia, biotecnologia e engenharia. O projeto também oferece uma importante oportunidade de aprendizado prático e científico, reforçando a importância da pesquisa aplicada no contexto do agronegócio sustentável.'
      }
      
    ];
    this.typeWriterLoop(this.fullTextIntroduction, val => this.typedTextIntroduction = val);
    this.typeWriterLoop(this.fullTextFooter, val => this.typedTextFooter = val);
    this.startSlideTimer();
  }

  ngOnDestroy() {
    clearInterval(this.slideInterval);
  }

  contact: string = 'vardproject@gmail.com';

  copiedContact: boolean = false;

  copyContact(): void {
    navigator.clipboard.writeText(this.contact).then(() => {
      this.copiedContact = true;

      setTimeout(() => {
        this.copiedContact = false;
      }, 2000);
    }).catch((err) => {
      console.error('Error copying contact email:', err);
    });
  }
}
