'use client';

interface MapProps {
  lat: number;
  lng: number;
}

const Map = ({ lat, lng }: MapProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=14`;

  return (
    <div className="w-full h-full">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={url}
      ></iframe>
    </div>
  );
};

export default Map;
