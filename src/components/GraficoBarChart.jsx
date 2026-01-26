// src/components/EchartsBarChart.jsx
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function EchartsBarChart({
  title = '',
  categories = [],
  series = [],
  height = 400,
  showToolbox = true,
  showDataZoom = true,

  // ✅ porcentaje
  showPercent = false,
  percentDecimals = 2,
}) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const roRef = useRef(null);

  // 1) Init + ResizeObserver
  useEffect(() => {
    if (!chartRef.current) return;

    const existing = echarts.getInstanceByDom(chartRef.current);
    chartInstanceRef.current = existing ?? echarts.init(chartRef.current);

    roRef.current = new ResizeObserver(() => {
      chartInstanceRef.current?.resize();
    });
    roRef.current.observe(chartRef.current);

    return () => {
      roRef.current?.disconnect();
      roRef.current = null;

      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  // 2) Options
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    // ✅ normaliza cualquier dato mixto (0–1 y 0–100) a 0–100 si showPercent=true
    const normalizeToPercent = (v) => {
      if (v == null) return v;
      const n = Number(v);
      if (Number.isNaN(n)) return v;
      if (!showPercent) return n;

      // 0.9045 => 90.45
      // 3 => 3
      return n <= 1 ? n * 100 : n;
    };

    const formatValue = (val) => {
      if (val == null) return '';
      if (!showPercent) return `${val}`;
      return `${Number(val).toFixed(percentDecimals)}%`;
    };

    const labelCommon = {
      show: true,
      position: 'insideBottom',
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      distance: 10,
      fontSize: 11,
      formatter: (params) => formatValue(params.value),
    };

    // ✅ series normalizadas
    const normalizedSeries = series.map((s) => ({
      ...s,
      data: (s.data ?? []).map(normalizeToPercent),
    }));

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
        axisPointer: { type: 'shadow' },
        formatter: (items) => {
          if (!items?.length) return '';
          const category = items[0].axisValue;
          const lines = items.map(
            (it) =>
              `${it.marker} ${it.seriesName}: <b>${formatValue(it.value)}</b>`,
          );
          return `<b>${category}</b><br/>${lines.join('<br/>')}`;
        },
      },

      legend: { data: normalizedSeries.map((s) => s.name), top: 50 },

      toolbox: showToolbox
        ? {
            show: true,
            right: 30,
            top: 20,
            orient: 'vertical',
            feature: { saveAsImage: { show: true } },
          }
        : undefined,

      grid: {
        top: title ? 90 : 60,
        left: 60,
        right: 40,
        bottom: showDataZoom ? 55 : 60,
        containLabel: true,
      },

      dataZoom: showDataZoom
        ? [
            { type: 'inside', xAxisIndex: 0 },
            { type: 'slider', xAxisIndex: 0, height: 20, bottom: 10 },
          ]
        : undefined,

      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: categories,
          axisLabel: { interval: 0, rotate: 45, hideOverlap: false },
        },
      ],

      yAxis: [
        {
          type: 'value',
          min: showPercent ? 0 : undefined,
          max: showPercent ? 100 : undefined,
          axisLabel: {
            formatter: (val) => (showPercent ? `${val}%` : `${val}`),
          },
        },
      ],

      series: normalizedSeries.map((s, idx) => ({
        name: s.name,
        type: 'bar',
        barGap: idx === 0 ? 0 : undefined,
        label: labelCommon,
        emphasis: { focus: 'series' },
        data: s.data,
      })),
    };

    chartInstanceRef.current.setOption(option, true);
    requestAnimationFrame(() => chartInstanceRef.current?.resize());
  }, [
    title,
    categories,
    series,
    showToolbox,
    showDataZoom,
    showPercent,
    percentDecimals,
  ]);

  return (
    <div
      ref={chartRef}
      className="w-full"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    />
  );
}
