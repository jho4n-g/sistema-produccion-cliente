// src/components/EchartsBarChart.jsx
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function EchartsBarChart({
  title = '',
  categories = [],
  series = [],
  height = 400,
  showToolbox = true,
}) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // 1) Inicializar UNA sola vez
  useEffect(() => {
    if (!chartRef.current) return;
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    function handleResize() {
      chartInstanceRef.current && chartInstanceRef.current.resize();
    }

    window.addEventListener('resize', handleResize);

    // cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  // 2) Actualizar opciones cuando cambian los props
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    const labelCommon = {
      show: true,
      position: 'insideBottom',
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      distance: 15,
      formatter: '{c}  {name|{a}}',
      fontSize: 16,
      rich: {
        name: {},
      },
    };

    const option = {
      title: title
        ? {
            text: title,
            left: 'center',
            top: 10,
            textStyle: {
              fontSize: 18,
              fontWeight: 'bold',
            },
          }
        : undefined,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        // sacamos los nombres de las series automáticamente
        data: series.map((s) => s.name),
        top: 50,
      },
      toolbox: showToolbox
        ? {
            show: true,
            right: 30,
            top: 20,
            orient: 'vertical',
            feature: {
              saveAsImage: { show: true },
            },
          }
        : undefined,
      grid: {
        top: title ? 90 : 60,
        left: 60,
        right: 40,
        bottom: 50,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: categories,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: series.map((s, idx) => ({
        name: s.name,
        type: 'bar',
        barGap: idx === 0 ? 0 : undefined,
        label: labelCommon,
        emphasis: { focus: 'series' },
        data: s.data,
      })),
    };

    chartInstanceRef.current.setOption(option, true);
  }, [title, categories, series, showToolbox]);

  return (
    <div
      ref={chartRef}
      className="flex justify-center"
      style={{
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}
