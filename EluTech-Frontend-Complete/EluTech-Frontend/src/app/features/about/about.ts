import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

  services = [
    {
      icon: '⚗️',
      title: 'Chemical Testing',
      desc: 'Comprehensive analysis of chemical composition, purity, and compliance with IS, ASTM, and ISO standards for pharmaceuticals, food, and industrial chemicals.'
    },
    {
      icon: '📏',
      title: 'Precision Calibration',
      desc: 'NABL-accredited calibration of measuring instruments, gauges, balances, thermometers, and electronic test equipment with traceable measurement standards.'
    },
    {
      icon: '💧',
      title: 'Water Quality Analysis',
      desc: 'Physicochemical and microbiological testing of drinking water, wastewater, borewell water, and effluent samples as per BIS and CPCB norms.'
    },
    {
      icon: '🌿',
      title: 'Environmental Testing',
      desc: 'Air quality monitoring, soil analysis, noise level measurement, and environmental impact assessments for industries, municipalities, and institutions.'
    },
    {
      icon: '🏗️',
      title: 'Construction Materials',
      desc: 'Testing of cement, concrete, steel, aggregates, bricks, and soil for quality compliance in infrastructure and construction projects across Rajasthan.'
    },
    {
      icon: '🍃',
      title: 'Food & Agriculture',
      desc: 'Safety and quality testing of food products, agricultural inputs, pesticide residues, heavy metals, and nutritional content for FSSAI compliance.'
    },
    {
      icon: '⚡',
      title: 'Electro-Technical',
      desc: 'Electrical parameter calibration including voltage, current, resistance, and power measurement instruments for industrial and utility sectors.'
    },
    {
      icon: '🔬',
      title: 'Microbiological Testing',
      desc: 'Detection and enumeration of microbial contaminants in water, food, pharmaceutical, and environmental samples using accredited methodologies.'
    },
  ];

  accreditations = [
    { name: 'NABL', full: 'National Accreditation Board for Testing & Calibration Laboratories', body: 'Dept. of Science & Technology, Govt. of India' },
    { name: 'ISO/IEC 17025', full: 'General Requirements for the Competence of Testing & Calibration Laboratories', body: 'International Organization for Standardization' },
    { name: 'BIS', full: 'Bureau of Indian Standards', body: 'Ministry of Consumer Affairs, Govt. of India' },
    { name: 'CPCB', full: 'Central Pollution Control Board Approved', body: 'Ministry of Environment, Govt. of India' },
  ];

  stats = [
    { value: '10+', label: 'Years of Service' },
    { value: '5000+', label: 'Samples Tested / Year' },
    { value: '200+', label: 'Satisfied Clients' },
    { value: '50+', label: 'Accredited Parameters' },
  ];

  clients = [
    'Rajasthan Government Bodies', 'RIICO Industrial Units',
    'Pharmaceutical Companies', 'Food Processing Industries',
    'Infrastructure Developers', 'Municipal Corporations',
    'Educational Institutions', 'Export-Oriented Units'
  ];
}
