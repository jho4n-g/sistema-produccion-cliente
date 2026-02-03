// src/components/EchartsStackedAreaChart.jsx
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function EchartsStackedAreaChart({
  title = '',
  categories = [],
  series = [],
  height = 420,
  showToolbox = true,
  smooth = true,
}) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // 1) Init una sola vez
  useEffect(() => {
    if (!chartRef.current) return;
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const handleResize = () => chartInstanceRef.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  // 2) Update options
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    const option = {
      title: title
        ? {
            text: title,
            left: 'center',
            top: 10,
            textStyle: { fontSize: 18, fontWeight: 'bold' },
          }
        : undefined,

      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },

      legend: {
        data: series.map((s) => s.name),
        top: title ? 50 : 20,
      },

      toolbox: showToolbox
        ? {
            show: true,
            right: 20,
            top: 20,
            orient: 'vertical',
            feature: { saveAsImage: { show: true } },
          }
        : undefined,

      grid: {
        top: title ? 90 : 60,
        left: 55,
        right: 35,
        bottom: 45, // fijo, sin dataZoom
        containLabel: true,
      },

      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: categories,
          axisLabel: {
            interval: 0,
            rotate: categories.length > 12 ? 45 : 0,
            hideOverlap: true,
          },
        },
      ],

      yAxis: [{ type: 'value' }],

      series: series.map((s) => ({
        name: s.name,
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        smooth,
        emphasis: { focus: 'series' },
        symbol: 'none',
        data: s.data,
      })),
    };

    chartInstanceRef.current.setOption(option, true);
  }, [title, categories, series, height, showToolbox, smooth]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}
