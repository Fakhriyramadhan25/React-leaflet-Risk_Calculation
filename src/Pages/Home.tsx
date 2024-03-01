import { FaMapMarkedAlt } from "react-icons/fa";
import { useState } from "react";

import Headers from "../Components/Headers";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import disaster1 from '../assets/cityflood.jpg';
import disaster2 from '../assets/cityflood2.jpg';
import disaster3 from '../assets/natureforest.jpg';
import normal1 from '../assets/city.jpg';
import normal2 from '../assets/city2.jpg';
import normal3 from '../assets/nature.jpg';
import { Link } from "react-router-dom";


function Home() {

  const carouselData = [
    {
      alias: "FD1",
      image: normal1
    },
    
    {
      alias: "VD1",
      image: disaster1
    },
    {
      alias: "FD2",
      image: normal2
    },
    {
      alias: "VD2",
      image: disaster2
    },
    {
      alias: "FD3",
      image: normal3
    },
    {
      alias: "VD3",
      image: disaster3
    }
  ]

  // The `state` arg is correctly typed as `RootState` already
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider(
      {
        loop: true,
        initial: 0,
        slideChanged(slider) {
          setCurrentSlide(slider.track.details.rel);
        },
        created() {
          setLoaded(true);
        },
      },
      [
        (slider) => {
          let timeout:any;
          let mouseOver = false;
          function clearNextTimeout() {
            clearTimeout(timeout);
          }
          function nextTimeout() {
            clearTimeout(timeout);
            if (mouseOver) return;
            timeout = setTimeout(() => {
              slider.next();
            }, 3000);
          }
          if (carouselData?.length > 1) {
            slider.on("created", () => {
              slider.container.addEventListener("mouseover", () => {
                mouseOver = true;
                clearNextTimeout();
              });
              slider.container.addEventListener("mouseout", () => {
                mouseOver = false;
                nextTimeout();
              });
              nextTimeout();
            });
            slider.on("dragStarted", clearNextTimeout);
            slider.on("animationEnded", nextTimeout);
            slider.on("updated", nextTimeout);
          }
        },
      ]
    );

  return (
    <div className='h-screen'>
      <Headers/>
     
    <div className='navigation-wrapper'>
    <div ref={sliderRef} className='keen-slider'>
            {carouselData.map((carousel) => (
              <Slide
                key={carousel.alias}
                image={carousel.image}
              />
            ))}
      </div>

    {loaded && instanceRef.current && (
        <div className='squaresFooter'>
          {[
            ...Array(instanceRef.current.track.details.slides.length).keys(),
          ].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={"square"+ (currentSlide === idx ? " active" : "") }
              ></button>
            );
          })}
        </div>
      )}

      </div>
  </div>
  )
}

function Slide({ key, image }:any) {
  return (
    <>
      <div
        className={`relative keen-slider__slide h-screen md:w-full z-0`}
        key={key}
      >
      <img 
         src={`${image}`}
          className='h-screen w-full object-cover brightness-75'
          alt='carousel-img'
      />
      </div>



      <div className="flex flex-col text-white items-center space-y-6  mx-auto text-center z-20 absolute top-1/3 left-1/3 ms-16">
      <div className="w-[600px]">
        <p className="text-6xl text-navy-800 font-bold ">
          Post Natural Disaster Damages Estimator
        </p>
        </div>
      <div className="w-[400px]">
      <span className="text-md text-navy-500 font-light">
          "Find out the number of casualties and damages infrastructures post natural disaster in specific location
           through imagery satellite inspection.""
        </span>
      </div>
      <Link to="/maps">
      <div className="px-5 py-2 bg-emerald-500 text-white rounded-md border-black cd space-x-2 hover:bg-green-200 hover:text-black">
      <span className="inline font-semibold text-lg">Visit Map  </span>
      <FaMapMarkedAlt className="inline mb-2" size={32}/> 
    </div>
    </Link>

       
      </div>



    </>
  );
}


export default Home