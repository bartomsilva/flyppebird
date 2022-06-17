console.log('[DevSoutinho] Flappy Bird');

//som do impacto no chão / 
const som_HIT = new Audio();
som_HIT.src ='./efeitos/hit.wav';


// serve para parar algum movimento  - chão e etc
let morreu=false;
let frames=0;

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

//INICIO
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


////////
///// GERAR O OBJETO globais.flappyBird
// novo zerado
function criaflappyBird(){
// [flappyBird
//object = struc do c#
const flappyBird= {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula(){
        flappyBird.velocidade = -flappyBird.pulo;
    },
    gravidade: 0.25,
    velocidade: 0,
    xframe:0,
    xfreio:10,
    xbaterdeasa:0,
    atualiza(){
        if (fazcolisao(flappyBird,chao)){
            // som impacto
            som_HIT.play();
            //da um delay de 1s na troca de tela.
            morreu=true;
            setTimeout(()=> {
                mudaParaTela(Telas.INICIO);
            },600);                    
            return;        
        }
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    movimentos: [
        { spriteX: 0, spriteY:  0}, // asa pra cima
        { spriteX: 0, spriteY: 26}, // asa no meio
        { spriteX: 0, spriteY: 52}, // asa pra baixo
        { spriteX: 0, spriteY: 26}, // asa no meio
    ],
    atualizaOFrameAtual(){
       if (flappyBird.xbaterdeasa == flappyBird.xfreio){    
           flappyBird.frameAtual = flappyBird.xframe;
           flappyBird.xframe++;
           if (flappyBird.xframe > flappyBird.movimentos.length-1 ){
               flappyBird.xframe = 0;
            }
            flappyBird.xbaterdeasa=0;
       }else {
           flappyBird.xbaterdeasa++;
       }
    },
    desenha(){
        flappyBird.atualizaOFrameAtual();

        // desestrutração 
        const  {spriteX, spriteY} = flappyBird.movimentos[flappyBird.xframe];

        contexto.drawImage(
          sprites, 
          spriteX, spriteY, // sprite x e sprite y 
          flappyBird.largura, flappyBird.altura, // tamanho largura e altua
          flappyBird.x, flappyBird.y, // posiçao x e y
          flappyBird.largura, flappyBird.altura // tamanho largura x algura
        ); 
    },
  } 
return flappyBird;
}

/////////
///////
/////
    //CHÃO
const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height-112,
    atualiza(){  
        const repeteEm = chao.largura / 2;
        if (chao.x <= - repeteEm){
        return chao.x=0;
        }
        chao.x = chao.x - 1;  
    },
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

function criaCanos(){
    const canos={
        largura: 52,
        altura: 400,
        xframe: 0, // contador de frames
        xdesenha:100, // ao atingir esse valor desenha novo cano
        chao: {
            spriteX: 0,
            spriteY:169,            
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco:80,        
        desenha(){
            
            canos.pares.forEach(function(par){
                const yRamdom = par.y;
                const espacamentoEntreCanos = 90;
                const canoCeuX = par.x;
                const canoCeuY = yRamdom;
                //cano do ceu
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                )
                //cano deo chão
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos+yRamdom;
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )       
            });            
        },
        pares: [],    
        atualiza(){
            const passou100frames = frames % 100 ===0;
            if (passou100frames){
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random()+1),
                });
            }
            canos.pares.forEach(function(par){
              par.x = par.x -2 ;
              if (par.x +canos.largura <= 0){
                  canos.pares.shift();
              }
            });
        }, 
    }
    return canos;

}



/////////
//////////
///////




////////////////////////
/// [Telas]
///////////////////////

const globais ={};
//////////////
// seletor para troca de telas
let telaAtiva = {};

//selector de tela
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
    if(telaAtiva.inicializa){
         telaAtiva.inicializa();
     }
 }

//////////////////////////
const Telas = {    
    INICIO: {
        inicializa(){
            morreu=false;

            globais.flappyBird = criaflappyBird();    
            globais.canos = criaCanos();    
            
        },
        desenha() {
            planoDeFundo.desenha();
            globais.flappyBird.desenha();
            globais.canos.desenha();
            chao.desenha();
        
    
            //mensagemGetREady.desenha();
        },
        click(){
            mudaParaTela(Telas.JOGO)
        },
        atualiza(){
            //chao.atualiza();
            //globais.canos.atualiza();
        }
    }
};

Telas.JOGO = {
    desenha() {
        planoDeFundo.desenha();
        globais.canos.desenha();
        chao.desenha();
        globais.flappyBird.desenha();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza(){
        globais.flappyBird.atualiza();
        

    
    }
}


/////////////////////////////////////////////
// aqui é desenhado  o fundo / chao / passaro
// repetição do jogo 
function loop(){
    if (!morreu){
        telaAtiva.desenha();
        telaAtiva.atualiza();  
        // mantém o cão emm movimento
        chao.atualiza();
        globais.canos.atualiza();
        frames++;

    }

    requestAnimationFrame(loop);
  }


// ativando metodo CLICK
window.addEventListener('click',function(){
    if (telaAtiva.click()){
        telaAtiva.click();
    };
});

//////////////
/// COLISAO
////////////
function fazcolisao(flappyBird, chao ){
    if (flappyBird.y+flappyBird.altura >= chao.y){
        return true;
    }
    return false;
}


//START DO PROGRAMA
mudaParaTela(Telas.INICIO);
loop();


