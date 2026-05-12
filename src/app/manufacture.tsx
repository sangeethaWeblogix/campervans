"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import '../app/home/main.css'


const data = [
  {
    img: "/images/australian-offroad.png",
    alt: "Australian Off Road Logo",
    title: "Australian Off Road",
    desc: "Explore AOR campervans in Australia with our detailed review, covering top models, features and pricing to help you plan your next rugged adventure.",
    type: "Off Road, Hybrid, Campers",
    brand: "AOA",
    link: "/aor-campervans-australia-reviews-prices-models/",
  },
  {
    img: "/images/vibe_campervans.png",
    alt: "Vibe Campervans Logo",
    title: "Vibe Campervans",
    desc: "Read our VIBE Campervans Australia review covering top models, off-grid features and pricing from $92,990 for adventure seekers and travellers.",
    type: "Off Road, Hybrid, Semi Off Road",
    brand: "Vibe",
    link: "/vibe-campervans-australia-review-prices-models/",
  },
  {
    img: "/images/Ezytrail.png",
    alt: "Ezytrail Logo",
    title: "Ezytrail Campervans",
    desc: "Read our Ezytrail Campervans review from Aussie owners. Discover towing performance, comfort and durability to decide if an Ezytrail suits you.",
    type: "Off Road, Hybrid, On Road",
    brand: "Ezytrail",
    link: "/ezytrail-campervans-reviews-2025/",
  },
  {
    img: "/images/Avan.png",
    alt: "Avan Logo",
    title: "Avan Campervans",
    desc: "Explore our Avan Campervans review with 2025 models, key features and prices to help you choose the right campervan for your travels in Australia.",
    type: "Campers, Pop Tops, Hard Tops",
    brand: "Avan",
    link: "/avan-campervans-review-features-prices/",
  },
  {
    img: "/images/blue_sky.png",
    alt: "Blue Sky Logo",
    title: "Blue Sky Campervans",
    desc: "Discover our Blue Sky Campervans review, comparing models, standout features and off-road ability to help Aussie travellers pick the right fit.",
    type: "Off-Road, Touring, Family, Luxury",
    brand: "Blue Sky",
    link: "/blue-sky-campervans-review-australia/",
  },
  {
    img: "/images/Crusader-Campervans.png",
    alt: "Crusader Campervans Logo",
    title: "Crusader Campervans",
    desc: "Read our Crusader Campervans review covering key features, model options and pricing to help you choose the perfect campervan for your adventures.",
    type: "Off-Road, Touring, Family, Luxury",
    brand: "Crusader",
    link: "/crusader-campervans-review-features-compare-prices/",
  },
  {
    img: "/images/JB-campervans.png",
    alt: "JB Campervans Logo",
    title: "JB Campervans",
    desc: "Explore our JB Campervans review with 2025 models, prices and features. From off-road touring to luxury travel, find the perfect campervan for you.",
    type: "Off-Road, Hybrid, On-Road",
    brand: "JB",
    link: "/jb-campervans-australia-models-reviews-prices/",
  },
  {
    img: "/images/MDC.png",
    alt: "MDC Campervans Logo",
    title: "MDC Campervans",
    desc: "Discover our MDC Campervans review, exploring features and comparing off-road models to help you choose the ideal adventure-ready campervan today.",
    type: "Off-Road, Hybrid, On-Road",
    brand: "MDC",
    link: "/mdc-campervans-australia-reviews-features/",
  },
  {
    img: "/images/Ausflex-campervans.png",
    alt: "Ausflex Campervans Logo",
    title: "Ausflex Campervans",
    desc: "Read our Ausflex Campervans review of Australian-made models since 1972. Explore pricing, build quality and off-road capability for travellers.",
    type: "Off-Road, Family, On-Site",
    brand: "Ausflex",
    link: "/ausflex-campervans-australia-review-price/",
  },
  {
    img: "/images/Latitude.png?=1647112222",
    alt: "Latitude RV Campervans Logo",
    title: "Latitude RV Campervans",
    desc: "Explore our Latitude RV campervans review, featuring rugged builds, luxury touches, pricing and comparisons to help every Australian adventurer.",
    type: "Off-Road, Hybrid, On-Road",
    brand: "Latitude",
    link: "/latitude-rv-campervans-models-reviews-prices-features/",
  },
  {
    img: "/images/Adria.png",
    alt: "Adria Campervans Logo",
    title: "Adria Campervans",
    desc: "Read our Adria Campervans review comparing models, features and pricing to show why Adria remains a trusted choice for Australian travellers.",
    type: "Compact, Touring, Family, Luxury",
    brand: "Adria",
    link: "/adria-campervans-review-australia/",
  },
  {
    img: "/images/Fantasy-Campervans.png",
    alt: "Fantasy Campervans Logo",
    title: "Fantasy Campervans",
    desc: "Explore our Fantasy Campervans review covering Australian-made family models, build quality, off-road features and holiday-ready durability.",
    type: "Semi Off-Road, Hybrid, Off-Road",
    brand: "Fantasy",
    link: "/fantasy-campervans-review-models-prices/",
  },
  {
    img: "/images/Red-Centre-Campervans.png",
    alt: "Red Centre Campervans Logo",
    title: "Red Centre Campervans",
    desc: "Read our Red Centre Campervans review, exploring models, features and Australian-built quality to help you choose your next adventure van.",
    type: "Off-Road, Semi Off-Road, Touring, Hybrid",
    brand: "Red Centre",
    link: "/red-centre-campervans-review-australia/",
  },
  {
    img: "/images/Jayco.png",
    alt: "Jayco Campervans Logo",
    title: "Jayco Campervans",
    desc: "Read our Red Centre Campervans review, exploring models, features and Australian-built quality to help you choose your next adventure van.",
    type: "Pop Top, Camper Trailers, Off-Grid",
    brand: "Jayco",
    link: "/jayco-journey-outback-review/",
  },
  {
    img: "/images/urban-campervans.png?=1647112222",
    alt: "Urban Campervans Logo",
    title: "Urban Campervans",
    desc: "Discover our Urban Campervans review with model comparisons, features and pricing to help you choose a durable off-road-ready campervan.",
    type: "Off-Road, Off-Grid, Hybrid, On-Road",
    brand: "AOA",
    link: "/Urban-campervans-australia-review-prices-models/",
  },
  {
    img: "/images/Vision_Logo.png",
    alt: "Vision RV Campervans Logo",
    title: "Vision RV Campervans",
    desc: "Explore our Vision RV Campervans review, comparing models, key features and off-road performance to help you choose the ideal tough campervan.",
    type: "Off-Road, Family, Luxury",
    brand: "Vision RV",
    link: "/vision-rv-campervans-review-australia/",
  },
  {
    img: "/images/Trakmaster.png",
    alt: "Trakmaster Logo",
    title: "Trakmaster",
    desc: "Read our Trakmaster Pilbara Extreme review, exploring off-road strength, features and why this campervan is built for serious adventure.",
    type: "Off-Road, Camper",
    brand: "Trakmaster",
    link: "/trakmaster-pilbara-extreme-review/",
  },
  {
    img: "/images/Austrack-Campers.png",
    alt: "Austrack Campers Logo",
    title: "Austrack Campers",
    desc: "Explore our Austrack Gibb 14 review, covering key features, performance and build quality to help you decide if it suits your travel needs.",
    type: "Off-Road, Hybrid",
    brand: "Austrack",
    link: "/austrack-campers-gibb-14-in-depth-review/",
  },
  {
    img: "/images/newgen-logo.png?=1647112222",
    alt: "Newgen Campervans Logo",
    title: "Newgen Campervans",
    desc: "Read our Newgen NG15 review exploring layout, premium features and off-road capability, helping you pick this standout hybrid campervan.",
    type: "Off-Road, Hybrid",
    brand: "Newgen",
    link: "/newgen-campervans-ng15-comprehensive-review/",
  },
];

const Manufacture = () => {
  return (
    <div className="container">
      <div className="section-head mb-40">
        <h2>Top Campervan Brands Reviewed - Real Insights, Real Value</h2>
        <p>Discover in-depth reviews of Australia’s most trusted campervan manufacturers — with honest insights into build quality, off-road performance, layouts, comfort, and long-term reliability. Explore each brand to see how they truly stack up before you buy.</p>
      </div>

      <div className="range-home position-relative">

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: ".manu-next",
            prevEl: ".manu-prev",
          }}
          autoplay={{ delay: 3000 }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="post_item">
                <div className="post_image">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    width={300}
                    height={200}
                    style={{ objectFit: "contain" }}
                  />
                </div>

                <div className="post_info">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>

                  <ul className="mb-3">
                    <li>
                      <i className="bi bi-info-circle" />
                      <span>{item.type}</span>
                    </li>
                  </ul>

                  <Link href={item.link} target="_blank">
                    Read {item.brand} Review <i className="bi bi-chevron-right" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Arrows */}
        <div className="swiper-button-next manu-next" />
        <div className="swiper-button-prev manu-prev" />
      </div>
    </div>
  );
};

export default Manufacture;
