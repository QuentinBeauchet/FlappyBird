const hauteur = 700;
const largeur = 800;

const vitesse = 1.5;
const apparition = 2000;
const saut = 80;
const descente = 2;

const tuyauMinSize = 50;
const trouMinSize = 150;
const trouMaxSize = 300;
const trouLargeur = 50;
const tuyauHeadHeightDiff = 13;

const angleMax = 40;
const angleVitesse = 40;

var points = 0;

var tuyauBodyImg;
var tuyauHeadImg;
var birdImg;
var bgImg;

class Tuyau {
  constructor() {
    this.hauteur = Math.random() * (trouMaxSize - trouMinSize) + trouMinSize;
    this.largeur = trouLargeur;
    this.x = largeur + this.largeur;
    this.y =
      Math.random() * (hauteur - this.hauteur - tuyauMinSize * 2) +
      tuyauMinSize;
  }

  update() {
    this.x -= vitesse;
    if (this.x + this.largeur < 0) {
      tuyaux.splice(tuyaux.indexOf(this), 1);
      points++;
    }
  }

  draw() {
    this.check();

    image(tuyauBodyImg, this.x, 0, this.largeur, this.y - tuyauHeadHeightDiff);
    image(
      tuyauHeadImg,
      this.x,
      this.y - tuyauHeadHeightDiff,
      this.largeur,
      tuyauHeadHeightDiff
    );
    image(
      tuyauBodyImg,
      this.x,
      this.y + this.hauteur + tuyauHeadHeightDiff,
      this.largeur,
      hauteur - this.y - this.hauteur - tuyauHeadHeightDiff
    );
    image(
      tuyauHeadImg,
      this.x,
      this.y + this.hauteur,
      this.largeur,
      tuyauHeadHeightDiff
    );
  }

  check() {
    if (
      bird.x < this.x + this.largeur &&
      bird.x + bird.largeur > this.x &&
      (bird.y < this.y || bird.y + bird.hauteur > this.y + this.hauteur)
    ) {
      noLoop();
      setTimeout(() => {
        points = 0;
        bird = new Bird();
        tuyaux = [];
        loop();
      }, 3000);
    }
  }
}

class Bird {
  constructor() {
    this.x = 100;
    this.y = hauteur / 2;
    this.hauteur = 39;
    this.largeur = 40;
    this.chute = 0;
  }

  update(up) {
    if (up) {
      this.y -= this.y > 0 ? 1 : 0;
      this.chute = 0;
    } else {
      this.y += this.y + descente + this.hauteur < hauteur ? descente : 0;
      this.chute++;
    }
  }

  draw() {
    if (this.chute > 40) {
      var v = this.chute - angleVitesse;
      var a = v < angleMax ? (v > 0 ? v : 0) : angleMax;
      var d = a < 15 ? a : 15;
      translate(this.x, this.y);
      rotate(a);
      image(birdImg, d, -d, this.largeur, this.hauteur);
      rotate(-a);
      translate(-this.x, -this.y);
    } else {
      image(birdImg, this.x, this.y, this.largeur, this.hauteur);
    }
  }
}

var tuyaux = [];
var bird = new Bird();

function preload() {
  tuyauBodyImg = loadImage("Assets/tuyau_body.png");
  tuyauHeadImg = loadImage("Assets/tuyau_head.png");
  birdImg = loadImage("Assets/bird.png");
  bgImg = loadImage("Assets/bg.png");
}

function setup() {
  createCanvas(largeur, hauteur);
  angleMode(DEGREES);
  textSize(50);
  textAlign(CENTER);
  setInterval(() => {
    tuyaux.push(new Tuyau());
  }, apparition);
}

function draw() {
  background(bgImg);
  bird.update();
  bird.draw();
  tuyaux.forEach((tuyau) => {
    tuyau.update();
    tuyau.draw();
  });
  text(points, largeur / 2, 80);
}

function jump() {
  for (let i = 0; i < saut; i++) {
    bird.update(true);
    tuyaux.forEach((tuyau) => {
      tuyau.check();
    });
  }
}

function keyPressed() {
  if (keyCode === 32) {
    jump();
  }
}

function mouseClicked() {
  jump();
}
