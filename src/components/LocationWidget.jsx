import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Crosshair } from 'lucide-react';

const LocationWidget = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default Academy Location (Katpadi, Vellore)
  const academyLocation = { lat: 12.9692, lng: 79.1360 };

  const locateMe = () => {
    setLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location. Please check browser permissions.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MapPin size={24} color="var(--primary)" /> Academy Location
        </h2>
        <button className="btn btn-sm btn-secondary" onClick={locateMe} disabled={loading}>
          {loading ? 'Locating...' : <><Crosshair size={14} /> Get Directions</>}
        </button>
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>}

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
          <Navigation size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Address Details</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.4 }}>
            Area/Town: Katpadi<br/>
            District: Vellore District<br/>
            Landmark: Near Katpadi Railway Station (Katpadi Junction)
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height: '240px', background: '#e2e8f0', borderRadius: 'var(--radius-sm)', overflow: 'hidden', position: 'relative' }}>
        {/* Placeholder for an actual Google Maps iframe or Leaflet map. Using Katpadi coordinates */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=12.9692,79.1360&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C12.9692,79.1360&key=YOUR_API_KEY")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(0.8) contrast(1.2)' }}>
           {/* If API key is missing, this acts as a beautiful stylized fallback overlay */}
           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10, 13, 20, 0.6)' }}>
              <span style={{ padding: '8px 16px', background: 'var(--bg-card)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid var(--primary)', color: 'var(--text-primary)' }}>
                Map Integrated View
              </span>
           </div>
        </div>
      </div>

      {userLocation && (
        <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--success)' }}>
          Your location detected: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}. 
          Ready for routing.
        </p>
      )}
    </div>
  );
};

export default LocationWidget;
