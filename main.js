import './style.css'
import { gsap } from 'gsap';
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Draggable } from "gsap/Draggable";
import { neonCursor } from 'https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js'

// NEON BOTTOM SECTION
neonCursor({
  el: document.getElementById('app'),
  shaderPoints: 16,
  curvePoints: 80,
  curveLerp: 0.5,
  radius1: 5,
  radius2: 30,
  velocityTreshold: 10,
  sleepRadiusX: 100,
  sleepRadiusY: 100,
  sleepTimeCoefX: 0.0025,
  sleepTimeCoefY: 0.0025
})

//SMOOTH SCROLL
const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

//MUSIC
let audioContext;
let isAudioEnabled = false;

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  isAudioEnabled = true;
  updateAudioIcon();
};

//C Major
const tones = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
//D Major
// const tones = [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33];
//F Major
// const tones = [349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 659.25, 698.46];

//E Minor
// const tones = [329.63, 369.99, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25];
//A Minor
// const tones = [440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00];
//Bb Major
// const tones = [466.16, 523.25, 587.33, 622.25, 698.46, 783.99, 880.00, 932.33];
//Petatonic
// const tones = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
//Blues
// const tones = [440.00, 523.25, 587.33, 622.25, 659.25, 783.99, 880.00];
//G Major
// const tones = [392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 739.99, 783.99];

const playTone = (frequency) => {
  if (!audioContext || !isAudioEnabled) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);


  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.value = 0.1;

  oscillator.start();

  // Smooth fade-out
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Start at full volume
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // Fade to almost zero in 0.5 seconds

  oscillator.stop(audioContext.currentTime + 0.5); // Stop the oscillator after 0.5 seconds
};

const updateAudioIcon = () => {
  const audioIcon = document.getElementById('audioControl');
  audioIcon.textContent = isAudioEnabled ? '🔊' : '🔇';
};

const audioIcon = document.getElementById('audioControl');
const mainContent = document.querySelector('.main-content');
const logoLoader = document.querySelector('.logo-loader');

mainContent.addEventListener('click', initAudioContext);
mainContent.addEventListener('touchstart', initAudioContext);
logoLoader.addEventListener('click', initAudioContext);
logoLoader.addEventListener('touchstart', initAudioContext);
audioIcon.addEventListener('click', initAudioContext);
audioIcon.addEventListener('touchstart', initAudioContext);

const onHoverOrTouch = (element, frequency, timeline) => {
  element.addEventListener('mouseover', () => {
    playTone(frequency);
    timeline.pause();
    gsap.to(element, { backgroundColor: getRandomColor(), duration: 0.5 }); // Replace 'hoverColor' with your desired color
  });
  element.addEventListener('click', () => {
    playTone(getRandomTone());
    timeline.pause();
    gsap.to(element, { backgroundColor: getRandomColor(), duration: 0.5 }); // Replace 'hoverColor' with your desired color
  });
  element.addEventListener('mouseout', () => {
    timeline.resume(); // Resume the timeline animation
  });
  element.addEventListener('touchstart', () => {
    playTone(getRandomTone());
    timeline.pause();
    gsap.to(element, { backgroundColor: getRandomColor(), duration: 0.5 }); // For touch devices
  });
  element.addEventListener('touchmove', () => {
    playTone(frequency);
    timeline.pause();
    gsap.to(element, { backgroundColor: getRandomColor(), duration: 0.5 }); // Replace 'hoverColor' with your desired color
  });
  element.addEventListener('touchend', () => {
    timeline.resume(); // Resume the timeline animation
  });
};

//PRELOAD ANIMATIONS
const colors = ["#FF5733", "#B5179E", "aqua", "#4CC9F0", "#4895EF", "#F72585", "#4361EE", "#480CA8", "#33FF57", "#3357FF", "#F333FF", "#FF3357", "#96246A", "#67006E", "#FA6455", "#F7D8BB", "#C33E7D"];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
const getRandomTone = () => tones[Math.floor(Math.random() * tones.length)];

const shuffleColors = (colorsArray) => {
  let array = [...colorsArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const createColorCycleTimeline = (element, delay) => {
  // Shuffle colors for each element
  const shuffledColors = shuffleColors(colors);

  // Create a timeline for this element
  const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: delay });

  // Cycle through the shuffled colors
  shuffledColors.forEach(color => {
    tl.to(element, {
      backgroundColor: color,
      duration: 1.5,
      ease: "sine.inOut"
    });
  });

  return tl;
};

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const mainContent = document.querySelector('.main-content');
  const logoLoader = document.querySelector('.logo-loader');
  const letterPieces = document.querySelectorAll('.letter-piece');
  const signUpButton = document.querySelector('.magnet button');

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  // Prevent scrolling on canvas touch
  const canvasContainer = document.getElementById('app');
  const canvasContainer2 = document.getElementById('app');
  if (canvasContainer) {
    canvasContainer.addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, { passive: false });
  }
  if (canvasContainer2) {
    canvasContainer2.addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, { passive: false });
  }

  gsap.registerPlugin(ScrollTrigger, InertiaPlugin, Draggable, MorphSVGPlugin);

  // Create a timeline for preload
  const tl = gsap.timeline({ 
    onComplete: () => {
      preloader.style.width = '0';

      // Reveal the main content
      gsap.to(mainContent, {
        visibility: 'visible',
        opacity: 1,
        duration: 0.5,
        ease: 'sine.in'
      });
    }
  });

  // Animate the logoLoader's position
  tl.to(logoLoader, {
    top: '0%',
    left: '0%',
    transform: 'translate(0, 0)',
    duration: 1.15,
    ease: "bounce.out"
  });
  
  createColorCycleTimeline(signUpButton, 0);

  // Create a timeline for each letter piece with its unique color journey
  letterPieces.forEach((piece, index) => {
    const toneFrequency = tones[index % tones.length];
    const tl = createColorCycleTimeline(piece, index * 0.1);
    onHoverOrTouch(piece, toneFrequency, tl);
  });

  //Scroll and other anims
  // gsap.to('.playground', {
  //   scrollTrigger: {
  //     trigger: '.playground',
  //     start: '10% 10%',
  //     end: 'bottom 60%',
  //     // markers: {
  //     //   startColor: "purple",
  //     //   endColor: "fuchsia",
  //     //   fontSize: "3rem",
  //     // },
  //     scrub: true
  //   },
  //   opacity: 0,
  //   display: 'none',
  //   ease: 'none',
  //   duration: .5
  // });

  // const rotateTimeline = gsap.timeline({repeat: -1, yoyo: true});
  // rotateTimeline.to('.rotating-element', { rotation: 360, duration: 10, ease: 'linear' });

  // gsap.to('.fade-out-section', {
  //   scrollTrigger: {
  //     trigger: '.fade-out-section',
  //     start: 'top center', // Start when the top of the element hits the center of the viewport
  //     end: 'bottom top', // End when the bottom of the element leaves the top of the viewport
  //     toggleActions: 'play none none reverse', // Animation plays on scroll down and reverses on scroll up
  //   },
  //   opacity: 0,
  //   duration: 1,
  // });

  // EMOJI
  var options = {
    invertX: false,
    invertY: false,
    limitX: 40,
    limitY: 40
  }
  
  var emoji = document.getElementById('emoji');
  var parallax = new Parallax(emoji, options);

  // EYE
  const eyeCont = document.querySelector(".eye-container");
  const eye = document.querySelector(".eye");
  const q = gsap.utils.selector(eye);

  const tlEye = gsap.timeline();
  tlEye.timeScale(0.95);

  tlEye
    .to(q(".lashes--bottom"), {
      morphSVG:
        "M402.15,537.7a3,3,0,0,1-3-3h0a3,3,0,0,1,6,0h0A3,3,0,0,1,402.15,537.7Zm-79.49-18.21h0a3,3,0,0,0-5.54-2.3h0a3,3,0,0,0,1.62,3.92,3.1,3.1,0,0,0,1.15.23A3,3,0,0,0,322.66,519.49Zm-70.39-45.63h0a3,3,0,0,0-4.24-4.24h0a3,3,0,0,0,2.12,5.12A3,3,0,0,0,252.27,473.86Zm233.29,47.25a3,3,0,0,0,1.62-3.92h0a3,3,0,1,0-5.54,2.3h0a3,3,0,0,0,2.77,1.85A3.14,3.14,0,0,0,485.56,521.11Zm70.7-47.25a3,3,0,0,0,0-4.24h0a3,3,0,0,0-4.24,4.24h0a3,3,0,0,0,2.12.88A3,3,0,0,0,556.26,473.86Z",
      duration: 0.3,
      ease: "expo.inOut"
    })
    .to(
      q(".lashes--bottom"),
      {
        opacity: 0,
        duration: 0.1
      },
      ">-.1"
    )
    .to(
      q(".eye__lid"),
      {
        morphSVG:
          "M571.61,399.31s-77-90.1-172-90.1-172,90.1-172,90.1,77-91.31,172-91.31S571.61,399.31,571.61,399.31Z",
        duration: 0.8,
        ease: "expo.inOut"
      },
      "<-.3"
    )
    .to(
      q(".lashes--top"),
      {
        opacity: 1,
        duration: 0.1
      },
      ">-.4"
    )
    .from(
      q(".lashes--top"),
      {
        morphSVG:
          "M402.15,265.78a3,3,0,0,1-3-3h0a3,3,0,0,1,6,0h0A3,3,0,0,1,402.15,265.78Zm85,14.51h0a3,3,0,1,0-5.54-2.3h0a3,3,0,0,0,1.62,3.92,2.88,2.88,0,0,0,1.15.23A3,3,0,0,0,487.18,280.29Zm69.08,47.57h0a3,3,0,0,0-4.24-4.24h0a3,3,0,0,0,2.12,5.12A3,3,0,0,0,556.26,327.86ZM321,281.91a3,3,0,0,0,1.62-3.92h0a3,3,0,1,0-5.54,2.3h0a3,3,0,0,0,2.77,1.85A3,3,0,0,0,321,281.91Zm-68.77,45.95a3,3,0,0,0,0-4.24h0a3,3,0,0,0-4.24,4.24h0a3,3,0,0,0,4.24,0Z",
        duration: 0.4,
        ease: "back.out(1.5)"
        // ease: "expo.inOut"
      },
      "<-.1"
    )
    .from(
      q(".eye__inner"),
      {
        y: 150,
        scale: 1.15,
        duration: 0.75,
        transformOrigin: "center",
        ease: "expo.inOut"
      },
      "<-.4"
    )
    .from(
      q(".iris, .pupil, .glare"),
      {
        scale: 0.25,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "elastic.out(.65, 2)",
        transformOrigin: "center"
      },
      "<+.3"
    );

  // eyeCont.addEventListener("click", handleClick, false);
  eye.addEventListener("click", handleClick, false);

  createMouseTracking(".pupil", 50);
  createMouseTracking(".iris", 15);
  createMouseTracking(".glare", 360);

  // Open/close eye on click
  function handleClick() {
    if (tlEye.reversed()) {
      tlEye.play();
    } else {
      tlEye.reverse();
    }
  }

  // Setup mouse position tracking for select elements
  function createMouseTracking(element, maxTranslation = 30) {
    const el = document.querySelector(element);

    // Create a max distance for the mouse position to the center of the element
    let maxXDist, maxYDist;
    let centerX, centerY;

    // Reset parameters based on the window size
    function resize() {
      maxXDist = innerWidth / 2;
      maxYDist = innerHeight / 2;

      // Since SVG transform-origin can be finicky, get the bounding box
      // 	coordinates for the element to calculate its center
      const elArea = el.getBoundingClientRect();
      const radius = elArea.width / 2;
      centerX = elArea.left + radius;
      centerY = elArea.top + radius;
    }

    // Use mouse coordinates to update element position
    function updateTranslation(e) {
      maxXDist = innerWidth / 2;
      maxYDist = innerHeight / 2;

      // Since SVG transform-origin can be finicky, get the bounding box
      // 	coordinates for the element to calculate its center
      const elArea = el.getBoundingClientRect();
      const radius = elArea.width / 2;
      centerX = elArea.left + radius;
      centerY = elArea.top + radius;
      // Calculate the distance from the mouse position to the center.
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;

      // Put that number over the max distance
      const xPercent = x / maxXDist;
      const yPercent = y / maxYDist;

      // Multiply that by the max translation value and apply it to the element
      const maxXPercent = xPercent * maxTranslation;
      const maxYPercent = yPercent * maxTranslation;

      gsap.to(el, {
        xPercent: maxXPercent,
        yPercent: maxYPercent,
        duration: 0.5,
        overwrite: "auto"
      });
    }

    window.addEventListener("resize", resize);
    resize();

    window.addEventListener("mousemove", updateTranslation);
  }

  // CAROUSEL
  var cards = gsap.utils.toArray(".work-card"),
    dragDistancePerRotation = 3000,
    radius = 520,
    proxy = document.createElement("div"), // just a dummy element that'll get dragged, but we don't care about it.
    progressWrap = gsap.utils.wrap(0, 1),
    spin = gsap.fromTo(cards, {
      rotationY: i => i * 360 / cards.length
    }, {
      rotationY: "-=360",
      duration: 20,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50% " + -radius + "px"
    }),
    startProgress;

  Draggable.create(proxy, {
    trigger: ".work-container", // activate the dragging when the user presses on the .demoWrapper
    type: "x", // we only care about movement on the x-axis.
    inertia: true,
    allowNativeTouchScrolling: true,
    onPress() {
      gsap.killTweensOf(spin); // if it's in the middle of animating the spin back to timeScale: 1, kill that.
      spin.timeScale(0); // stop the spin.
      startProgress = spin.progress(); // remember the current progress value because we'll make the drag relative to that.
    },
    onDrag: updateRotation,
    onThrowUpdate: updateRotation,
    onRelease() {
      if (!this.tween || !this.tween.isActive()) { // if the user clicked and released (no inertia flick), resume the spin
        gsap.to(spin, {timeScale: 1, duration: 1});
      }
    },
    onThrowComplete() { // resume the spin after the inertia tween finishes
      gsap.to(spin, {timeScale: 1, duration: 1});
    }
  });

  function updateRotation() {
    let p = startProgress + (this.startX - this.x) / dragDistancePerRotation;
    spin.progress(progressWrap(p));
  }

  // MAGNETS
  class HoverButton {
    constructor(el) {
      this.el = el;
      this.hover = false;
      this.calculatePosition();
      this.attachEventsListener();
    }
    
    attachEventsListener() {
      window.addEventListener('mousemove', e => this.onMouseMove(e));
      window.addEventListener('resize', e => this.calculatePosition(e));
    }
    
    calculatePosition() {
      gsap.set(this.el, {
        x: 0,
        y: 0,
        scale: 1
      });
      const box = this.el.getBoundingClientRect();
      this.x = box.left + (box.width * 0.5);
      this.y = box.top + (box.height * 0.5);
      this.width = box.width;
      this.height = box.height;
    }
    
    onMouseMove(e) {
      this.calculatePosition();
      let hover = false;
      let hoverArea = (this.hover ? 0.7 : 0.5);
      let x = e.clientX - this.x;
      let y = e.clientY - this.y;
      let distance = Math.sqrt(x * x + y * y);
      if (distance < (this.width * hoverArea)) {
        hover = true;
        if (!this.hover) {
          this.hover = true;
        }
        this.onHover(e.clientX, e.clientY);
      }
      
      if (!hover && this.hover) {
        this.onLeave();
        this.hover = false;
      }
    }
    
    onHover(x, y) {
      gsap.to(this.el, {
        duration: 0.4,
        x: (x - this.x) * 0.4,
        y: (y - this.y) * 0.4,
        scale: 1.15,
        ease: "power2.out",
        zIndex: 10
      });
    }
    onLeave() {
      gsap.to(this.el, {
        duration: 0.7,
        x: 0,
        y: 0,
        scale: 1,
        ease: "elastic.out(1.2, 0.4)",
        zIndex: 10
      });
    }
  }

  const btn1 = document.querySelector('li:nth-child(1) button');
  new HoverButton(btn1);

  // animateTestimonials();
});

// GSAP for Testimonials Scrolling
function animateTestimonials() {
  const testimonials = gsap.timeline({
    defaults: { ease: "linear" },
    repeat: -1,
  });

  let totalWidth = document.querySelector('.testimonials').offsetWidth;

  testimonials.to(".testimonials", {
    x: () => `-${totalWidth}px`,
    duration: 60, // Adjust duration based on your preference
    ease: "none",
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
    },
  });
}


const preload = () => {

  let manager = new THREE.LoadingManager();
  manager.onLoad = function() { 
    const environment = new Environment( typo, particle );
  }

  var typo = null;
  const loader = new THREE.FontLoader( manager );
  const font = loader.load('https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json', function ( font ) { typo = font; });
  const particle = new THREE.TextureLoader( manager ).load( 'https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png');

}

if ( document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll))
  preload ();
else
  document.addEventListener("DOMContentLoaded", preload ); 

class Environment {
  constructor( font, particle ){ 
    this.font = font;
    
    this.particle = particle;
    this.container = document.querySelector( '#magic' );
    this.scene = new THREE.Scene();
    this.createCamera();
    this.createRenderer();
    this.setup()
    this.bindEvents();
  }

  bindEvents(){
    window.addEventListener( 'resize', this.onWindowResize.bind( this ));
  }

  setup(){ 
    this.createParticles = new CreateParticles( this.scene, this.font,  
    this.particle, this.camera, this.renderer );
  }

  render() {
     this.createParticles.render()
     this.renderer.render( this.scene, this.camera )
  }

  createCamera() {

    this.camera = new THREE.PerspectiveCamera( 65, this.container.clientWidth /  this.container.clientHeight, 1, 10000 );
    this.camera.position.set( 0,0, 100 );

  }

  createRenderer() {

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

    this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2));

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild( this.renderer.domElement );

    this.renderer.setAnimationLoop(() => { this.render() })

  }

  onWindowResize(){

    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

  }
}

class CreateParticles {
	
	constructor( scene, font, particleImg, camera, renderer ) {
    
		this.scene = scene;
		this.font = font;
		this.particleImg = particleImg;
		this.camera = camera;
		this.renderer = renderer;
		
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2(-200, 200);
		
		this.colorChange = new THREE.Color();

		this.buttom = false;

		this.data = {

			text: 'Looks\nGood\nLabs',
			amount: 1500,
			particleSize: 1,
			particleColor: 0xffffff,
			textSize: 16,
			area: 250,
			ease: .05,
		}

		this.setup();
		this.bindEvents();

	}


	setup(){

		const geometry = new THREE.PlaneGeometry( this.visibleWidthAtZDepth( 100, this.camera ), this.visibleHeightAtZDepth( 100, this.camera ));
		const material = new THREE.MeshBasicMaterial( { color: 0xD45D8A, transparent: false } );
		this.planeArea = new THREE.Mesh( geometry, material );
		this.planeArea.visible = true;
		this.createText();

	}

	bindEvents() {

		document.addEventListener( 'mousedown', this.onMouseDown.bind( this ));
		document.addEventListener( 'mousemove', this.onMouseMove.bind( this ));
		document.addEventListener( 'mouseup', this.onMouseUp.bind( this ));

    document.addEventListener('touchstart', this.onTouchStart.bind(this));
    document.addEventListener('touchmove', this.onTouchMove.bind(this));
    document.addEventListener('touchend', this.onTouchEnd.bind(this));
		
	}

	onMouseDown(){
		
		this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		const vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 0.5);
		vector.unproject( this.camera );
		const dir = vector.sub( this.camera.position ).normalize();
		const distance = - this.camera.position.z / dir.z;
		this.currenPosition = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
		
		const pos = this.particles.geometry.attributes.position;
		this.buttom = true;
		this.data.ease = .01;
		
	}

	onMouseUp(){

		this.buttom = false;
		this.data.ease = .05;
	}

	onMouseMove( ) { 

	    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	}

  onTouchStart(event) {
    if (event.touches.length > 0) {
      this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;
      this.onMouseDown(); // Call the same logic as onMouseDown
    }
  }
  
  onTouchMove(event) {
    if (event.touches.length > 0) {
      this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;
      this.onMouseMove(); // Call the same logic as onMouseMove
    }
  }
  
  onTouchEnd(event) {
    this.onMouseUp(); // Call the same logic as onMouseUp
  }

	render( level ){ 

		const time = ((.001 * performance.now())%12)/12;
		const zigzagTime = (1 + (Math.sin( time * 2 * Math.PI )))/6;

		this.raycaster.setFromCamera( this.mouse, this.camera );

		const intersects = this.raycaster.intersectObject( this.planeArea );

		if ( intersects.length > 0 ) {

			const pos = this.particles.geometry.attributes.position;
			const copy = this.geometryCopy.attributes.position;
			const coulors = this.particles.geometry.attributes.customColor;
			const size = this.particles.geometry.attributes.size;

		    const mx = intersects[ 0 ].point.x;
		    const my = intersects[ 0 ].point.y;
		    const mz = intersects[ 0 ].point.z;

		    for ( var i = 0, l = pos.count; i < l; i++) {

		    	const initX = copy.getX(i);
		    	const initY = copy.getY(i);
		    	const initZ = copy.getZ(i);

		    	let px = pos.getX(i);
		    	let py = pos.getY(i);
		    	let pz = pos.getZ(i);

		    	this.colorChange.setHSL( .5, 1 , 1 )
		    	coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    	coulors.needsUpdate = true;

		    	size.array[ i ]  = this.data.particleSize;
		    	size.needsUpdate = true;

		    	let dx = mx - px;
		    	let dy = my - py;
		    	const dz = mz - pz;

		    	const mouseDistance = this.distance( mx, my, px, py )
		    	let d = ( dx = mx - px ) * dx + ( dy = my - py ) * dy;
		    	const f = - this.data.area/d;

		    	if( this.buttom ){ 

		    		const t = Math.atan2( dy, dx );
		    		px -= f * Math.cos( t );
		    		py -= f * Math.sin( t );

		    		this.colorChange.setHSL( .5 + zigzagTime, 1.0 , .5 )
		    		coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    		coulors.needsUpdate = true;

		    		if ((px > (initX + 70)) || ( px < (initX - 70)) || (py > (initY + 70) || ( py < (initY - 70)))){

		    			this.colorChange.setHSL( .78, 1.0 , .5 )
		    			coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
		    			coulors.needsUpdate = true;

		    		}

		    	}else{
		    	
			    	if( mouseDistance < this.data.area ){

			    		if(i%5==0){

			    			const t = Math.atan2( dy, dx );
			    			px -= .03 * Math.cos( t );
			    			py -= .03 * Math.sin( t );

			    			this.colorChange.setHSL( .78 , 1.0 , .5 )
			    			coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
			    			coulors.needsUpdate = true;

							size.array[ i ]  =  this.data.particleSize /1.2;
							size.needsUpdate = true;

			    		}else{

					    	const t = Math.atan2( dy, dx );
					    	px += f * Math.cos( t );
					    	py += f * Math.sin( t );

					    	pos.setXYZ( i, px, py, pz );
					    	pos.needsUpdate = true;

					    	size.array[ i ]  = this.data.particleSize * 1.3 ;
					    	size.needsUpdate = true;
				    	}

			    		if ((px > (initX + 10)) || ( px < (initX - 10)) || (py > (initY + 10) || ( py < (initY - 10)))){

			    			this.colorChange.setHSL( .78, 1.0 , .5 )
			    			coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
			    			coulors.needsUpdate = true;

			    			size.array[ i ]  = this.data.particleSize /1.8;
			    			size.needsUpdate = true;

			    		}
			    	}

		    	}

		    	px += ( initX  - px ) * this.data.ease;
		    	py += ( initY  - py ) * this.data.ease;
		    	pz += ( initZ  - pz ) * this.data.ease;

		    	pos.setXYZ( i, px, py, pz );
		    	pos.needsUpdate = true;

		    }
		}
	}

	createText(){ 

		let thePoints = [];

		let shapes = this.font.generateShapes( this.data.text , this.data.textSize  );
		let geometry = new THREE.ShapeGeometry( shapes );
		geometry.computeBoundingBox();
	
		const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
		const yMid =  (geometry.boundingBox.max.y - geometry.boundingBox.min.y)/2.85;

		geometry.center();

		let holeShapes = [];

		for ( let q = 0; q < shapes.length; q ++ ) {

			let shape = shapes[ q ];

			if ( shape.holes && shape.holes.length > 0 ) {

				for ( let  j = 0; j < shape.holes.length; j ++ ) {

					let  hole = shape.holes[ j ];
					holeShapes.push( hole );
				}
			}

		}
		shapes.push.apply( shapes, holeShapes );

		let colors = [];
		let sizes = [];
					
		for ( let  x = 0; x < shapes.length; x ++ ) {

			let shape = shapes[ x ];

			const amountPoints = ( shape.type == 'Path') ? this.data.amount/2 : this.data.amount;

			let points = shape.getSpacedPoints( amountPoints ) ;

			points.forEach( ( element, z ) => {
						
				const a = new THREE.Vector3( element.x, element.y, 0 );
				thePoints.push( a );
				colors.push( this.colorChange.r, this.colorChange.g, this.colorChange.b);
				sizes.push( 1 )

				});
		}

		let geoParticles = new THREE.BufferGeometry().setFromPoints( thePoints );
		geoParticles.translate( xMid, yMid, 0 );
				
		geoParticles.setAttribute( 'customColor', new THREE.Float32BufferAttribute( colors, 3 ) );
		geoParticles.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1) );

		const material = new THREE.ShaderMaterial( {

			uniforms: {
				color: { value: new THREE.Color( 0xffffff ) },
				pointTexture: { value: this.particleImg }
			},
			vertexShader: document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
		} );

		this.particles = new THREE.Points( geoParticles, material );
		this.scene.add( this.particles );

		this.geometryCopy = new THREE.BufferGeometry();
		this.geometryCopy.copy( this.particles.geometry );
		
	}

	visibleHeightAtZDepth ( depth, camera ) {

	  const cameraOffset = camera.position.z;
	  if ( depth < cameraOffset ) depth -= cameraOffset;
	  else depth += cameraOffset;

	  const vFOV = camera.fov * Math.PI / 180; 

	  return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
	}

	visibleWidthAtZDepth( depth, camera ) {

	  const height = this.visibleHeightAtZDepth( depth, camera );
	  return height * camera.aspect;

	}

	distance (x1, y1, x2, y2){
	   
	    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
	}
}
