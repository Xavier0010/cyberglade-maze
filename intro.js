// File: intro.js
window.IntroAnimation = {
    text1: "CYBERGLADE MAZE",
    text2: "by DTP AI Specialist",
    charIndex1: 0,
    charIndex2: 0,
    isFinished: false,
    onCompleteCallback: null,

    fadeAlpha: 0,
    cursorBlinkCounter: 0,
    showCursor: true,
    typingSpeed: 2,

    state: 'TYPING_TEXT1',
    stateCounter: 0,

    start: function(onComplete) {
        this.onCompleteCallback = onComplete;
        this.animate();
    },

    animate: function() {
        if (this.isFinished) return;

        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        ctx.fillStyle = '#000022';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (window.updateAndDrawParticles) window.updateAndDrawParticles();

        this.cursorBlinkCounter++;
        if (this.cursorBlinkCounter % 30 === 0) this.showCursor = !this.showCursor;

        ctx.textAlign = 'center';

        const drawCursor = (text, yPos) => {
            if (!this.showCursor) return;
            const cursorX = ctx.measureText(text).width / 2 + cx;
            ctx.fillText('_', cursorX + 8, yPos);
        };

        const drawText1 = (alpha) => {
            ctx.font = "bold 52px 'Orbitron'";
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.shadowColor = '#00BFFF';
            ctx.shadowBlur = 14;
            ctx.fillText(this.text1, cx, cy - 20);
            ctx.shadowBlur = 0;
        };

        const drawText2 = (alpha) => {
            ctx.font = "bold 22px 'Orbitron'";
            ctx.fillStyle = `rgba(204,221,255,${alpha})`;
            ctx.shadowColor = '#00BFFF';
            ctx.shadowBlur = 8;
            ctx.fillText(this.text2, cx, cy + 24);
            ctx.shadowBlur = 0;
        };

        this.stateCounter++;
        switch (this.state) {
            case 'TYPING_TEXT1':
                if (this.stateCounter % this.typingSpeed === 0 && this.charIndex1 < this.text1.length) this.charIndex1++;
                ctx.font = "bold 52px 'Orbitron'";
                ctx.fillStyle = '#FFFFFF';
                ctx.shadowColor = '#00BFFF';
                ctx.shadowBlur = 14;
                const shown1 = this.text1.substring(0, this.charIndex1);
                ctx.fillText(shown1, cx, cy - 20);
                drawCursor(shown1, cy - 20);
                ctx.shadowBlur = 0;
                if (this.charIndex1 >= this.text1.length) { this.state = 'TYPING_TEXT2'; this.stateCounter = 0; }
                break;

            case 'TYPING_TEXT2':
                drawText1(1);
                if (this.stateCounter % this.typingSpeed === 0 && this.charIndex2 < this.text2.length) this.charIndex2++;
                ctx.font = "bold 22px 'Orbitron'";
                ctx.fillStyle = '#CCDDFF';
                ctx.shadowColor = '#00BFFF';
                ctx.shadowBlur = 8;
                const shown2 = this.text2.substring(0, this.charIndex2);
                ctx.fillText(shown2, cx, cy + 24);
                drawCursor(shown2, cy + 24);
                ctx.shadowBlur = 0;
                if (this.charIndex2 >= this.text2.length) { this.state = 'FINAL_PAUSE'; this.stateCounter = 0; this.fadeAlpha = 1; }
                break;

            case 'FINAL_PAUSE':
                drawText1(1);
                drawText2(1);
                if (this.stateCounter > 120) { this.state = 'FADING_OUT'; this.stateCounter = 0; }
                break;

            case 'FADING_OUT':
                this.fadeAlpha -= 0.02;
                drawText1(this.fadeAlpha);
                drawText2(this.fadeAlpha);
                if (this.fadeAlpha <= 0) {
                    this.isFinished = true;
                    this.onCompleteCallback();
                }
                break;
        }

        requestAnimationFrame(() => this.animate());
    }
};
