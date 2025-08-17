class SugorokuCardGame {
    constructor() {
        this.isCardSelected = false;
        this.currentBGM = null;
        this.audioElements = {};
        this.cardNumbers = [1, 2, 3, 4, 5, 6];
        
        this.init();
    }
    
    init() {
        // DOM要素の取得
        this.cardsContainer = document.getElementById('cards-container');
        this.resultOverlay = document.getElementById('result-overlay');
        this.resultImage = document.getElementById('result-image');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.particlesContainer = document.getElementById('particles');
        
        // 音声要素の初期化
        this.initAudio();
        
        // イベントリスナーの設定（イベント委譲を使用）
        this.bindEventsWithDelegation();
        
        // 初期状態の設定
        this.shuffle();
        
        // グローバル参照用
        window.sugorokuGame = this;
        
        console.log('けんちゃんのすごろくカード 初期化完了！');
    }
    
    // 音声初期化
    initAudio() {
        const audioIds = ['bgm1-audio', 'bgm2-audio', 'card-flip-audio', 
                         'drum-roll-audio', 'fanfare-audio', 'shuffle-audio'];
        
        audioIds.forEach(id => {
            const audio = document.getElementById(id);
            if (audio) {
                this.audioElements[id] = audio;
                audio.addEventListener('error', () => {
                    console.warn(`音声ファイル ${id} の読み込みに失敗しました`);
                });
            }
        });
    }
    
    // イベント委譲を使用したイベントリスナー設定
    bindEventsWithDelegation() {
        // カードクリック：イベント委譲を使用
        this.cardsContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card && !this.isCardSelected) {
                this.onCardClick(card);
            }
        });
        
        // カードタッチイベント：イベント委譲を使用
        this.cardsContainer.addEventListener('touchstart', (e) => {
            const card = e.target.closest('.card');
            if (card && !this.isCardSelected) {
                e.preventDefault();
                card.style.transform = 'scale(1.1)';
            }
        });
        
        this.cardsContainer.addEventListener('touchend', (e) => {
            const card = e.target.closest('.card');
            if (card) {
                e.preventDefault();
                card.style.transform = '';
                if (!this.isCardSelected) {
                    this.onCardClick(card);
                }
            }
        });
        
        this.cardsContainer.addEventListener('touchcancel', (e) => {
            const card = e.target.closest('.card');
            if (card) {
                e.preventDefault();
                card.style.transform = '';
            }
        });
        
        // シャッフルボタン
        this.shuffleBtn.addEventListener('click', () => this.shuffle());
        
        // BGMボタン
        document.getElementById('bgm1').addEventListener('click', () => this.playBGM('bgm1-audio'));
        document.getElementById('bgm2').addEventListener('click', () => this.playBGM('bgm2-audio'));
        document.getElementById('bgm-stop').addEventListener('click', () => this.stopBGM());
        
        // オーバーレイクリック（背景クリックで閉じる）
        this.resultOverlay.addEventListener('click', (e) => {
            if (e.target === this.resultOverlay) {
                this.shuffle();
            }
        });
    }
    
    // 配列をシャッフルするヘルパー関数
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // カードクリック処理（2秒演出付き）
    async onCardClick(card) {
        const cardNumber = card.dataset.number;
        
        console.log(`カード選択: ${cardNumber}`);
        
        this.isCardSelected = true;
        
        // 効果音再生
        this.playSound('card-flip-audio');
        
        // 選択されたカードを強調
        card.classList.add('selected');
        
        // ランダムに演出パターンを選択（1〜5）
        const effectNumber = Math.floor(Math.random() * 5) + 1;
        await this.playCardEffect(card, effectNumber);
        
        // 2秒後にカードをめくる
        setTimeout(() => {
            card.classList.add('flipped');
        }, 2000);
        
        // 結果表示（中央オーバーレイ）
        setTimeout(() => {
            this.showResult(cardNumber);
            this.playSound('fanfare-audio');
            this.createParticles();
        }, 2500);
    }
    
    // カード演出実行
    async playCardEffect(card, effectNumber) {
        return new Promise((resolve) => {
            // 演出パターンに応じた処理
            switch(effectNumber) {
                case 1:
                    this.effect1_GlowPulse(card);
                    break;
                case 2:
                    this.effect2_Bouncing(card);
                    break;
                case 3:
                    this.effect3_MagicSpin(card);
                    break;
                case 4:
                    this.effect4_ShakeFlash(card);
                    break;
                case 5:
                    this.effect5_FloatOrbit(card);
                    break;
            }
            
            // ドラムロール音を0.5秒後に開始
            setTimeout(() => {
                this.playSound('drum-roll-audio');
                card.classList.add('drumroll-effect');
            }, 500);
            
            // 2秒後に演出終了
            setTimeout(() => {
                this.clearCardEffects(card);
                resolve();
            }, 2000);
        });
    }
    
    // 演出パターン1: 光るパルス
    effect1_GlowPulse(card) {
        card.classList.add('effect-1');
        console.log('演出: 神秘的な光のパルス');
    }
    
    // 演出パターン2: バウンシング
    effect2_Bouncing(card) {
        card.classList.add('effect-2');
        console.log('演出: 楽しいバウンシング');
    }
    
    // 演出パターン3: 魔法の回転
    effect3_MagicSpin(card) {
        card.classList.add('effect-3');
        console.log('演出: 魔法の回転');
    }
    
    // 演出パターン4: シェイク＆フラッシュ
    effect4_ShakeFlash(card) {
        card.classList.add('effect-4');
        console.log('演出: 激しいシェイク＆カラーフラッシュ');
    }
    
    // 演出パターン5: 浮遊＆星の軌道
    effect5_FloatOrbit(card) {
        card.classList.add('effect-5');
        console.log('演出: 幻想的な浮遊＆星の軌道');
    }
    
    // カード演出をクリア
    clearCardEffects(card) {
        const effectClasses = ['effect-1', 'effect-2', 'effect-3', 'effect-4', 'effect-5', 'drumroll-effect'];
        effectClasses.forEach(className => {
            card.classList.remove(className);
        });
    }
    
    // 結果表示（中央オーバーレイ）
    showResult(number) {
        this.resultImage.src = `images/${number}.png`;
        this.resultImage.alt = number;
        
        // オーバーレイを表示
        this.resultOverlay.classList.remove('hidden');
        this.resultOverlay.classList.add('fade-in');
        
        // カードグリッドを少し暗くする
        this.cardsContainer.style.opacity = '0.2';
        this.cardsContainer.style.pointerEvents = 'none';
    }
    
    // シャッフル処理
    shuffle() {
        this.playSound('shuffle-audio');
        
        // オーバーレイを隠す
        this.resultOverlay.classList.add('hidden');
        this.resultOverlay.classList.remove('fade-in');
        
        // カード番号をシャッフル
        const shuffledNumbers = this.shuffleArray(this.cardNumbers);
        
        // カード要素を取得
        const cards = Array.from(this.cardsContainer.querySelectorAll('.card'));
        
        // 全カードをリセット
        cards.forEach((card, index) => {
            setTimeout(() => {
                // エフェクトクラスもクリア
                this.clearCardEffects(card);
                card.classList.remove('flipped', 'selected');
                card.classList.add('shuffling');
                
                // カードに新しい番号を割り当て
                const newNumber = shuffledNumbers[index];
                card.dataset.number = newNumber;
                
                // カード表面の画像も更新
                const frontImage = card.querySelector('.card-image');
                if (frontImage) {
                    frontImage.src = `images/${newNumber}.png`;
                    frontImage.alt = newNumber;
                }
                
                setTimeout(() => {
                    card.classList.remove('shuffling');
                }, 800);
            }, index * 100);
        });
        
        // カードグリッドを復活
        setTimeout(() => {
            this.cardsContainer.style.opacity = '1';
            this.cardsContainer.style.pointerEvents = 'auto';
            this.isCardSelected = false;
            console.log('シャッフル完了');
        }, 1200);
    }
    
    // BGM再生
    playBGM(audioId) {
        this.stopBGM();
        
        const audio = this.audioElements[audioId];
        if (audio) {
            audio.currentTime = 0;
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.currentBGM = audio;
                    this.updateBGMButtons(audioId);
                }).catch(error => {
                    console.warn('BGM再生に失敗しました:', error);
                });
            }
        }
    }
    
    // BGM停止
    stopBGM() {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
            this.currentBGM = null;
        }
        this.updateBGMButtons(null);
    }
    
    // BGMボタン状態更新
    updateBGMButtons(activeAudioId) {
        const buttons = document.querySelectorAll('.bgm-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        if (activeAudioId) {
            const buttonId = activeAudioId.replace('-audio', '');
            const activeButton = document.getElementById(buttonId);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    }
    
    // 効果音再生
    playSound(audioId) {
        const audio = this.audioElements[audioId];
        if (audio) {
            audio.currentTime = 0;
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`効果音 ${audioId} の再生に失敗しました:`, error);
                });
            }
        }
    }
    
    // パーティクル効果生成
    createParticles() {
        const colors = ['#FFD700', '#FF6F00', '#4A148C', '#00BCD4', '#4CAF50'];
        
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.animationDelay = Math.random() * 0.3 + 's';
                
                this.particlesContainer.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }, i * 40);
        }
    }
}

// ページ読み込み完了時にゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    const enableAudio = () => {
        new SugorokuCardGame();
        document.removeEventListener('touchstart', enableAudio);
        document.removeEventListener('click', enableAudio);
    };
    
    document.addEventListener('touchstart', enableAudio, { once: true });
    document.addEventListener('click', enableAudio, { once: true });
    
    if (!('ontouchstart' in window)) {
        enableAudio();
    }
});

// ビューポート設定の動的調整
function adjustViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', adjustViewport);
window.addEventListener('orientationchange', () => {
    setTimeout(adjustViewport, 100);
});
adjustViewport();
