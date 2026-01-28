class PriceChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.hoveredIndex = null;
    this.data = this.generateMockData();

    this.init();
  }

  generateMockData() {
    const data = [];
    const basePrice = 200;
    const days = 60;
    let price = basePrice;

    // Generate dates for the past 60 days
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (days - i));

      // Random walk with slight upward bias
      const change = (Math.random() - 0.45) * 8;
      price += change;
      price = Math.max(150, Math.min(300, price)); // Keep within bounds

      data.push({
        date: date,
        price: price
      });
    }

    return data;
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());

    this.draw();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);

    this.width = rect.width;
    this.height = rect.height;

    this.draw();
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const leftPadding = 40;

    // Calculate right padding same as in draw()
    const ctx = this.ctx;
    ctx.font = '400 32px Inter, sans-serif';
    const samplePriceWidth = ctx.measureText('999.99').width;
    ctx.font = '12px Inter, sans-serif';
    const sampleUsdWidth = ctx.measureText('USD').width;
    const priceTextWidth = samplePriceWidth + 2 + sampleUsdWidth;
    const rightPadding = Math.max(80, priceTextWidth + 40); // Significantly more padding for centering

    const chartWidth = this.width - leftPadding - rightPadding;
    const pointSpacing = chartWidth / (this.data.length - 1);

    // Find closest data point
    const index = Math.round((x - leftPadding) / pointSpacing);

    if (index >= 0 && index < this.data.length) {
      this.hoveredIndex = index;
      this.draw();
    }
  }

  handleMouseLeave() {
    this.hoveredIndex = null;
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Reserve space at top for price display
    const priceAreaHeight = 50;
    const verticalPadding = 40;
    const leftPadding = 40;

    // Calculate right padding to accommodate centered price text at the rightmost point
    // Measure the approximate width of price + USD text
    ctx.font = '400 32px Inter, sans-serif';
    const samplePriceWidth = ctx.measureText('999.99').width;
    ctx.font = '12px Inter, sans-serif';
    const sampleUsdWidth = ctx.measureText('USD').width;
    const priceTextWidth = samplePriceWidth + 2 + sampleUsdWidth;
    const rightPadding = Math.max(80, priceTextWidth + 40); // Significantly more padding for centering

    const chartWidth = width - leftPadding - rightPadding;
    const chartHeight = height - verticalPadding * 2 - priceAreaHeight;
    const chartTop = verticalPadding + priceAreaHeight;

    // Find min and max prices for scaling
    const prices = this.data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Calculate points
    const points = this.data.map((d, i) => {
      const x = leftPadding + (i / (this.data.length - 1)) * chartWidth;
      const y = chartTop + chartHeight - ((d.price - minPrice) / priceRange) * chartHeight;
      return { x, y, price: d.price, date: d.date };
    });

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, chartTop, 0, height - verticalPadding);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.15)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

    // Helper to get control points for smooth cubic bezier
    const getControlPoints = (p0, p1, p2, t = 0.2) => {
      const d1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
      const d2 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      const fa = t * d1 / (d1 + d2);
      const fb = t * d2 / (d1 + d2);
      const p1x = p1.x - fa * (p2.x - p0.x);
      const p1y = p1.y - fa * (p2.y - p0.y);
      const p2x = p1.x + fb * (p2.x - p0.x);
      const p2y = p1.y + fb * (p2.y - p0.y);
      return { cp1: { x: p1x, y: p1y }, cp2: { x: p2x, y: p2y } };
    };

    // Draw smooth curve path
    const drawSmoothPath = (ctx, pts, isFill = false) => {
      if (pts.length < 2) return;

      ctx.beginPath();
      if (isFill) {
        ctx.moveTo(pts[0].x, height - verticalPadding);
        ctx.lineTo(pts[0].x, pts[0].y);
      } else {
        ctx.moveTo(pts[0].x, pts[0].y);
      }

      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? 0 : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2 >= pts.length ? pts.length - 1 : i + 2];

        const cp1 = getControlPoints(p0, p1, p2).cp2;
        const cp2 = getControlPoints(p1, p2, p3).cp1;

        if (isNaN(cp1.x) || isNaN(cp1.y) || isNaN(cp2.x) || isNaN(cp2.y)) {
          ctx.lineTo(p2.x, p2.y);
        } else {
          ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
        }
      }

      if (isFill) {
        ctx.lineTo(pts[pts.length - 1].x, height - verticalPadding);
        ctx.closePath();
      }
    };

    // Draw gradient fill
    drawSmoothPath(ctx, points, true);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line with smoothing
    drawSmoothPath(ctx, points, false);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw date labels (show 3 dates)
    ctx.fillStyle = '#9a9aa3';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';

    const labelIndices = [0, Math.floor(this.data.length / 2), this.data.length - 1];
    labelIndices.forEach(i => {
      const point = points[i];
      const date = this.data[i].date;
      const dateStr = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;
      ctx.fillText(dateStr, point.x, height - verticalPadding + 20);
    });

    // Draw price at top - positioned at hovered point's x or at the end
    const displayIndex = this.hoveredIndex !== null ? this.hoveredIndex : this.data.length - 1;
    const displayPrice = this.data[displayIndex].price;
    const firstPrice = this.data[0].price;
    const change = displayPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;

    // Get x position for price display
    const priceX = points[displayIndex].x;

    // Draw price and percentage at the top, following the hover position
    ctx.textAlign = 'center';

    // Draw price with letter spacing
    ctx.font = '400 32px Inter, sans-serif';
    ctx.letterSpacing = '-0.01em';
    ctx.fillStyle = '#111114';
    const priceText = `${displayPrice.toFixed(2)}`;
    const priceWidth = ctx.measureText(priceText).width;

    // Calculate centered position for price + USD combo
    ctx.font = '12px Inter, sans-serif';
    const usdWidth = ctx.measureText('USD').width;
    const totalWidth = priceWidth + 2 + usdWidth;

    // Constrain position to keep text within bounds (only left edge, right has enough padding)
    let constrainedX = priceX;
    const minX = leftPadding + (totalWidth / 2);
    constrainedX = Math.max(minX, constrainedX);

    const startX = constrainedX - (totalWidth / 2);

    // Draw price
    ctx.font = '600 24px Inter, sans-serif';
    ctx.letterSpacing = '-0.01em';
    ctx.fillStyle = '#111114';
    ctx.textAlign = 'left';
    ctx.fillText(priceText, startX, verticalPadding + 10);

    // Draw USD inline with 2px gap
    ctx.font = '12px Inter, sans-serif';
    ctx.letterSpacing = '0';
    ctx.fillStyle = '#9a9aa3';
    ctx.fillText('USD', startX + priceWidth + 2, verticalPadding + 10);

    // Draw percentage change below, centered
    ctx.textAlign = 'center';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = changePercent >= 0 ? '#22c55e' : '#ef4444';
    const changeText = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`;
    ctx.fillText(changeText, constrainedX, verticalPadding + 27);

    // Draw vertical line and tooltip (always visible)
    const point = points[displayIndex];

    // Draw vertical line
    ctx.beginPath();
    ctx.setLineDash([4, 4]); // Dotted line
    ctx.moveTo(point.x, chartTop);
    ctx.lineTo(point.x, height - verticalPadding);
    ctx.strokeStyle = 'rgba(17, 17, 20, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Draw circle at point
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Initialize chart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PriceChart('price-chart-canvas');
});
