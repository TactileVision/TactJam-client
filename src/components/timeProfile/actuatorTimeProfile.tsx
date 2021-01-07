import React from 'react';
// @ts-ignore
import * as d3 from 'd3';

interface PlotCharacteristics {
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    data: number[],
}


class ActuatorTimeProfile extends React.Component<PlotCharacteristics> {
    xScale = d3.scaleLinear();
    yScale = d3.scaleLinear();
    line: string = '';
    area: string = '';

    constructor(props: PlotCharacteristics) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.displayData = this.displayData.bind(this);

        this.xScale.domain([0, 19])//.nice()
            .range([props.x, props.x + props.width]);
        this.yScale.domain([0, 1])//.nice()
            .range([props.y, props.y - props.height / 2]);
    }

    // update the plot based on the input stream
    updateData() {
        const data = this.props.data;
        if(data === null || data.length === 0) return;

        this.xScale.domain([0, data.length-1]);

        let line = d3.path();
        let area = d3.path();
        data.forEach((d, i) => {
            if(i === 0) {
                line.moveTo(this.xScale(i), this.yScale(d));
                area.moveTo(this.xScale(0), this.yScale(0));
                area.lineTo(this.xScale(i), this.yScale(d));
            } else {
                line.lineTo(this.xScale(i), this.yScale(d));
                area.lineTo(this.xScale(i), this.yScale(d));
            }
        });
        area.lineTo(this.xScale.range()[1], this.yScale(0));
        area.closePath();

        this.line = line.toString();
        this.area = area.toString();
    }

    displayData() {
        if(this.line === null) { return; }
        else {
            const sx = 1, sy = -1; // reflect horizontally
            const tx = this.props.x - sx * this.props.x, ty = this.props.y - sy * this.props.y;
            return (
                <g>
                    <path d={this.line} stroke={this.props.color} fill="none"/>
                    <path d={this.area} stroke="none" fill={this.props.color} opacity={0.2}/>
                    <g transform={"matrix("+sx+", 0, 0, "+sy+","+tx+","+ty+")"}>
                        <path d={this.line} stroke={this.props.color} fill="none"/>
                        <path d={this.area} stroke="none" fill={this.props.color} opacity={0.2}/>
                    </g>
                </g>
            );
        }
    }

    render() {
        this.updateData();

        return (
            <g id={"plot-"+this.props.id}>
                <text className="plot-label" x={this.props.x-15} y={this.props.y+5}>{this.props.id}.</text>
                <line className="default-line" x1={this.props.x} y1={this.props.y} x2={this.props.x+this.props.width} y2={this.props.y} stroke={this.props.color}/>
                {this.displayData()}
            </g>
        )
    }
}


export default ActuatorTimeProfile;
