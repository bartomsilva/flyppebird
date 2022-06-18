console.log('[DevSoutinho] Flappy Bird');
//////////////////////
/////////////////////
//som do impacto no chão / 
const som_HIT = new Audio();
som_HIT.src ='./efeitos/hit.wav';

// serve para parar algum movimento  - chão e etc
let morreu=false;
let frames=0;
let telaAtiva = {};

const globais = {};
const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


/////////////////////////////////////////
//backgound P L A N O   D E  F U N D O 
/////////////////////////////////////////
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
/////////////////////////
// T E L A   I N I C I O
/////////////////////////
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

//////////
// CHÃO
/////////
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
            chao.x=0;
        } else {
            chao.x = chao.x - 1;  
        }        
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
 
/////////////////////////////////
///// GERAR O OBJETO flappyBird
/////////////////////////////////
function criaflappyBird(){

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
    xfreio:6,
    xbaterdeasa:0,
    atualiza(){
        if (colisaoChao(flappyBird,chao)){
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

////////////////
// CRIA CANOS
///////////////
function criaCanos(){
    const canos={
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,      
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 110,   
        desenha(){    
            canos.pares.forEach(function(par){
                const yRamdom = par.y;
                const espacamentoEntreCanos = canos.espaco;
                const canoCeuX = par.x;
                const canoCeuY = yRamdom;
                /////////////
                //CANO DO CEU
                /////////////
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                )
                ///////////////    
                // CANO DO CHÃO
                ///////////////
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos+yRamdom;
                
                par.ydoChao = canoChaoY;
                
                par.ydoCeu = canoChaoY - canos.espaco;

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
            const passou100frames = ( frames % 100 === 0 );
            if (passou100frames){
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random()+1),   
                    //ydoCeu:0, DEPURANDO
                    //ydoChao:0,DEPURANDO                                  
                });
            }

            canos.pares.forEach(function(par){
    
            par.x = par.x -2 ;
            ////////////////////////////////////////////    
            // TESTE  COLISÃO do flippyBird com os CANOS
            ////////////////////////////////////////////    
            if (colisaoCanos(par)){
                // som impacto
                som_HIT.play();
                //da um delay de 1s na troca de tela.
                morreu=true;
                setTimeout(()=> {
                mudaParaTela(Telas.INICIO);
                },600);   
                return;        
            }
             // apaga o cano na memória 
             if (par.x +canos.largura <= 0 ) {
              canos.pares.shift();
             }
            });
        }, 
    }
    return canos;
}


///////////////
/// [T E l A S] 
///////////////

/////////////////////////////////////
//selector de tela M U D A   T E L A 
///////////////////////////////////// 

function criaPlacar(){
    const placar = {
        pontuacao:1111111110,
        desenha(){
            contexto.font = '30px VT323';
            contexto.fillStyle = '#fff';
            contexto.textAlign = "right";
            contexto.fillText(`${placar.pontuacao}`, canvas.width-5,35);
        },
        atualiza(){
        },
    }
    
    return placar;
}
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
    if(telaAtiva.inicializa){
         telaAtiva.inicializa();
     }
 }


////////////
const Telas = {    
///////////
    INICIO: {
        inicializa(){
            morreu=true;
            globais.flappyBird = criaflappyBird();  
            globais.canos = criaCanos();    
        },
        desenha() {
            planoDeFundo.desenha();
            globais.flappyBird.desenha();
            globais.canos.desenha();
            chao.desenha();
            mensagemGetREady.desenha();
        },
        click(){
            morreu=false;
            mudaParaTela(Telas.JOGO)
        },
        atualiza(){
            chao.atualiza();
            globais.canos.atualiza();
        }
    },
    JOGO: {
        inicializa(){
            globais.placar = criaPlacar();

        },
        desenha() {
            planoDeFundo.desenha();
            globais.canos.desenha();
            chao.desenha();
            globais.flappyBird.desenha();
            globais.placar.desenha();
        },
        click(){
            globais.flappyBird.pula();
        },
        atualiza(){
            chao.atualiza();
            globais.canos.atualiza();
            globais.flappyBird.atualiza();
            globais.placar.atualiza();
        }
    },
    
};
/////////////////////////////////
// aqui é desenhado  e movimento
// repetição do jogo 
/////////////////////////////////
function loop(){
    telaAtiva.desenha();
    if (!morreu){
        telaAtiva.atualiza();  
        frames++;
    } else {
        frames=0;
    }

    requestAnimationFrame(loop);
  }

/////////////////////////
// ativando metodo CLICK
/////////////////////////
window.addEventListener('click',function(){
    if (telaAtiva.click()){
        telaAtiva.click();
    };
});

//////////////////////
/// COLISAO COM O SOLO
//////////////////////
function colisaoChao(flappyBird, chao ){
    if (flappyBird.y+flappyBird.altura >= chao.y){
        return true;
    }
    return false;
}
//////////////////////
/// COLISAO COM OS CANOS
//////////////////////
function colisaoCanos(xCano){
    
    const cabecaFlappyBird = globais.flappyBird.y;
    const pesFlappyBird = cabecaFlappyBird+globais.flappyBird.altura;

    const flappyBirdX = globais.flappyBird.x;

    //const canoDochao = globais.canos.chao.ydoChao;
    const canoDochao = xCano.ydoChao;
    //const canoDoCeu  = globais.canos.ceu.ydoCeu;
    const canoDoCeu  = xCano.ydoCeu;

    // parede vertical
    const paredeX = xCano.x-globais.flappyBird.largura;

    // DEPURANDO
    ////////////
    //console.log("ceu = ",canoDoCeu,"cabeça = ",cabecaFlappyBird+"\nchao = ",canoDochao+" pes ="+pesFlappyBird+"\n"+xCano)
    
    if ( flappyBirdX >= paredeX ){    
        if (pesFlappyBird>=canoDochao){ // colisão em baixo
           return true;
        }
        if (cabecaFlappyBird<=canoDoCeu){ // colisao em cima
            return true;        
        }
    }
    
    return false;
}


//////////////
//  S T A R T  
//////////////
mudaParaTela(Telas.INICIO);
loop();


