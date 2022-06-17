console.log('[DevSoutinho] Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

//backgound PLANO DE FUNDO
const planoDeFundo= {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x:0,
    y: canvas.height -204,
    desenha() {
        contexto.fillStyle ='#70c5ce';
        contexto.fillRect(0,0,canvas.width,canvas.height);
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x+planoDeFundo.largura, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

    },
}

//chao
const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height-112,
    desenha() {
        contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
        );
         contexto.drawImage(
             sprites,
             chao.spriteX, chao.spriteY,
             chao.largura, chao.altura,
             chao.x+chao.largura, chao.y,
             chao.largura, chao.altura,
        );
    },
};

//chao
const mensagemGetREady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width/2)-174/2,  y: 50,
    desenha() {
        contexto.drawImage(
        sprites,
        mensagemGetREady.sX, mensagemGetREady.sY,
        mensagemGetREady.w, mensagemGetREady.h,
        mensagemGetREady.x, mensagemGetREady.y,
        mensagemGetREady.w, mensagemGetREady.h,
        );
    },
};

// ]flappyBird
//object = struc do c#
const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    atualiza(){
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;

    },
    desenha(){
        contexto.drawImage(
          sprites, 
          flappyBird.spriteX, flappyBird.spriteY, // sprite x e sprite y 
          flappyBird.largura, flappyBird.altura, // tamanho largura e altua
          flappyBird.x, flappyBird.y, // posiçao x e y
          flappyBird.largura, flappyBird.altura // tamanho largura x algura
        ); 
    },
} 

////////////////////////
/// Telas
///////////////////////

let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
}
const Telas = {
    INICIO: {
        desenha() {
            //Telas.JOGO.desenha();
            planoDeFundo.desenha();
            chao.desenha();
            flappyBird.desenha();
            mensagemGetREady.desenha();
        },
        click(){
            mudaParaTela(Telas.JOGO)

        },
        atualiza(){

        }
    }
};
Telas.JOGO = {
    desenha() {
        planoDeFundo.desenha();
        chao.desenha();
        flappyBird.desenha();
    },
    atualiza(){
        flappyBird.atualiza();
    }
};


// aqui é desenhado  o fundo / chao / passaro
function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();
       
    requestAnimationFrame(loop);
  
}

window.addEventListener('click',function(){
    if (telaAtiva.click()){
        telaAtiva.click();
    };
});

mudaParaTela(Telas.INICIO);
loop();

