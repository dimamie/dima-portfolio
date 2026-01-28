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

    const padding = 40;
    const chartWidth = this.width - padding * 2;
    const pointSpacing = chartWidth / (this.data.length - 1);

    // Find closest data point
    const index = Math.round((x - padding) / pointSpacing);

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
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2 - priceAreaHeight;
    const chartTop = padding + priceAreaHeight;

    // Find min and max prices for scaling
    const prices = this.data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Calculate points
    const points = this.data.map((d, i) => {
      const x = padding + (i / (this.data.length - 1)) * chartWidth;
      const y = chartTop + chartHeight - ((d.price - minPrice) / priceRange) * chartHeight;
      return { x, y, price: d.price, date: d.date };
    });

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, chartTop, 0, height - padding);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.15)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach((point, i) => {
      if (i === 0) {
        ctx.lineTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
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
      ctx.fillText(dateStr, point.x, height - padding + 20);
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
    ctx.textAlign = 'left';
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillStyle = '#111114';
    ctx.fillText(`${displayPrice.toFixed(2)}`, priceX, padding + 5);

    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = changePercent >= 0 ? '#22c55e' : '#ef4444';
    const changeText = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`;
    ctx.fillText(changeText, priceX, padding + 22);

    ctx.fillStyle = '#9a9aa3';
    ctx.fillText('USD', priceX + ctx.measureText(`${displayPrice.toFixed(2)}`).width + 4, padding + 5);

    // Draw hover line and tooltip
    if (this.hoveredIndex !== null) {
      const point = points[this.hoveredIndex];

      // Draw vertical line
      ctx.beginPath();
      ctx.moveTo(point.x, chartTop);
      ctx.lineTo(point.x, height - padding);
      ctx.strokeStyle = 'rgba(17, 17, 20, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

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
}

// Initialize chart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PriceChart('price-chart-canvas');
});
