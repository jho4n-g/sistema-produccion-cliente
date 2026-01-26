// src/components/EchartsLineBudgetVsProduction.jsx
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

/**
 * Componente: Línea Producción vs Presupuesto (con dataset + transform opcional)
 *
 * rawData ejemplo:
 * [
 *   { Day: '01', Fecha: '2026-01-01', Produccion: 1200, Presupuesto: 1500 },
 *   { Day: '02', Fecha: '2026-01-02', Produccion: 900,  Presupuesto: 1500 },
 * ]
 *
 * Recomendación:
 * - xField: 'Day' (01..31) o 'Fecha' (YYYY-MM-DD)
 * - productionField: nombre exacto del campo de producción
 * - budgetField: nombre exacto del campo de presupuesto/meta
 */

export default function EchartsLineBudgetVsProduction({
  title = 'Producción vs Presupuesto',
  rawData = [],
  xField = 'Day',
  productionField = 'Produccion',
  budgetField = 'Presupuesto',
  height = 420,
  showToolbox = true,
  showDataZoom = true,
  smooth = true,
  filterNulls = false, // ✅ si true, usa transform.filter con neq: null
}) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // 1) Inicializar UNA sola vez
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

  // 2) Actualizar opciones cuando cambian los props
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    // Dataset base
    const datasets = [
      {
        id: 'dataset_raw',
        source: rawData,
      },
    ];

    // ✅ Opcional: filtrar nulos correctamente (neq: null)
    if (filterNulls) {
      datasets.push(
        {
          id: 'dataset_produccion',
          fromDatasetId: 'dataset_raw',
          transform: {
            type: 'filter',
            config: {
              and: [{ dimension: productionField, neq: null }],
            },
          },
        },
        {
          id: 'dataset_presupuesto',
          fromDatasetId: 'dataset_raw',
          transform: {
            type: 'filter',
            config: {
              and: [{ dimension: budgetField, neq: null }],
            },
          },
        },
      );
    }

    const option = {
      dataset: datasets,

      title: title
        ? {
            text: title,
            left: 'center',
            top: 10,
            textStyle: { fontSize: 18, fontWeight: 'bold' },
          }
        : undefined,

      tooltip: { trigger: 'axis' },

      legend: {
        top: title ? 45 : 10,
        data: ['Producción', 'Presupuesto'],
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

      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          interval: 0,
          rotate: rawData.length > 12 ? 45 : 0,
          hideOverlap: true,
        },
      },

      yAxis: { type: 'value' },

      series: [
        {
          name: 'Producción',
          type: 'line',
          datasetId: filterNulls ? 'dataset_produccion' : 'dataset_raw',
          showSymbol: false,
          smooth,
          encode: {
            x: xField,
            y: productionField,
            itemName: xField,
            tooltip: [productionField],
          },
        },
        {
          name: 'Presupuesto',
          type: 'line',
          datasetId: filterNulls ? 'dataset_presupuesto' : 'dataset_raw',
          showSymbol: false,
          smooth,
          encode: {
            x: xField,
            y: budgetField,
            itemName: xField,
            tooltip: [budgetField],
          },
        },
      ],
    };

    chartInstanceRef.current.setOption(option, true);
  }, [
    title,
    rawData,
    xField,
    productionField,
    budgetField,
    height,
    showToolbox,
    showDataZoom,
    smooth,
    filterNulls,
  ]);

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
