import { useEffect, useState } from "react";

// id, size, x, y, opacity, animationDuration
// id, size, x, y, delay, animationDuration

export const StarBackground = () => {
  const [stars, setStars] = useState([]);
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    generateStars();
    generateMeteors();

    const handleResize = () => {
      generateStars();
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateStars = () => {
    const numberOfStars = Math.floor(
      (window.innerWidth * window.innerHeight) / 10000
    );

    const newStars = [];

    for (let i = 0; i < numberOfStars; i++) {
      newStars.push({
        id: i,
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.5,
        animationDuration: Math.random() * 4 + 2,
      });
    }

    setStars(newStars);
  };

  const generateMeteors = () => {
    const numberOfMeteors = 4;
    const newMeteors = [];

    for (let i = 0; i < numberOfMeteors; i++) {
      newMeteors.push({
        id: i,
        size: Math.random() * 2 + 1,
        x: Math.random() * 100,
        y: Math.random() * 20,
        delay: Math.random() * 15,
        animationDuration: Math.random() * 3 + 3,
      });
    }

    setMeteors(newMeteors);
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-twinkle"
          style={{
            width: star.size + "px",
            height: star.size + "px",
            left: star.x + "%",
            top: star.y + "%",
            opacity: star.opacity,
            animationDuration: star.animationDuration + "s",
            animationDelay: (Math.random() * 4) + 's',
          }}
        />
      ))}

      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="meteor animate-meteor"
          style={{
            width: meteor.size * 80 + "px",
            height: meteor.size * 2 + "px",
            left: meteor.x + "%",
            top: meteor.y + "%",
            animationDelay: meteor.delay + 's',
            animationDuration: meteor.animationDuration + "s",
            transform: 'rotate(-30deg)',
          }}
        />
      ))}

      <style>{`
        .star {
          position: absolute;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 6px 2px #a5b4fc44;
        }
        .meteor {
          position: absolute;
          border-radius: 9999px;
          background: linear-gradient(90deg, #a5b4fc 0%, #818cf8 100%);
          opacity: 0.7;
          filter: blur(0.5px);
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; box-shadow: 0 0 6px 2px #a5b4fc44; }
          50% { opacity: 1; box-shadow: 0 0 12px 4px #a5b4fc88; }
        }
        .animate-twinkle {
          animation-name: twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        @keyframes meteor {
          0% { opacity: 0; transform: translateX(0) translateY(0) rotate(-30deg); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: translateX(-300px) translateY(180px) rotate(-30deg); }
        }
        .animate-meteor {
          animation-name: meteor;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
};
