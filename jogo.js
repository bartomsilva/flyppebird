console.log('[DevSoutinho] Flappy Bird');
//////////////////////
/////////////////////
//som do impacto no chão / 
const som_HIT = new Audio();
som_HIT.src ='./efeitos/hit.wav';
const som_PONTO = new Audio();
som_HIT.src ='./efeitos/ponto.wav';

// serve para parar algum movimento  - chão e etc
let morreu=false;
let frames=0;
let telaAtiva = {};
let velocidadeCanos=300; // tempo para desenhar um novo cano
let velocidadePontuacao=25; // frames para pontuar +1

const globais = {};
const sprites = new Image();
sprites.src = './spritesp.png'; // pesonalizado 

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
/////////////////////////
// T E L A   GAME O V E R
/////////////////////////
const mensagemGameOver = {
    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: (canvas.width/2)-226/2,  y: 50,
    desenha() {
        contexto.drawImage(
        sprites,
        mensagemGameOver.sX, mensagemGameOver.sY,
        mensagemGameOver.w, mensagemGameOver.h,
        mensagemGameOver.x, mensagemGameOver.y,
        mensagemGameOver.w, mensagemGameOver.h,
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
    
        contexto.font = '30px VT323';
        contexto.fillStyle = '#0000ff';
        contexto.textAlign = "center";
        contexto.textAlign="center";  
        contexto.fillText("Sua Meta", canvas.width/2,414);
        contexto.fillStyle = '#ff0000';
        contexto.fillText(`${placar.melhor} Pontos`, canvas.width/2,445);
    

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
    x: 70, // posição inicial 
    y: 100, // posição inicial 
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
            mudaParaTela(Telas.GAME_OVER);                       
       
        }
    
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
    movimentos: [
        { spriteX: 0, spriteY:  0}, // asa pra cima
        { spriteX: 0, spriteY: 26}, // asa no meio
        { spriteX: 0, spriteY: 52}, // asa pra baixo
        { spriteX: 0, spriteY: 26}, // asa no meio
        { spriteX: 0, spriteY: 26}, // asa no meio - para cair
        
    ],
    atualizaOFrameAtual(){
       if (flappyBird.xbaterdeasa == flappyBird.xfreio){    
           flappyBird.frameAtual = flappyBird.xframe;
           flappyBird.xframe++;
           if (flappyBird.xframe > flappyBird.movimentos.length-2 ){
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
            const passou100frames = ( frames % velocidadeCanos === 0 );
            if (passou100frames){
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random()+1),   
                    lagura: canos.largura,
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
                mudaParaTela(Telas.GAME_OVER);
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
/// [T E l A S]  - TELAS
///////////////


////////////////
//   P L A C A R - PLACAR
////////////////

const placar = {
    pontuacao: 0,
    melhor: 1000,
    desenha(){
        contexto.font = '30px VT323';
        contexto.fillStyle = '#fff';
        contexto.textAlign = "right";
    },
    atualiza(){
        contexto.font = '30px VT323';
        contexto.fillStyle = '#fff';
        contexto.textAlign = "right";
        contexto.fillText(`${placar.pontuacao}`, canvas.width-5,35);
    },
    score(){
        minhapontuacao=placar.pontuacao;
        bestpontucao=placar.melhor;
        
        contexto.font = '30px VT323';
        contexto.fillStyle = '#fff';
        contexto.textAlign = "center";
        contexto.fillText(`${placar.pontuacao}`, 100,161);
        contexto.fillText(`${placar.melhor}`, 231,161);
        if (minhapontuacao > bestpontucao){
            console.log("esse numero "+minhapontuacao+"é maior > que esse "+bestpontucao);
            som_PONTO.play();
            placar.melhor = minhapontuacao;
            placar.pontuacao =0 ;
        }
    },
    reset(){    
        placar.pontuacao=0;
    },

}
    



/////////////////////
// M U D A   T E L A - MUDA TELA
///////////////////// 
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
    if(telaAtiva.inicializa){
         telaAtiva.inicializa();
     }
 }

////////////
// T E L A S - TELAS
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
            //mensagemGetREady.desenha();
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
            //placar = criaPlacar();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.canos.desenha();
            chao.desenha();
            globais.flappyBird.desenha();
            placar.desenha();
        },
        click(){
            globais.flappyBird.pula();
        },
        atualiza(){
            chao.atualiza();
            globais.canos.atualiza();
            globais.flappyBird.atualiza();
            placar.atualiza();
        }
    },
    GAME_OVER:{
        desenha(){
            mensagemGameOver.desenha();                
        },
        click(){    
            mudaParaTela(Telas.INICIO);
        },
        atualiza(){
            //mensagemGameOver.reset();  

        }
    },
    
};
//////////
// L O O P - LOOP
//////////
function loop(){
    telaAtiva.desenha();
    if (!morreu){
        telaAtiva.atualiza();  
        frames++;
    } else {
        chao.atualiza();
        frames=0;
    }
    requestAnimationFrame(loop);
  }

////////////////////
//P O N T U A Ç Ã O - PONTUAÇÃO
///////////////////
function pontuacao(){

    let pontuacao = placar.pontuacao;
    if (frames % velocidadePontuacao ===0){     
        placar.pontuacao++;
        if (pontuacao>100 && pontuacao<200){
            velocidadeCanos=200; 
            velocidadePontuacao=15; 
        } else if (pontuacao>200 && pontuacao<500){
            velocidadeCanos=100; 
            velocidadePontuacao=10; 
        } else if (pontuacao>500){
            velocidadeCanos=90; 
            velocidadePontuacao=3; 
        }              
     }
     placar.atualiza();
  }
  
///////////////////////////
// ESCUTAS; CLICK / TECLADO - ESCUTAS
///////////////////////////
window.addEventListener('click',function(){
    if (telaAtiva.click()){
        telaAtiva.click();
    };
});
window.addEventListener('keydown',function(){
    if (telaAtiva.click()){
        telaAtiva.click();
    };
});

//////////////////////
/// COLISAO COM O SOLO - TESTE DE COLISÃO COM O SOLO
//////////////////////
function colisaoChao(flappyBird, chao ){

    if (flappyBird.y+flappyBird.altura >= chao.y){
        return true;
    }
    return false;
}
////////////////////////
/// COLISAO COM OS CANOS - TESTE DE COLISÃO COM OS CANOS
////////////////////////
function colisaoCanos(xCano){
    
    pontuacao(); // pontuação colocada aqui para evitar
    // que o usuário desative as barreiras
    // e fazer pontos infinitos rsrsrsrsrs.

    // posição de cima (cabeça) do f-Bird é o seu Y
    const cabecaFlappyBird = globais.flappyBird.y;
    // posição de baixo (pés) do f-Bird é a medida da Cabeça+sua Altura)
    const pesFlappyBird = cabecaFlappyBird+globais.flappyBird.altura;
    // posição variávo do f-Bird ( inicia no  X + largura=boca e muda só para x = calda dele)
    let flappyBirdX = globais.flappyBird.x+globais.flappyBird.largura;
    // posição do cano do Chao no eixo Y ( sua altura ) - dado armazenado no desenho dos canos
    const canoDochao = xCano.ydoChao;
    // posição do cano do Ceu no eixo Y ( sua base ) - dado armazenado no desenho dos canos
    const canoDoCeu  = xCano.ydoCeu;

    // obstáculo no eixo X (canos) calculado: posição X do Cano - a largura do f-Bird
    // considerada a largura do f_Bird para que ao tocar no cano já considera morte.
    // sem considerar essa medida o f-Bird chega a passar da borda do cano.
    //const paredeX = xCano.x-globais.flappyBird.largura;
    const paredeX = xCano.x;
    const paredex = xCano.x +xCano.lagura; 
    // DEPURANDO analizando as medidas relativas entre cabeça x cano do ceu e pés cano do chão
    //console.log("ceu = ",canoDoCeu,"cabeça = ",cabecaFlappyBird+"\nchao = ",canoDochao+" pes ="+pesFlappyBird+"\n"+xCano)
    
    if ( flappyBirdX >= paredeX ){       // se f-Bird chegou no limite dos canos
        //console.log("ceu = ",canoDoCeu,"cabeça = ",cabecaFlappyBird+"\nchao = ",canoDochao+" pes ="+pesFlappyBird+"\n")
        //console.log("parede x",paredeX+" x-F-birde",flappyBirdX+" fim parede "+paredex);
        // ao atingir o limite da parede vertical
        // o X do f-Bird é ajustuado retirando dele sua largura
        // para comprar se já passou da parede vertical
        // para não da o bug de que sendo os y abaixo atingidos porém ele 
        // já tenha ultrapassao o limite de verificação vertical.
        flappyBirdX = flappyBirdX - globais.flappyBird.largura;
        if (pesFlappyBird>=canoDochao){  // testa se os pés batem no cano de baixo
            if (flappyBirdX <= paredex){
            return true;
            }                
        }
        if (cabecaFlappyBird<=canoDoCeu){// teste se a cabeça bate no cano de cima
            if (flappyBirdX<=paredex){
            return true;        
            }
        }                                 
    }                              

    return false;
}

function fBirdCai(){

}
//////////////
//  S T A R T  
//////////////

mudaParaTela(Telas.INICIO);
loop();


