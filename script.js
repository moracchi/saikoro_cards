class SugorokuCardGame {
    constructor() {
        this.cards = [];
        this.isCardSelected = false;
        this.currentBGM = null;
        this.audioElements = {};
        this.cardNumbers = [1, 2, 3, 4, 5, 6];
        
        this.init();
    }
    
    init() {
        // DOM要素の取得
        this.cardsContainer = document.getElementById('cards-container');
        this.resultArea = document.getElementById('result-area');
        this.resultImage = document.getElementById('result-image');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.particlesContainer = document.getElementById('particles');
        
        // 音声要素の初期化
        this.initAudio();
        
        // カードの初期化とイベントリスナー設定
        this.refreshCardsAndEvents();
        
        // シャッフルとBGMボタンのイベントリスナー設定
        this.bindStaticEvents();
        
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
                // 音声読み込みエラーのハンドリング
                audio.addEventListener('error', () => {
                    console.warn(`音声ファイル ${id} の読み込みに失敗しました`);
                });
            }
        });
    }
    
    // カード要素の再取得とイベントリスナーの再設定（重要な修正点）
    refreshCardsAndEvents() {
        // 既存のイベントリスナーをクリア
        if (this.cards && this.cards.length > 0) {
            this.cards.forEach(card => {
                if (card && card.cloneNode) {
                    const newCard = card.cloneNode(true);
                    card.parentNode.replaceChild(newCard, card);
                }
            });
        }
        
        // カード要素を再取得
        this.cards = Array.from(document.querySelectorAll('.card'));
        
        // カードクリックイベントを設定
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => this.onCardClick(e));
            
            // タッチイベント対応（スマホ用）
            card.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!this.isCardSelected) {
                    card.style.transform = 'scale(1.1)';
                }
            });
            
            card.addEventListener('touchend', (e) => {
                e.preventDefault();
                card.style.transform = '';
            });
            
            card.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                card.style.transform = '';
            });
        });
        
        console.log(`カードイベントリスナー再登録完了: ${this.cards.length}枚`);
    }
    
    // 静的なボタンのイベントリスナー設定
    bindStaticEvents() {
        // シャッフルボタン
        this.shuffleBtn.addEventListener('click', () => this.shuffle());
        
        // BGMボタン
        document.getElementById('bgm1').addEventListener('click', () => this.playBGM('bgm1-audio'));
        document.getElementById('bgm2').addEventListener('click', () => this.playBGM('bgm2-audio'));
        document.getElementById('bgm-stop').addEventListener('click', () => this.stopBGM());
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
    async onCardClick(e) {
        if (this.isCardSelected) return;
        
        const card = e.currentTarget;
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
        
        // 結果表示
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
    
    // 結果表示
    showResult(number) {
        this.resultImage.src = `images/${number}.png`;
        this.resultImage.alt = number;
        
        this.resultArea.classList.remove('hidden');
        this.resultArea.classList.add('fade-in');
        
        // カードグリッドを隠す
        this.cardsContainer.style.opacity = '0.3';
        this.cardsContainer.style.pointerEvents = 'none';
    }
    
    // シャッフル処理（修正版）
    shuffle() {
        this.playSound('shuffle-audio');
        
        // カード番号をシャッフル
        const shuffledNumbers = this.shuffleArray(this.cardNumbers);
        
        // 全カードをリセット
        this.cards.forEach((card, index) => {
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
                    
                    // 最後のカードの処理が終わったらイベントリスナーを再設定
                    if (index === this.cards.length - 1) {
                        setTimeout(() => {
                            this.refreshCardsAndEvents();
                            console.log('シャッフル完了 - イベントリスナー再登録済み');
                        }, 100);
                    }
                }, 800);
            }, index * 100);
        });
        
        // 結果エリアを隠す
        this.resultArea.classList.add('hidden');
        this.resultArea.classList.remove('fade-in');
        
        // カードグリッドを復活
        setTimeout(() => {
            this.cardsContainer.style.opacity = '1';
            this.cardsContainer.style.pointerEvents = 'auto';
            this.isCardSelected = false;
        }, 1200); // 少し長めに設定してイベントリスナーの再登録を確実にする
    }
    
    // BGM再生
    playBGM(audioId) {
        // 現在のBGMを停止
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
                
                // パーティクルを自動削除
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
    // ユーザーインタラクション後に音声を有効化（ブラウザポリシー対応）
    const enableAudio = () => {
        new SugorokuCardGame();
        document.removeEventListener('touchstart', enableAudio);
        document.removeEventListener('click', enableAudio);
    };
    
    // モバイルブラウザ対応
    document.addEventListener('touchstart', enableAudio, { once: true });
    document.addEventListener('click', enableAudio, { once: true });
    
    // PC環境では直接初期化
    if (!('ontouchstart' in window)) {
        enableAudio();
    }
});

// ビューポート設定の動的調整（iOS Safari対応）
function adjustViewport() {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}

window.addEventListener('resize', adjustViewport);
window.addEventListener('orientationchange', () => {
    setTimeout(adjustViewport, 100);
});
adjustViewport();

// PWA対応（オフライン使用可能）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Service Worker 登録成功'))
            .catch(() => console.log('Service Worker 登録失敗'));
    });
}
