import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Asset, Language } from '../types';
import { motion } from 'motion/react';
import { MapPin, Plane, Ship, Car, Home, Users } from 'lucide-react';

interface GeospatialTrackerProps {
  assets: Asset[];
  lang: Language;
}

export const GeospatialTracker: React.FC<GeospatialTrackerProps> = ({ assets, lang }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const t = {
    EN: {
      title: 'Live Geospatial Tracking',
      subtitle: 'Global Fleet Orchestration',
      activeAssets: 'Active Assets',
      secureZones: 'Secure Zones',
      inTransit: 'IN TRANSIT'
    },
    ES: {
      title: 'Seguimiento Geoespacial en Vivo',
      subtitle: 'Orquestación de Flota Global',
      activeAssets: 'Activos Activos',
      secureZones: 'Zonas Seguras',
      inTransit: 'EN TRÁNSITO'
    },
    PT: {
      title: 'Rastreamento Geoespacial ao Vivo',
      subtitle: 'Orquestração de Frota Global',
      activeAssets: 'Ativos Ativos',
      secureZones: 'Zonas Seguras',
      inTransit: 'EM TRÂNSITO'
    }
  }[lang];

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 450;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const projection = d3.geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Load world map data
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((data: any) => {
      // Draw the map
      svg.append('g')
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', '#ffffff05')
        .attr('stroke', '#ffffff10')
        .attr('stroke-width', 0.5);

      // Add asset points
      const assetPoints = [
        { name: 'Miami', coords: [-80.1918, 25.7617] },
        { name: 'Cartagena', coords: [-75.5144, 10.3910] },
        { name: 'St. Barths', coords: [-62.8333, 17.9000] },
        { name: 'Antigua', coords: [-61.8467, 17.0608] },
        { name: 'Anguilla', coords: [-63.0522, 18.2208] },
        { name: 'Bogotá', coords: [-74.0721, 4.7110] },
      ];

      svg.append('g')
        .selectAll('circle')
        .data(assetPoints)
        .enter()
        .append('circle')
        .attr('cx', d => projection(d.coords as [number, number])![0])
        .attr('cy', d => projection(d.coords as [number, number])![1])
        .attr('r', 4)
        .attr('fill', '#D4AF37')
        .attr('class', 'animate-pulse')
        .append('title')
        .text(d => d.name);

      // Add connections (simulated flights/routes)
      const links = [
        { source: [-80.1918, 25.7617], target: [-63.0522, 18.2208] },
        { source: [-75.5144, 10.3910], target: [-62.8333, 17.9000] },
      ];

      svg.append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('path')
        .attr('d', d => {
          const start = projection(d.source as [number, number])!;
          const end = projection(d.target as [number, number])!;
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const dr = Math.sqrt(dx * dx + dy * dy);
          return `M${start[0]},${start[1]}A${dr},${dr} 0 0,1 ${end[0]},${end[1]}`;
        })
        .attr('fill', 'none')
        .attr('stroke', '#D4AF3730')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5,5')
        .attr('class', 'animate-dash');
    });
  }, [assets]);

  return (
    <div className="glass-panel p-8 rounded-[40px] border-gold/20 overflow-hidden relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-serif">{t.title}</h3>
          <p className="text-luxury-cream/40 text-[10px] uppercase tracking-widest">{t.subtitle}</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] text-luxury-cream/60 uppercase tracking-widest">{t.activeAssets}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-[10px] text-luxury-cream/60 uppercase tracking-widest">{t.secureZones}</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] bg-luxury-black/30 rounded-3xl border border-white/5 overflow-hidden">
        <svg 
          ref={svgRef} 
          viewBox="0 0 800 450" 
          className="w-full h-full"
        />
        
        {/* Overlay Info */}
        <div className="absolute bottom-6 left-6 space-y-2">
          {assets.slice(0, 3).map((asset, i) => (
            <div key={i} className="flex items-center gap-3 bg-luxury-black/80 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="p-2 bg-gold/10 text-gold rounded-xl">
                {asset.type === 'AIRCRAFT' ? <Plane size={14} /> : asset.type === 'VESSEL' ? <Ship size={14} /> : <Car size={14} />}
              </div>
              <div>
                <span className="text-[10px] font-bold block">{asset.name}</span>
                <span className="text-[8px] text-luxury-cream/40 uppercase tracking-widest">{asset.location} • {t.inTransit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
