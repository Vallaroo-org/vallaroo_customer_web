'use client';

interface MapProps {
  lat: number;
  lng: number;
}

const Map = ({ lat, lng }: MapProps) => {
  return (
    <div className="w-full h-full">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
      ></iframe>
    </div>
  );
};

export default Map;
