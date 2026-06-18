/**
 * Public About Page
 */

import React from 'react';
import PublicLayout from '../../layouts/PublicLayout';

const Feature = ({ icon, title, description }) => (
  <div className="about-feature">
    <div className="about-feature-icon">{icon}</div>
    <div>
      <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-gray-800)', marginBottom: '0.25rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  </div>
);

const AboutPage = () => (
  <PublicLayout>
    {/* Page Hero */}
    <div className="page-hero">
      <div className="container">
        <h1 className="page-hero-title">About ESS</h1>
        <p className="page-hero-subtitle">
          The Ethiopian Statistical Service — Ethiopia's premier national statistics authority.
        </p>
      </div>
    </div>

    {/* Overview */}
    <section className="section">
      <div className="container">
        <div className="about-grid">
          <div>
            <div className="section-label">Our Organization</div>
            <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Ethiopian Statistical Service</h2>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: '1rem' }}>
              The Ethiopian Statistical Service (ESS) is the official government agency responsible for the production, collection, compilation, analysis, and dissemination of official statistics for Ethiopia.
            </p>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: '1rem' }}>
              ESS plays a critical role in supporting evidence-based policymaking, national development planning, and monitoring of the Sustainable Development Goals (SDGs) through reliable and timely statistical data.
            </p>
            <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-gray-600)', lineHeight: 1.8 }}>
              As part of our commitment to institutional excellence, the ESS Internal Promotion Management System was developed to ensure fair, transparent, and efficient management of internal career advancement opportunities for all ESS employees.
            </p>
          </div>

          <div className="about-feature-list">
            <Feature
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Statistical Excellence"
              description="Producing high-quality, internationally comparable statistics using rigorous methodologies and modern technology."
            />
            <Feature
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Human Capital Development"
              description="Investing in the growth and professional advancement of our dedicated workforce across all offices in Ethiopia."
            />
            <Feature
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Transparency & Fairness"
              description="Ensuring all promotion processes are conducted with integrity, equal opportunity, and full transparency for every employee."
            />
            <Feature
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="National Coverage"
              description="Operating across all regions of Ethiopia with a network of regional statistical offices and dedicated field staff."
            />
          </div>
        </div>
      </div>
    </section>

    {/* Purpose of this system */}
    <section className="section" style={{ background: 'var(--color-gray-50)' }}>
      <div className="container">
        <div className="section-header centered">
          <div className="section-label">This Platform</div>
          <h2 className="section-title">About This System</h2>
          <p className="section-desc">
            The ESS Internal Promotion Management System is designed to streamline how internal career opportunities are communicated to employees.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
          {[
            { title: 'Centralized Announcements', desc: 'All internal promotion opportunities are published in one accessible location, ensuring every eligible employee has equal access to information.' },
            { title: 'Downloadable Documents', desc: 'Application guidelines, position descriptions, and official documents can be downloaded directly from each promotion listing.' },
            { title: 'Timely Updates', desc: 'Stay informed about deadlines and new openings through the News & Announcements section, updated regularly by HR.' },
            { title: 'Searchable & Filterable', desc: 'Quickly find relevant opportunities by searching or filtering by department, status, or keywords.' },
          ].map((item) => (
            <div key={item.title} style={{
              background: '#fff',
              borderRadius: 'var(--border-radius-lg)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow)',
              borderTop: '3px solid var(--color-primary)',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-800)', marginBottom: '0.625rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', lineHeight: 1.7 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Contact */}
    <section className="section">
      <div className="container">
        <div className="section-header centered">
          <div className="section-label">Get in Touch</div>
          <h2 className="section-title">Contact Information</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2.5rem', maxWidth: 860, margin: '2.5rem auto 0' }}>
          {[
            { label: 'Address', value: 'Addis Ababa, Ethiopia', icon: '📍' },
            { label: 'Email', value: 'info@ess.gov.et', icon: '✉️' },
            { label: 'Phone', value: '+251 (0) 115 57 00 00', icon: '📞' },
            { label: 'Website', value: 'www.ess.gov.et', icon: '🌐' },
          ].map((item) => (
            <div key={item.label} style={{
              background: '#fff', borderRadius: 'var(--border-radius-lg)',
              padding: '1.5rem', boxShadow: 'var(--shadow)', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gray-400)', marginBottom: '0.375rem' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default AboutPage;
