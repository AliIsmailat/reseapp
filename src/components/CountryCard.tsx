//{IMPORTS OCH TYPES}
//importerar react, useNagivate och
//typen CountryData som beskriver strukturen
//på country objektet (name, capital, region, etc)
import React from "react";
import { useNavigate } from "react-router-dom";
import type { CountryData } from "../types/types";

interface CountryCardProps {
  country: CountryData;
}

//{FUNKTIONALITET}
//skapar react-funktionen CountryCard
// React.FC<CountryCardProps> är function component
// CountryCardProps > country > countrydata
//useNavigate sparas i funktionen navigate
//handleclick körs när användaren trycker på ett kort
//använder navigate och går till sidan
// /country/${landets kod i tre bokstäver}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/country/${country.cca3}`);
  };

  //{HTML + TAILWIND - self explanitory}

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer border border-gray-300 bg-white rounded shadow-lg hover:shadow-2xl p-4 flex flex-col transition duration-300"
    >
      <img
        src={country.flagUrl}
        alt={`Flag of ${country.name}`}
        className="w-full h-32 object-cover rounded mb-4"
      />
      <h2 className="text-lg font-semibold mb-1">{country.name}</h2>
      {country.capital && (
        <p className="text-gray-600 mb-1">Huvudstad: {country.capital}</p>
      )}
      <p className="text-gray-600 mb-1">Region: {country.region}</p>
      {country.population && (
        <p className="text-gray-600">Befolkning: {country.population}</p>
      )}
    </div>
  );
};

export default CountryCard;
