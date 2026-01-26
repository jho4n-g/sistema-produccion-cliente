// src/components/EchartsStackedAreaChart.jsx
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function EchartsStackedAreaChart({
  title = '',
  categories = [], // e.g. ['01', '02', ..., '31'] o fechas
  series = [], // e.g. [{ name:'1ra', data:[...] }, { name:'2da', data:[...] }]
  height = 420,
  showToolbox = true,
  showDataZoom = true,
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
        axisPointer: {
          type: 'cross',
        },
        // opcional: formatear tooltip bonito
        // formatter: (params) => { ... }
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
        bottom: showDataZoom ? 55 : 45,
        containLabel: true,
      },

      dataZoom: showDataZoom
        ? [
            { type: 'inside', xAxisIndex: 0 },
            { type: 'slider', xAxisIndex: 0, height: 14, bottom: 6 },
          ]
        : undefined,

      xAxis: [
        {
          type: 'category',
          boundaryGap: false, // ✅ clave para area chart
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
        stack: 'Total', // ✅ apilado
        areaStyle: {}, // ✅ area
        smooth, // ✅ suaviza
        emphasis: { focus: 'series' },
        symbol: 'none', // ✅ quita puntitos (más limpio)
        data: s.data,
      })),
    };

    chartInstanceRef.current.setOption(option, true);
  }, [title, categories, series, height, showToolbox, showDataZoom, smooth]);

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
