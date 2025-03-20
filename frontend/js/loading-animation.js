// Abhi Tour and Travels Animation
// A realistic 2D animation script using HTML5 Canvas and JavaScript

const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Asset loading system
const assets = {
    images: {},
    loadedCount: 0,
    totalCount: 0,
    
    load: function(sources, callback) {
        this.totalCount = Object.keys(sources).length;
        for (const name in sources) {
            this.images[name] = new Image();
            this.images[name].onload = () => {
                this.loadedCount++;
                if (this.loadedCount === this.totalCount) {
                    callback();
                }
            };
            this.images[name].src = sources[name];
        }
    }
};

// Animation frames and timing
let startTime;
let animationFrameId;
const ANIMATION_DURATION = 30000; // 30 seconds

// Scene elements
const scenes = [
    {
        name: "planning",
        duration: 6000,
        elements: []
    },
    {
        name: "airport",
        duration: 6000,
        elements: []
    },
    {
        name: "flight",
        duration: 6000,
        elements: []
    },
    {
        name: "destinations",
        duration: 6000,
        elements: []
    },
    {
        name: "homecoming",
        duration: 6000,
        elements: []
    }
];

// Character class
class Character {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.frame = 0;
        this.frameCount = 8;
        this.frameDelay = 5;
        this.frameTimer = 0;
        this.messages = [];
        this.currentMessage = null;
        this.messageTime = 0;
        this.messageDuration = 3000;
        this.emotionState = "neutral";
        this.blinkTimer = 0;
        this.isBlinking = false;
        this.moving = false;
        this.targetX = x;
        this.moveSpeed = 2;
        this.facingRight = true;
    }
    
    update(deltaTime) {
        this.frameTimer++;
        if (this.frameTimer >= this.frameDelay) {
            this.frame = (this.frame + 1) % this.frameCount;
            this.frameTimer = 0;
        }
        
        this.blinkTimer += deltaTime;
        if (this.blinkTimer > 3000 && !this.isBlinking) {
            this.isBlinking = true;
            setTimeout(() => {
                this.isBlinking = false;
                this.blinkTimer = 0;
            }, 200);
        }
        
        if (this.currentMessage) {
            this.messageTime += deltaTime;
            if (this.messageTime >= this.messageDuration) {
                this.messageTime = 0;
                this.currentMessage = null;
                if (this.messages.length > 0) {
                    this.currentMessage = this.messages.shift();
                }
            }
        } else if (this.messages.length > 0) {
            this.currentMessage = this.messages.shift();
        }
        
        if (this.moving) {
            if (Math.abs(this.x - this.targetX) < this.moveSpeed) {
                this.x = this.targetX;
                this.moving = false;
            } else {
                if (this.x < this.targetX) {
                    this.x += this.moveSpeed;
                    this.facingRight = true;
                } else {
                    this.x -= this.moveSpeed;
                    this.facingRight = false;
                }
            }
        }
    }
    
    moveTo(targetX) {
        this.targetX = targetX;
        this.moving = true;
        this.facingRight = targetX > this.x;
    }
    
    setEmotion(emotion) {
        this.emotionState = emotion;
    }
    
    addMessage(text) {
        this.messages.push(text);
    }
    
    draw(ctx) {
        ctx.save();
        
        if (!this.facingRight) {
            ctx.translate(this.x + this.width, 0);
            ctx.scale(-1, 1);
            ctx.translate(-this.x, 0);
        }
        
        switch (this.type) {
            case 'traveler1':
                this.drawTraveler1(ctx);
                break;
            case 'traveler2':
                this.drawTraveler2(ctx);
                break;
            case 'agent':
                this.drawAgent(ctx);
                break;
            case 'flightAttendant':
                this.drawFlightAttendant(ctx);
                break;
            case 'localGuide':
                this.drawLocalGuide(ctx);
                break;
        }
        
        ctx.restore();
        
        if (this.currentMessage) {
            this.drawMessageBubble(ctx, this.currentMessage);
        }
    }
    
    drawTraveler1(ctx) {
        const walkCycle = Math.sin(this.frame / 2) * (this.moving ? 1 : 0.2);
        this.drawShadow(ctx);
        
        // Body
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.6);
        ctx.lineTo(this.x, this.y + this.height * 0.6);
        ctx.closePath();
        ctx.fill();
        
        // Shirt details
        ctx.fillStyle = '#E0E0E0';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.45, this.y);
        ctx.lineTo(this.x + this.width * 0.55, this.y); 
        ctx.lineTo(this.x + this.width * 0.55, this.y + this.height * 0.4);
        ctx.lineTo(this.x + this.width * 0.45, this.y + this.height * 0.4);
        ctx.closePath();
        ctx.fill();
        
        // Collar
        ctx.strokeStyle = '#D0D0D0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.4, this.y + 5);
        ctx.lineTo(this.x + this.width * 0.5, this.y + 15);
        ctx.lineTo(this.x + this.width * 0.6, this.y + 5);
        ctx.stroke();
        
        // Head
        ctx.fillStyle = '#FFD8C0';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - this.height * 0.15, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Hair
        ctx.fillStyle = '#301B0B';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - this.height * 0.18, this.width / 2 + 2, Math.PI, Math.PI * 2);
        ctx.fill();
        
        // Hair details
        ctx.strokeStyle = '#201000';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            const hairX = this.x + this.width * 0.3 + (i * this.width * 0.04);
            ctx.beginPath();
            ctx.moveTo(hairX, this.y - this.height * 0.35);
            ctx.bezierCurveTo(
                hairX - 2, this.y - this.height * 0.4,
                hairX + 5, this.y - this.height * 0.45,
                hairX + 3, this.y - this.height * 0.35
            );
            ctx.stroke();
        }
        
        // Eyes
        const eyeOffsetX = this.width * 0.15;
        const eyeOffsetY = this.y - this.height * 0.17;
        const eyeSize = 4;
        
        if (!this.isBlinking) {
            // Eyebrows
            ctx.strokeStyle = '#301B0B';
            ctx.lineWidth = 2;
            
            if (this.emotionState === "surprised" || this.emotionState === "excited") {
        ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2 - eyeOffsetX - 5, eyeOffsetY - 8);
                ctx.quadraticCurveTo(
                    this.x + this.width / 2 - eyeOffsetX, eyeOffsetY - 12,
                    this.x + this.width / 2 - eyeOffsetX + 5, eyeOffsetY - 8
                );
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2 + eyeOffsetX - 5, eyeOffsetY - 8);
                ctx.quadraticCurveTo(
                    this.x + this.width / 2 + eyeOffsetX, eyeOffsetY - 12,
                    this.x + this.width / 2 + eyeOffsetX + 5, eyeOffsetY - 8
                );
                ctx.stroke();
            } else if (this.emotionState === "thinking") {
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2 - eyeOffsetX - 5, eyeOffsetY - 8);
                ctx.quadraticCurveTo(
                    this.x + this.width / 2 - eyeOffsetX, eyeOffsetY - 4,
                    this.x + this.width / 2 - eyeOffsetX + 5, eyeOffsetY - 8
                );
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2 + eyeOffsetX - 5, eyeOffsetY - 6);
                ctx.quadraticCurveTo(
                    this.x + this.width / 2 + eyeOffsetX, eyeOffsetY - 10,
                    this.x + this.width / 2 + eyeOffsetX + 5, eyeOffsetY - 6
                );
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2 - eyeOffsetX - 5, eyeOffsetY - 8);
                ctx.quadraticCurveTo(
                    this.x + this.width / 2 - eyeOffsetX, eyeOffsetY - 8,
                    this.x + this.width / 2 - eyeOffsetX + 5, eyeOffsetY - 8
                );
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2 + eyeOffsetX - 5, eyeOffsetY - 8);
                ctx.quadraticCurveTo(
                    this.x + this.width / 2 + eyeOffsetX, eyeOffsetY - 8,
                    this.x + this.width / 2 + eyeOffsetX + 5, eyeOffsetY - 8
                );
                ctx.stroke();
            }
            
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 - eyeOffsetX, eyeOffsetY, eyeSize, 0, Math.PI * 2);
            ctx.arc(this.x + this.width / 2 + eyeOffsetX, eyeOffsetY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
            ctx.fillStyle = '#301B0B';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 - eyeOffsetX + (this.facingRight ? 1 : -1), eyeOffsetY, eyeSize / 2, 0, Math.PI * 2);
            ctx.arc(this.x + this.width / 2 + eyeOffsetX + (this.facingRight ? 1 : -1), eyeOffsetY, eyeSize / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = '#301B0B';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 - eyeOffsetX - 4, eyeOffsetY);
            ctx.lineTo(this.x + this.width / 2 - eyeOffsetX + 4, eyeOffsetY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 + eyeOffsetX - 4, eyeOffsetY);
            ctx.lineTo(this.x + this.width / 2 + eyeOffsetX + 4, eyeOffsetY);
            ctx.stroke();
        }
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        
        if (this.emotionState === "happy" || this.emotionState === "excited") {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 - this.width * 0.15, this.y - this.height * 0.08);
            ctx.quadraticCurveTo(
                this.x + this.width / 2, 
                this.y - this.height * 0.02 + Math.sin(this.frame / 2) * 2,
                this.x + this.width / 2 + this.width * 0.15, 
                this.y - this.height * 0.08
            );
            ctx.stroke();
            
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.rect(this.x + this.width / 2 - this.width * 0.1, this.y - this.height * 0.07, this.width * 0.2, 3);
            ctx.fill();
        } else if (this.emotionState === "surprised") {
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y - this.height * 0.07, 5, 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.emotionState === "thinking") {
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 - this.width * 0.1, this.y - this.height * 0.08);
        ctx.quadraticCurveTo(
            this.x + this.width / 2, 
                this.y - this.height * 0.09,
            this.x + this.width / 2 + this.width * 0.1, 
            this.y - this.height * 0.08
        );
        ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 - this.width * 0.1, this.y - this.height * 0.08);
            ctx.quadraticCurveTo(
                this.x + this.width / 2, 
                this.y - this.height * 0.06 + Math.sin(this.frame / 2) * 1,
                this.x + this.width / 2 + this.width * 0.1, 
                this.y - this.height * 0.08
            );
            ctx.stroke();
        }
        
        ctx.fillStyle = '#4169E1';
        
        // Left leg
        ctx.save();
        const leftKneeX = this.x + this.width * 0.3;
        const leftKneeY = this.y + this.height * 0.8 + walkCycle * 3;
        
        ctx.fillRect(
            this.x + this.width * 0.25, 
            this.y + this.height * 0.6, 
            this.width * 0.2, 
            leftKneeY - (this.y + this.height * 0.6)
        );
        
        ctx.translate(leftKneeX, leftKneeY);
        ctx.rotate(walkCycle * 0.2);
        ctx.fillRect(
            -this.width * 0.1,
            0,
            this.width * 0.2,
            this.height * 0.25 - walkCycle * 3
        );
        ctx.restore();
        
        // Right leg
        ctx.save();
        const rightKneeX = this.x + this.width * 0.7;
        const rightKneeY = this.y + this.height * 0.8 - walkCycle * 3;
        
        ctx.fillRect(
            this.x + this.width * 0.55, 
            this.y + this.height * 0.6, 
            this.width * 0.2, 
            rightKneeY - (this.y + this.height * 0.6)
        );
        
        ctx.translate(rightKneeX, rightKneeY);
        ctx.rotate(-walkCycle * 0.2);
        ctx.fillRect(
            -this.width * 0.1,
            0,
            this.width * 0.2,
            this.height * 0.25 + walkCycle * 3
        );
        ctx.restore();
        
        ctx.fillStyle = '#000000';
        
        // Left shoe
        ctx.save();
        ctx.translate(leftKneeX, this.y + this.height * 0.95 + walkCycle * 3);
        ctx.rotate(walkCycle * 0.1);
        ctx.fillRect(-this.width * 0.12, 0, this.width * 0.24, this.height * 0.05);
        ctx.beginPath();
        ctx.moveTo(-this.width * 0.12, this.height * 0.05);
        ctx.quadraticCurveTo(-this.width * 0.15, this.height * 0.05, -this.width * 0.18, this.height * 0.02);
        ctx.lineTo(-this.width * 0.18, 0);
        ctx.lineTo(-this.width * 0.12, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        // Right shoe
        ctx.save();
        ctx.translate(rightKneeX, this.y + this.height * 0.95 - walkCycle * 3);
        ctx.rotate(-walkCycle * 0.1);
        ctx.fillRect(-this.width * 0.12, 0, this.width * 0.24, this.height * 0.05);
        ctx.beginPath();
        ctx.moveTo(-this.width * 0.12, this.height * 0.05);
        ctx.quadraticCurveTo(-this.width * 0.15, this.height * 0.05, -this.width * 0.18, this.height * 0.02);
        ctx.lineTo(-this.width * 0.18, 0);
        ctx.lineTo(-this.width * 0.12, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        ctx.fillStyle = '#FFFFFF';
        const armSwing = walkCycle * 25;
        
        // Left arm
        ctx.save();
        ctx.translate(this.x + this.width * 0.2, this.y + this.height * 0.15);
        ctx.rotate((armSwing + 20) * Math.PI / 180);
        ctx.fillRect(0, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.translate(this.width * 0.15, this.height * 0.2);
        ctx.rotate((-armSwing - 40) * Math.PI / 180);
        ctx.fillRect(0, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.fillStyle = '#FFD8C0';
        ctx.translate(this.width * 0.15, this.height * 0.2);
        ctx.beginPath();
        ctx.arc(0, 0, this.width * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Right arm
        ctx.save();
        ctx.translate(this.x + this.width * 0.8, this.y + this.height * 0.15);
        ctx.rotate((-armSwing - 20) * Math.PI / 180);
        ctx.fillRect(-this.width * 0.15, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.translate(-this.width * 0.15, this.height * 0.2);
        ctx.rotate((armSwing + 40) * Math.PI / 180);
        ctx.fillRect(-this.width * 0.15, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.fillStyle = '#FFD8C0';
        ctx.translate(-this.width * 0.15, this.height * 0.2);
        ctx.beginPath();
        ctx.arc(0, 0, this.width * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        if (this.holding) {
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(
            this.x + this.width + armSwing/2, 
            this.y + this.height * 0.4, 
            this.width * 0.4, 
            this.height * 0.5
        );
            
            ctx.fillStyle = '#606060';
            ctx.fillRect(
                this.x + this.width * 1.15 + armSwing/2, 
                this.y + this.height * 0.3, 
                this.width * 0.1, 
                this.height * 0.1
            );
            
            ctx.fillStyle = '#808080';
            ctx.fillRect(
                this.x + this.width * 1.05 + armSwing/2, 
                this.y + this.height * 0.6, 
                this.width * 0.3, 
                this.height * 0.03
            );
            
            ctx.fillRect(
                this.x + this.width * 1.05 + armSwing/2, 
                this.y + this.height * 0.7, 
                this.width * 0.3, 
                this.height * 0.03
            );
            
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width * 1.1 + armSwing/2, 
                this.y + this.height * 0.9, 
                this.width * 0.05, 
                0, 
                Math.PI * 2
            );
            ctx.arc(
                this.x + this.width * 1.3 + armSwing/2, 
                this.y + this.height * 0.9, 
                this.width * 0.05, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
        }
    }
    
    drawTraveler2(ctx) {
        const walkCycle = Math.sin(this.frame / 2) * (this.moving ? 1 : 0.2);
        this.drawShadow(ctx);
        
        ctx.fillStyle = '#40E0D0';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.6);
        ctx.lineTo(this.x, this.y + this.height * 0.6);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#30C0B0';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.4, this.y);
        ctx.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.1);
        ctx.lineTo(this.x + this.width * 0.6, this.y);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#FFD8C0';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - this.height * 0.15, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.2, this.y - this.height * 0.15);
        ctx.bezierCurveTo(
            this.x + this.width * 0.2, this.y - this.height * 0.45,
            this.x + this.width * 0.8, this.y - this.height * 0.45,
            this.x + this.width * 0.8, this.y - this.height * 0.15
        );
        ctx.lineTo(this.x + this.width * 0.8, this.y - this.height * 0.05);
        ctx.lineTo(this.x + this.width * 0.2, this.y - this.height * 0.05);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#404040';
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            const startX = this.x + this.width * (0.3 + i * 0.05);
        ctx.beginPath();
            ctx.moveTo(startX, this.y - this.height * 0.05);
            ctx.bezierCurveTo(
                startX - 5, this.y - this.height * 0.15,
                startX + 5, this.y - this.height * 0.25,
                startX, this.y - this.height * 0.35
            );
        ctx.stroke();
        }
        
        const eyeOffsetX = this.width * 0.15;
        const eyeOffsetY = this.y - this.height * 0.17;
        
        if (!this.isBlinking) {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1.5;
        
        ctx.beginPath();
            ctx.ellipse(
                this.x + this.width / 2 - eyeOffsetX, 
                eyeOffsetY, 
                this.width * 0.12, 
                this.width * 0.09, 
                0, 
                0, 
                Math.PI * 2
            );
        ctx.stroke();
        
        ctx.beginPath();
            ctx.ellipse(
                this.x + this.width / 2 + eyeOffsetX, 
                eyeOffsetY, 
                this.width * 0.12, 
                this.width * 0.09, 
                0, 
                0, 
                Math.PI * 2
            );
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 - eyeOffsetX + this.width * 0.1, eyeOffsetY);
            ctx.lineTo(this.x + this.width / 2 + eyeOffsetX - this.width * 0.1, eyeOffsetY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 - eyeOffsetX - this.width * 0.12, eyeOffsetY);
            ctx.lineTo(this.x + this.width * 0.15, eyeOffsetY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 + eyeOffsetX + this.width * 0.12, eyeOffsetY);
            ctx.lineTo(this.x + this.width * 0.85, eyeOffsetY);
            ctx.stroke();
            
            const pupilOffsetX = (this.facingRight ? 2 : -2);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 - eyeOffsetX, eyeOffsetY, this.width * 0.06, 0, Math.PI * 2);
            ctx.arc(this.x + this.width / 2 + eyeOffsetX, eyeOffsetY, this.width * 0.06, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#4682B4';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2 - eyeOffsetX + pupilOffsetX, 
                eyeOffsetY, 
                this.width * 0.04, 
                0, 
                Math.PI * 2
            );
            ctx.arc(
                this.x + this.width / 2 + eyeOffsetX + pupilOffsetX, 
                eyeOffsetY, 
                this.width * 0.04, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
            
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2 - eyeOffsetX + pupilOffsetX, 
                eyeOffsetY, 
                this.width * 0.02, 
                0, 
                Math.PI * 2
            );
            ctx.arc(
                this.x + this.width / 2 + eyeOffsetX + pupilOffsetX, 
                eyeOffsetY, 
                this.width * 0.02, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
            
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2 - eyeOffsetX + pupilOffsetX + 2, 
                eyeOffsetY - 2, 
                this.width * 0.01, 
                0, 
                Math.PI * 2
            );
            ctx.arc(
                this.x + this.width / 2 + eyeOffsetX + pupilOffsetX + 2, 
                eyeOffsetY - 2, 
                this.width * 0.01, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
        } else {
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 - eyeOffsetX - this.width * 0.12, eyeOffsetY);
            ctx.bezierCurveTo(
                this.x + this.width / 2 - eyeOffsetX, eyeOffsetY + 3,
                this.x + this.width / 2 + eyeOffsetX, eyeOffsetY + 3,
                this.x + this.width / 2 + eyeOffsetX + this.width * 0.12, eyeOffsetY
            );
            ctx.stroke();
        }
        
        const mouthY = this.y - this.height * 0.05 + Math.sin(this.frame/10) * 0.5;
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2, 
            mouthY,
            this.width * 0.1,
            this.emotion === 'happy' ? Math.PI * 0.2 : Math.PI * 0.1,
            this.emotion === 'happy' ? Math.PI * 0.8 : Math.PI * 0.9
        );
        ctx.stroke();
        
        ctx.strokeStyle = '#FFD8C0';
        ctx.lineWidth = this.width * 0.1;
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.8, this.y + this.height * 0.1);
        ctx.quadraticCurveTo(
            this.x + this.width * 0.9 + walkCycle * 2, 
            this.y - this.height * 0.2 + Math.abs(walkCycle) * 5,
            this.x + this.width * 0.9, 
            this.y + this.height * 0.3
        );
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.2, this.y + this.height * 0.1);
        ctx.quadraticCurveTo(
            this.x + this.width * 0.1 - walkCycle * 2, 
            this.y - this.height * 0.2 + Math.abs(walkCycle) * 5,
            this.x + this.width * 0.1, 
            this.y + this.height * 0.3
        );
        ctx.stroke();
        
        ctx.strokeStyle = '#1E90FF';
        ctx.lineWidth = this.width * 0.12;
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.7, this.y + this.height * 0.6);
        ctx.lineTo(
            this.x + this.width * 0.7 + walkCycle * 3,
            this.y + this.height * 0.9 - Math.abs(walkCycle) * 2
        );
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.3, this.y + this.height * 0.6);
        ctx.lineTo(
            this.x + this.width * 0.3 - walkCycle * 3,
            this.y + this.height * 0.9 + Math.abs(walkCycle) * 2
        );
        ctx.stroke();
        
        ctx.strokeStyle = '#A0522D';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.3, this.y + this.height * 0.3);
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height * 0.3);
        ctx.stroke();
        
        this.frame++;
    }

    drawAgent(ctx) {
        const walkCycle = Math.sin(this.frame / 2) * (this.moving ? 1 : 0.2);
        this.drawShadow(ctx);
        
        ctx.fillStyle = '#191970';
        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height * 0.6
        );
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.4, this.y);
        ctx.lineTo(this.x + this.width * 0.6, this.y);
        ctx.lineTo(this.x + this.width * 0.55, this.y + this.height * 0.4);
        ctx.lineTo(this.x + this.width * 0.45, this.y + this.height * 0.4);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.5, this.y);
        ctx.lineTo(this.x + this.width * 0.55, this.y + this.height * 0.05);
        ctx.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.4);
        ctx.lineTo(this.x + this.width * 0.45, this.y + this.height * 0.05);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#000080';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.4, this.y);
        ctx.lineTo(this.x + this.width * 0.46, this.y + this.height * 0.18);
        ctx.lineTo(this.x + this.width * 0.46, this.y + this.height * 0.25);
        ctx.lineTo(this.x + this.width * 0.4, this.y + this.height * 0.23);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.6, this.y);
        ctx.lineTo(this.x + this.width * 0.54, this.y + this.height * 0.18);
        ctx.lineTo(this.x + this.width * 0.54, this.y + this.height * 0.25);
        ctx.lineTo(this.x + this.width * 0.6, this.y + this.height * 0.23);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#FFD8C0';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - this.height * 0.15, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#4B3621';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y - this.height * 0.18, this.width / 2 - 2, 0, Math.PI, true);
        ctx.fill();
        
        ctx.strokeStyle = '#3B2611';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            const hairX = this.x + this.width * 0.3 + (i * this.width * 0.04);
        ctx.beginPath();
            ctx.moveTo(hairX, this.y - this.height * 0.38);
            ctx.lineTo(hairX, this.y - this.height * 0.3);
            ctx.stroke();
        }
        
        const eyeOffsetX = this.width * 0.15;
        const eyeOffsetY = this.y - this.height * 0.17;
        
        if (!this.isBlinking) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 - eyeOffsetX, eyeOffsetY, 4, 0, Math.PI * 2);
            ctx.arc(this.x + this.width / 2 + eyeOffsetX, eyeOffsetY, 4, 0, Math.PI * 2);
        ctx.fill();
        
            ctx.fillStyle = '#4B3621';
        ctx.beginPath();
            ctx.arc(this.x + this.width / 2 - eyeOffsetX + (this.facingRight ? 1 : -1), eyeOffsetY, 2, 0, Math.PI * 2);
            ctx.arc(this.x + this.width / 2 + eyeOffsetX + (this.facingRight ? 1 : -1), eyeOffsetY, 2, 0, Math.PI * 2);
        ctx.fill();
        
            ctx.strokeStyle = '#4B3621';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 - eyeOffsetX - 5, eyeOffsetY - 6);
            ctx.lineTo(this.x + this.width / 2 - eyeOffsetX + 5, eyeOffsetY - 6);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 + eyeOffsetX - 5, eyeOffsetY - 6);
            ctx.lineTo(this.x + this.width / 2 + eyeOffsetX + 5, eyeOffsetY - 6);
            ctx.stroke();
        } else {
            ctx.strokeStyle = '#4B3621';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 - eyeOffsetX - 4, eyeOffsetY);
            ctx.lineTo(this.x + this.width / 2 - eyeOffsetX + 4, eyeOffsetY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 + eyeOffsetX - 4, eyeOffsetY);
            ctx.lineTo(this.x + this.width / 2 + eyeOffsetX + 4, eyeOffsetY);
            ctx.stroke();
        }
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 - this.width * 0.1, this.y - this.height * 0.08);
        ctx.quadraticCurveTo(
            this.x + this.width / 2, 
            this.y - this.height * 0.06 + Math.sin(this.frame / 2) * 1,
            this.x + this.width / 2 + this.width * 0.1, 
            this.y - this.height * 0.08
        );
        ctx.stroke();
        
        ctx.fillStyle = '#191970';
        
        ctx.save();
        const leftKneeX = this.x + this.width * 0.3;
        const leftKneeY = this.y + this.height * 0.8 + walkCycle * 3;
        
        ctx.fillRect(
            this.x + this.width * 0.25, 
            this.y + this.height * 0.6, 
            this.width * 0.2, 
            leftKneeY - (this.y + this.height * 0.6)
        );
        
        ctx.translate(leftKneeX, leftKneeY);
        ctx.rotate(walkCycle * 0.2);
        ctx.fillRect(
            -this.width * 0.1,
            0,
            this.width * 0.2,
            this.height * 0.25 - walkCycle * 3
        );
        ctx.restore();
        
        ctx.save();
        const rightKneeX = this.x + this.width * 0.7;
        const rightKneeY = this.y + this.height * 0.8 - walkCycle * 3;
        
        ctx.fillRect(
            this.x + this.width * 0.55, 
            this.y + this.height * 0.6, 
            this.width * 0.2, 
            rightKneeY - (this.y + this.height * 0.6)
        );
        
        ctx.translate(rightKneeX, rightKneeY);
        ctx.rotate(-walkCycle * 0.2);
        ctx.fillRect(
            -this.width * 0.1,
            0,
            this.width * 0.2,
            this.height * 0.25 + walkCycle * 3
        );
        ctx.restore();
        
        ctx.fillStyle = '#000000';
        
        ctx.save();
        ctx.translate(leftKneeX, this.y + this.height * 0.95 + walkCycle * 3);
        ctx.rotate(walkCycle * 0.1);
        ctx.fillRect(-this.width * 0.12, 0, this.width * 0.24, this.height * 0.05);
        ctx.beginPath();
        ctx.moveTo(-this.width * 0.12, this.height * 0.05);
        ctx.quadraticCurveTo(-this.width * 0.15, this.height * 0.05, -this.width * 0.18, this.height * 0.02);
        ctx.lineTo(-this.width * 0.18, 0);
        ctx.lineTo(-this.width * 0.12, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(rightKneeX, this.y + this.height * 0.95 - walkCycle * 3);
        ctx.rotate(-walkCycle * 0.1);
        ctx.fillRect(-this.width * 0.12, 0, this.width * 0.24, this.height * 0.05);
        ctx.beginPath();
        ctx.moveTo(-this.width * 0.12, this.height * 0.05);
        ctx.quadraticCurveTo(-this.width * 0.15, this.height * 0.05, -this.width * 0.18, this.height * 0.02);
        ctx.lineTo(-this.width * 0.18, 0);
        ctx.lineTo(-this.width * 0.12, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        ctx.fillStyle = '#191970';
        const armSwing = walkCycle * 25;
        
        ctx.save();
        ctx.translate(this.x + this.width * 0.2, this.y + this.height * 0.15);
        ctx.rotate((armSwing + 20) * Math.PI / 180);
        ctx.fillRect(0, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.translate(this.width * 0.15, this.height * 0.2);
        ctx.rotate((-armSwing - 40) * Math.PI / 180);
        ctx.fillRect(0, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.fillStyle = '#FFD8C0';
        ctx.translate(this.width * 0.15, this.height * 0.2);
        ctx.beginPath();
        ctx.arc(0, 0, this.width * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x + this.width * 0.8, this.y + this.height * 0.15);
        ctx.rotate((-armSwing - 20) * Math.PI / 180);
        ctx.fillRect(-this.width * 0.15, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.translate(-this.width * 0.15, this.height * 0.2);
        ctx.rotate((armSwing + 40) * Math.PI / 180);
        ctx.fillRect(-this.width * 0.15, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.fillStyle = '#FFD8C0';
        ctx.translate(-this.width * 0.15, this.height * 0.2);
        ctx.beginPath();
        ctx.arc(0, 0, this.width * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.fillStyle = '#2F4F4F';
            ctx.fillRect(
            this.x + this.width * 0.7,
                this.y + this.height * 0.4, 
            this.width * 0.3,
            this.height * 0.25
        );
        
        ctx.strokeStyle = '#708090';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.x + this.width * 0.72,
            this.y + this.height * 0.42,
            this.width * 0.26,
            this.height * 0.21
        );
        
            ctx.beginPath();
        ctx.arc(
            this.x + this.width * 0.85,
            this.y + this.height * 0.38,
            this.width * 0.04,
            0,
            Math.PI
        );
        ctx.stroke();
        
        ctx.fillStyle = '#DAA520';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width * 0.75,
            this.y + this.height * 0.45,
            this.width * 0.015,
            0,
            Math.PI * 2
        );
        ctx.arc(
            this.x + this.width * 0.95,
            this.y + this.height * 0.45,
            this.width * 0.015,
            0,
            Math.PI * 2
        );
            ctx.fill();
        
        this.frame++;
    }

    drawFlightAttendant(ctx) {
        const walkCycle = Math.sin(this.frame / 2) * (this.moving ? 1 : 0.2);
        this.drawShadow(ctx);
        
        ctx.fillStyle = '#4682B4';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(
            this.x + this.width * 0.3, this.y - this.height * 0.1,
            this.x + this.width * 0.7, this.y - this.height * 0.1,
            this.x + this.width, this.y
        );
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.6);
        ctx.lineTo(this.x, this.y + this.height * 0.6);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
            this.x,
            this.y + this.height * 0.3,
            this.width,
            this.height * 0.05
        );
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.4, this.y + this.height * 0.1);
        ctx.quadraticCurveTo(
            this.x + this.width * 0.5, this.y + this.height * 0.05,
            this.x + this.width * 0.6, this.y + this.height * 0.1
        );
        ctx.lineTo(this.x + this.width * 0.55, this.y + this.height * 0.25);
        ctx.lineTo(this.x + this.width * 0.45, this.y + this.height * 0.25);
        ctx.closePath();
        ctx.fill();
        
        this.drawCommonHeadFeatures(ctx);
        
        ctx.fillStyle = '#4682B4';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y - this.height * 0.25,
            this.width * 0.3,
            Math.PI,
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y - this.height * 0.25,
            this.width * 0.25,
            Math.PI,
            Math.PI * 2
        );
        ctx.fill();
        
        this.drawArticulatedArms(ctx, walkCycle);
        
        if(this.holding) {
            ctx.fillStyle = '#D3D3D3';
            ctx.fillRect(
                this.x + this.width * 0.8,
                this.y + this.height * 0.5,
                this.width * 0.4,
                this.height * 0.3
            );
            
            ctx.fillStyle = '#808080';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width * 0.85,
                this.y + this.height * 0.8,
                this.width * 0.05,
                0,
                Math.PI * 2
            );
            ctx.arc(
                this.x + this.width * 1.15,
                this.y + this.height * 0.8,
                this.width * 0.05,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(
                this.x + this.width * 0.9,
                this.y + this.height * 0.55,
                this.width * 0.1,
                this.height * 0.2
            );
        }
        
        this.frame++;
    }

    drawLocalGuide(ctx) {
        const walkCycle = Math.sin(this.frame / 2) * (this.moving ? 1 : 0.2);
        this.drawShadow(ctx);
        
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height * 0.6
        );
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
                ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.1, this.y + this.height * 0.1);
        ctx.bezierCurveTo(
            this.x + this.width * 0.3, this.y,
            this.x + this.width * 0.7, this.y,
            this.x + this.width * 0.9, this.y + this.height * 0.1
        );
                ctx.stroke();
                
        for(let i = 0; i < 5; i++) {
                ctx.beginPath();
            ctx.arc(
                this.x + this.width * (0.2 + i * 0.15),
                this.y + this.height * 0.3,
                this.width * 0.03,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        }
        
        this.drawCommonHeadFeatures(ctx);
        
        ctx.fillStyle = '#FFD700';
                ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.3, this.y - this.height * 0.25);
        ctx.lineTo(this.x + this.width * 0.7, this.y - this.height * 0.25);
        ctx.lineTo(this.x + this.width * 0.65, this.y - this.height * 0.4);
        ctx.lineTo(this.x + this.width * 0.35, this.y - this.height * 0.4);
        ctx.closePath();
                ctx.fill();
                
        this.drawArticulatedArms(ctx, walkCycle);
        
        ctx.fillStyle = '#4B0082';
                ctx.beginPath();
        ctx.arc(
            this.x + this.width * 0.5,
            this.y + this.height * 0.4,
            this.width * 0.1,
            0,
            Math.PI * 2
        );
                ctx.fill();
        
        this.frame++;
    }

    drawCommonHeadFeatures(ctx) {
        ctx.fillStyle = '#FFD8C0';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y - this.height * 0.15,
            this.width / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.fillStyle = '#2F4F4F';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y - this.height * 0.2,
            this.width * 0.4,
            Math.PI,
            Math.PI * 2
        );
        ctx.fill();
        
        this.drawEyes(ctx);
        this.drawMouth(ctx);
    }

    drawEyes(ctx) {
        const eyeOffsetX = this.width * 0.15;
        const eyeOffsetY = this.y - this.height * 0.17;

        if(!this.isBlinking) {
            ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2 - eyeOffsetX,
                eyeOffsetY,
                this.width * 0.06,
                0,
                Math.PI * 2
            );
            ctx.arc(
                this.x + this.width / 2 + eyeOffsetX,
                eyeOffsetY,
                this.width * 0.06,
                0,
                Math.PI * 2
            );
                ctx.fill();
            
            ctx.fillStyle = '#4682B4';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2 - eyeOffsetX + (this.facingRight ? 2 : -2),
                eyeOffsetY,
                this.width * 0.04,
                0,
                Math.PI * 2
            );
            ctx.arc(
                this.x + this.width / 2 + eyeOffsetX + (this.facingRight ? 2 : -2),
                eyeOffsetY,
                this.width * 0.04,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2 - eyeOffsetX + (this.facingRight ? 2 : -2),
                eyeOffsetY,
                this.width * 0.02,
                0,
                Math.PI * 2
            );
            ctx.arc(
                this.x + this.width / 2 + eyeOffsetX + (this.facingRight ? 2 : -2),
                eyeOffsetY,
                this.width * 0.02,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            for(let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(
                    this.x + this.width / 2 - eyeOffsetX - this.width * 0.03 + i * this.width * 0.015,
                    eyeOffsetY - this.width * 0.04
                );
                ctx.lineTo(
                    this.x + this.width / 2 - eyeOffsetX - this.width * 0.03 + i * this.width * 0.015,
                    eyeOffsetY - this.width * 0.08
                );
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(
                    this.x + this.width / 2 + eyeOffsetX + this.width * 0.03 - i * this.width * 0.015,
                    eyeOffsetY - this.width * 0.04
                );
                ctx.lineTo(
                    this.x + this.width / 2 + eyeOffsetX + this.width * 0.03 - i * this.width * 0.015,
                    eyeOffsetY - this.width * 0.08
                );
                ctx.stroke();
            }
        } else {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(
                this.x + this.width / 2 - eyeOffsetX - this.width * 0.05,
                eyeOffsetY
            );
            ctx.lineTo(
                this.x + this.width / 2 - eyeOffsetX + this.width * 0.05,
                eyeOffsetY
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(
                this.x + this.width / 2 + eyeOffsetX - this.width * 0.05,
                eyeOffsetY
            );
            ctx.lineTo(
                this.x + this.width / 2 + eyeOffsetX + this.width * 0.05,
                eyeOffsetY
            );
            ctx.stroke();
        }
    }

    drawMouth(ctx) {
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 1.5;

        switch(this.emotionState) {
            case 'happy':
                ctx.beginPath();
                ctx.arc(
                    this.x + this.width / 2,
                    this.y - this.height * 0.08,
                    this.width * 0.1,
                    Math.PI * 0.2,
                    Math.PI * 0.8
                );
                ctx.stroke();
                break;

            case 'surprised':
                ctx.beginPath();
                ctx.arc(
                    this.x + this.width / 2,
                    this.y - this.height * 0.06,
                    this.width * 0.06,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
                break;

            case 'thinking':
                ctx.beginPath();
                ctx.moveTo(
                    this.x + this.width / 2 - this.width * 0.1,
                    this.y - this.height * 0.08
                );
                ctx.quadraticCurveTo(
                    this.x + this.width / 2,
                    this.y - this.height * 0.12,
                    this.x + this.width / 2 + this.width * 0.1,
                    this.y - this.height * 0.08
                );
                ctx.stroke();
                break;

            default:
                ctx.beginPath();
                ctx.moveTo(
                    this.x + this.width / 2 - this.width * 0.08,
                    this.y - this.height * 0.08
                );
                ctx.quadraticCurveTo(
                    this.x + this.width / 2,
                    this.y - this.height * 0.06,
                    this.x + this.width / 2 + this.width * 0.08,
                    this.y - this.height * 0.08
                );
                ctx.stroke();
        }
    }

    drawArticulatedArms(ctx, walkCycle) {
        ctx.fillStyle = this.type === 'flightAttendant' ? '#4682B4' : '#8B0000';
        
        ctx.save();
        ctx.translate(this.x + this.width * 0.2, this.y + this.height * 0.15);
        ctx.rotate((walkCycle * 25 + 20) * Math.PI / 180);
        ctx.fillRect(0, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.translate(this.width * 0.15, this.height * 0.2);
        ctx.rotate((-walkCycle * 25 - 40) * Math.PI / 180);
        ctx.fillRect(0, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.fillStyle = '#FFD8C0';
                ctx.beginPath();
        ctx.arc(
            this.width * 0.15,
            this.height * 0.2,
            this.width * 0.08,
            0,
            Math.PI * 2
        );
                ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.x + this.width * 0.8, this.y + this.height * 0.15);
        ctx.rotate((-walkCycle * 25 - 20) * Math.PI / 180);
        ctx.fillRect(-this.width * 0.15, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.translate(-this.width * 0.15, this.height * 0.2);
        ctx.rotate((walkCycle * 25 + 40) * Math.PI / 180);
        ctx.fillRect(-this.width * 0.15, 0, this.width * 0.15, this.height * 0.2);
        
        ctx.fillStyle = '#FFD8C0';
        ctx.beginPath();
        ctx.arc(
            -this.width * 0.15,
            this.height * 0.2,
            this.width * 0.08,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
    }

    drawMessageBubble(ctx, text) {
        const bubbleX = this.x + this.width / 2;
        const bubbleY = this.y - this.height * 0.4;
        const maxWidth = 150;
        const lineHeight = 20;
        const padding = 10;
        
                ctx.font = '14px Arial';
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for(let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if(width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);

        const bubbleWidth = Math.min(
            Math.max(...lines.map(line => ctx.measureText(line).width)) + padding * 2,
            maxWidth + padding * 2
        );
        const bubbleHeight = lines.length * lineHeight + padding * 2;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(
            bubbleX - bubbleWidth / 2,
            bubbleY - bubbleHeight,
            bubbleWidth,
            bubbleHeight,
            10
        );
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(bubbleX, bubbleY);
        ctx.lineTo(bubbleX + 10, bubbleY + 10);
        ctx.lineTo(bubbleX - 10, bubbleY + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        lines.forEach((line, index) => {
            ctx.fillText(
                line,
                bubbleX,
                bubbleY - bubbleHeight + padding + (index + 1) * lineHeight
            );
        });
    }

    drawShadow(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height * 0.9,
            this.width * 0.4,
            this.height * 0.1,
            0,
            0,
            Math.PI * 2
        );
                    ctx.fill();
    }
}

// Animation loop and scene management
function startAnimation() {
    startTime = Date.now();
    animate();
}

function animate() {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw all scene elements
    scenes.forEach(scene => {
        // Scene transition logic here
    });

    if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
});

// Start the animation
assets.load({
    // Add your image assets here
}, startAnimation);