import React from 'react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Images</h2>
      <div className="grid grid-cols-2 gap-4">
        {images.length > 0 ? (
          images.map((url, index) => (
            <div key={index} className="aspect-w-16 aspect-h-9">
              <img
                src={url}
                alt={`Wikipedia image ${index + 1}`}
                className="w-full h-full object-contain rounded hover:scale-105 transition-transform"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          ))
        ) : (
          <p className="col-span-2 text-gray-500 text-center">No images available</p>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;