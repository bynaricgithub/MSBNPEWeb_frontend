import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import HomeCss from "./home.module.css";
import API from "../../API";
import { show } from "../../utils/Helper";
import FileComponent from "../CommonComponent/FileVerify";

const staticData = [
  {
    title: "Maharashtra Nursing Council 2024",
    image: "/assets/images/slider.jpg",
  },
  {
    title: "Workshop on Nursing Practice",
    image: "/assets/images/slider3.png",
  },
  {
    title: "Capacity Building Initiative",
    image: "/assets/images/slider5.png",
  },
];
const Slider = () => {
  const [data, setData] = useState([]);

  const options = {
    items: 1,
    nav: true,
    navText: ["<span class='fa fa-caret-left'></span>", "<span class='fa fa-caret-right'></span>"],
    autoplay: true,
    autoplayTimeout: 5000,
    loop: true,
    pagination: false,
    dots: false,
  };

  useEffect(() => {
    getSliderImages();
  }, []);

  async function getSliderImages() {
    try {
      const res = await API.get("/slider-images/listing");
      const result = res?.data?.data || [];

      const formatted = result.map((item) => ({
        title: item.title || "",
        header: item.header || "",
        alternate_name: item.alternate_name || "",
        image: item.image?.startsWith("http") ? item.image : item.image,
        // image: item.image?.startsWith("http") ? item.image : process.env.REACT_APP_DATA_SERVER_PATH + item.image,
      }));

      setData(formatted);
    } catch (error) {
      show({
        message: error.response?.data?.message || error.message || "Failed to load slider",
        displayClass: "failure",
      });
    }
  }

  return (
    <div className={`${HomeCss.slider} mSlider`}>
      {data.length > 0 && (
        <OwlCarousel items={1} className="owl-theme" margin={8} {...options}>
          {data.map((item, key) => (
            <div className="item text-center" key={key}>
              {/* {item.image && <img className="d-block w-100" src={item.image} alt={item.alternate_name} />} */}
              {item.image && <FileComponent file={item.image} fileTitle={item.alternate_name || "Image"} fileType="slider" />}

              <p className="text-black font-16 my-2">{item.header}</p>
            </div>
          ))}
        </OwlCarousel>
      )}
    </div>
  );
};

export default Slider;
