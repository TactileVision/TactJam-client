
/* sample code for actuator graphs */
let timeProfile = d3.select('#time-profile');


/* class for a plot */
let plot = (id, x, y, width, height, color) => {
    let xScale = d3.scaleLinear()
        .domain([0, 19])//.nice()
        .range([x, x+width]);

    let yScale = d3.scaleLinear()
        .domain([0, 1])//.nice()
        .range([y, y-height/2]);

    let line, area; // path object to update when on new data received
    let svgElements = null;

    let label = timeProfile.append('text').text(id+'.').classed('plot-label', true)
                                    .attr('x', x-10).attr('y', y+5);
    let default_line = timeProfile.append('line').classed('default-line', true).attr('stroke', color)
        .attr('x1', x).attr('y1', y).attr('x2', x+width).attr('y2', y);

    return {
        updateData: (data) => {
            xScale.domain([0, data.length-1]);

            line = d3.path();
            area = d3.path();
            data.forEach((d, i) => {
                if(i === 0) {
                    line.moveTo(xScale(i), yScale(d));
                    area.moveTo(xScale(0), yScale(0));
                    area.lineTo(xScale(i), yScale(d));
                } else {
                    line.lineTo(xScale(i), yScale(d));
                    area.lineTo(xScale(i), yScale(d));
                }
            });
            area.lineTo(xScale.range()[1], yScale(0));
            area.closePath();

            if(svgElements !== null) {
                Object.keys(svgElements).forEach((d) => svgElements[d].remove());
            }
            svgElements = {};
            svgElements.group = timeProfile.append('g');
            // svgElements.axis = svgElements.group.append('line');
            svgElements.line = svgElements.group.append('path');
            svgElements.area = svgElements.group.append('path');

            // draw x axis + curve + filled area
            // svgElements.axis.attr('x1', x).attr('y1', y).attr('x2', x+width).attr('y2', y).attr('stroke', color).attr('stroke-width', '0.5px');
            svgElements.line.attr('d', line.toString()).attr('stroke', color).attr('fill', 'none');
            svgElements.area.attr('d', area.toString()).attr('stroke', '').attr('fill', color).attr('opacity', 0.2);

            // show the same elements reflected horizontally
            svgElements.clone = timeProfile.append(() => svgElements.group.node().cloneNode(true));
            const sx = 1, sy = -1; // reflect horizontally
            const tx = x-sx*x, ty = y-sy*y;
            svgElements.clone.attr('transform', 'matrix('+sx+', 0, 0, '+sy+', '+tx+', '+ty+')'); // reflect horizontally
        }
    };
};

// for debugging purpose, should remove at some point
let randData = (length) => {
    let data = [];
    for(let i = 0; i < length; i++) { data.push(Math.random()); }
    return data;
};


const w = 500, h = 40;
const colors = [ '#ab2056', '#5454ff', '#24ab24', '#9a9a9a', '#9a34ff', '#21abab','#ffff00', '#df8100' ]
let plots = [];
let y = 75, sy = h*1.75;
for(let i = 0; i < colors.length; i++) {
    plots.push(plot(i+1,75, y, w, h, colors[i]));
    y += sy;
}

setTimeout(() => { plots.forEach(p => p.updateData(randData(50))) }, 3000);


// text showing the duration of the tacton
let duration = timeProfile.append('text');
duration.classed('duration', true).attr('x', 575).attr('y', 610).text('Duration: 2s');