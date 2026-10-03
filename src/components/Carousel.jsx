// băng ảnh trượt
import { useState } from "react";

function Carousel({ images }) {
  const [index, setIndex] = useState(0);

  const goPrev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="carousel">
      <img
        src={images[index]}
        alt={`Ảnh thú cưng ${index + 1}`}
        className="carousel-image"
      />

      <button
        className="carousel-btn prev"
        onClick={goPrev}
        aria-label="Ảnh trước"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        className="carousel-btn next"
        onClick={goNext}
        aria-label="Ảnh tiếp theo"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Đi tới ảnh ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
