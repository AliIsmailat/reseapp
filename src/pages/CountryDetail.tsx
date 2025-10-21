interface CountryData {
  capital?: string;
  cca3: string;
  currency?: string[];
  flagUrl?: string;
  languages?: string[];
  name: string;
  region: string;
  officialName?: string;
  subregion?: string;
  population?: number;
  latlng?: [number, number];
}

interface WeatherData {
  temperature: number;
  windspeed: number;
}

interface Wikidata {
  extract: string;
  url: string;
}

interface ImageData {
  url: string;
  alt: string;
}

import React from "react";
import { useParams } from "react-router-dom";

const CountryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Country Detail Page</h1>
      <p>Country ID: {id}</p>
    </div>
  );
};

export default CountryDetail;
