export class MagicParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
    alpha: number;

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.size = Math.random() * 3 + 1;
        this.color = color;
        this.life = 1.0;
        this.alpha = 1.0;
    }

    update(targetX?: number, targetY?: number) {
        if (targetX !== undefined && targetY !== undefined) {
            // Convergence Force
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 5) {
                this.vx += (dx / dist) * 0.8;
                this.vy += (dy / dist) * 0.8;
            }

            // Friction
            this.vx *= 0.92;
            this.vy *= 0.92;
        } else {
            // Wander mode
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.life -= 0.02;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.alpha = Math.max(0, this.life);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

export class ParticleSystem {
    particles: MagicParticle[] = [];
    ctx: CanvasRenderingContext2D;
    colors = ["#00F2FF", "#B066FE", "#FFFFFF"];

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    spawn(x: number, y: number, amount: number = 1) {
        for (let i = 0; i < amount; i++) {
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            // Spawn randomly around the point
            const sx = x + (Math.random() - 0.5) * 100;
            const sy = y + (Math.random() - 0.5) * 100;
            this.particles.push(new MagicParticle(sx, sy, color));
        }

        // Limit particles
        if (this.particles.length > 300) {
            this.particles.splice(0, this.particles.length - 300);
        }
    }

    update(targetX?: number, targetY?: number) {
        this.particles.forEach((p, index) => {
            p.update(targetX, targetY);
            if (p.alpha <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.globalCompositeOperation = 'lighter';
        this.particles.forEach(p => p.draw(this.ctx));
    }
}
