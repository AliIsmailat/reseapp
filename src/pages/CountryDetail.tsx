//Importerar stuff

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type {
  CountryData,
  WeatherData,
  WikiData,
  CountryImage,
} from "../types/types";

// fallback bilder om bilder ej hittas.
const placeholderImages: CountryImage[] = [
  { url: "https://picsum.photos/400/300?random=1", alt: "Bild 1" },
  { url: "https://picsum.photos/400/300?random=2", alt: "Bild 2" },
  { url: "https://picsum.photos/400/300?random=3", alt: "Bild 3" },
];

const CountryDetail: React.FC = () => {
  //hämtar code från URL
  const { code } = useParams<{ code: string }>();

  const navigate = useNavigate();

  //data om länder
  const [country, setCountry] = useState<CountryData | null>(null);
  //data om väder
  const [weather, setWeather] = useState<WeatherData | null>(null);
  //data från wiki
  const [wiki, setWiki] = useState<WikiData | null>(null);
  //laddningshjul under tiden som data fetchas
  const [loading, setLoading] = useState(true);
  //error check om en fetch misslyckas
  const [error, setError] = useState("");
  // state för bilder
  const [images, setImages] = useState<CountryImage[]>([]);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true); //sätter igång laddningshjul
        setError("");

        //standard fetch, om error ("blablabla")
        const res = await fetch(
          `https://restcountries.com/v3.1/alpha/${code}?fields=name,flags,region,subregion,capital,population,languages,currencies,capitalInfo,latlng`
        );
        if (!res.ok) throw new Error("Country fetch failed");
        const data = await res.json();

        //om fetchen lyckas, kollar om data är en array,
        //om true, c = data[0] - false: c=data
        const c = Array.isArray(data) ? data[0] : data;

        //koller om c är true och har egenskapen
        //languages samt currency,
        // om true tar vi alla values - annars
        //en tom array
        const languages: string[] = c?.languages
          ? Object.values(c.languages)
          : [];
        const currency: string[] = c?.currencies
          ? Object.keys(c.currencies)
          : [];

        //kollar om olika egenskaper finns i c
        //och hämtar dem, med vissa fallback
        //värden - borde kanske lägga till mer
        //fallback för t.ex. subregion ⚠️⚠️
        const countryData: CountryData = {
          name: c?.name?.common || "Okänt",
          officialName: c?.name?.official,
          region: c?.region || "Okänt",
          subregion: c?.subregion,
          capital: c?.capital?.[0],
          population: c?.population,
          languages,
          currency,
          flagUrl: c?.flags?.png,
          latlng: c?.capitalInfo?.latlng || c?.latlng,
          cca3: c?.cca3,
        };
        setCountry(countryData);

        //kollar om latlng finns och checkar om de är exakt 2
        if (countryData.latlng && countryData.latlng.length === 2) {
          const [lat, lon] = countryData.latlng;
          //gör API anrop med lat, lon och current weather som parametrar
          try {
            const weatherRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
            );
            if (weatherRes.ok) {
              const weatherData = await weatherRes.json();
              if (weatherData?.current_weather) {
                //om datan finns anropar vi setWeather
                //och sätter temp samt windspeed värden
                //på plats
                setWeather({
                  temperature: weatherData.current_weather.temperature,
                  windspeed: weatherData.current_weather.windspeed,
                });
              }
            }
          } catch {}
        }

        try {
          //fetchar från wikipedias API, encodeblablabla betyder
          //bara att namnet på länder är mer foolproof att
          //använda i en url med hjälp av specialtecken
          const wikiRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              countryData.name
            )}`
          );
          if (wikiRes.ok) {
            const wikiData = await wikiRes.json();
            //här ändrar vi state på wiki, extract
            // wikidata innebär att vi extraherar
            //datan, alltså infon om true. - om den är false
            //får vi bara en tom sträng ""
            setWiki({
              extract: wikiData.extract || "",

              //validerar och hämtar wikipedia URL med en fallback
              //till wiki + countryData.name
              //förstår inte helt varför man ska använda API
              //länken och inte fallback länken som jag har

              url:
                wikiData?.content_urls?.desktop?.page ||
                `https://en.wikipedia.org/wiki/${encodeURIComponent(
                  countryData.name
                )}`,
            });
          }
        } catch {}
        try {
          const pexelsRes = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(
              countryData.name
            )}&per_page=3`,
            {
              headers: {
                Authorization: import.meta.env.VITE_PEXELS_API_KEY,
              },
            }
          );

          if (pexelsRes.ok) {
            const pexelsData = await pexelsRes.json();
            if (pexelsData.photos && pexelsData.photos.length > 0) {
              setImages(
                pexelsData.photos.map((p: any) => ({
                  url: p.src.medium,
                  alt: p.alt || `Bild från ${countryData.name}`,
                }))
              );
            } else {
              setImages(placeholderImages);
            }
          } else {
            setImages(placeholderImages);
          }
        } catch {
          setImages(placeholderImages);
        }
      } catch (err) {
        setError("Kunde inte hämta landets information. Försök igen.");
        //finally körs alltid för att ändra setloading
        //till false
      } finally {
        setLoading(false);
      }
    };

    //om code finns och är giltig, fetcha landet
    //med den coden, annars - felmeddelande och
    //setloading (false)
    if (code) {
      fetchCountry();
    } else {
      setError("Ogiltig landkod.");
      setLoading(false);
    }
    //körs varje gång statet på code ändras
  }, [code]);

  if (loading) {
    return (
      <section
        className="min-h-screen flex items-center justify-center p-6"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="text-center">
          <p className="mb-2">Laddar…</p>
          <div className="inline-block w-12 h-12 rounded-full animate-spin border-4 border-gray-200 border-t-blue-600" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Försök igen
          </button>
          <button
            className="px-4 py-2 bg-gray-100 rounded"
            onClick={() => navigate(-1)}
          >
            ← Tillbaka
          </button>
        </div>
      </section>
    );
  }

  if (!country) {
    return (
      <section className="min-h-screen flex items-center justify-center p-6">
        <p>Inga data att visa.</p>
      </section>
    );
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 rounded transition duration-200"
          aria-label="Gå tillbaka"
        >
          ← Tillbaka
        </button>
      </div>

      <article className="flex flex-col md:flex-row gap-6">
        <figure className="w-full md:w-1/3 flex-shrink-0">
          {country.flagUrl ? (
            <img
              src={country.flagUrl}
              alt={`Flagga för ${country.name}`}
              className="w-full h-auto object-contain rounded shadow"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-40 md:h-52 bg-gray-100 rounded flex items-center justify-center text-gray-500">
              Ingen flagga
            </div>
          )}
          <figcaption className="text-sm text-gray-600 mt-2 text-center">
            {country.name}
          </figcaption>
        </figure>

        <section className="flex-1 space-y-3">
          <header>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {country.name}
            </h1>
            {country.officialName && (
              <p className="italic text-gray-600">{country.officialName}</p>
            )}
          </header>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            <div>
              <dt className="font-medium">Region</dt>
              <dd className="text-sm">
                {country.region}
                {country.subregion ? ` (${country.subregion})` : ""}
              </dd>
            </div>

            {country.capital && (
              <div>
                <dt className="font-medium">Huvudstad</dt>
                <dd className="text-sm">{country.capital}</dd>
              </div>
            )}

            {typeof country.population === "number" && (
              <div>
                <dt className="font-medium">Befolkning</dt>
                <dd className="text-sm">
                  {country.population.toLocaleString()}
                </dd>
              </div>
            )}

            <div>
              <dt className="font-medium">Språk</dt>
              <dd className="text-sm">
                {country.languages.length > 0
                  ? country.languages.join(", ")
                  : "N/A"}
              </dd>
            </div>

            <div>
              <dt className="font-medium">Valuta</dt>
              <dd className="text-sm">
                {country.currency.length > 0
                  ? country.currency.join(", ")
                  : "N/A"}
              </dd>
            </div>
          </dl>
        </section>
      </article>

      {weather && (
        <section
          aria-labelledby="weather-heading"
          className="mt-6 p-4 rounded shadow bg-white"
        >
          <h2 id="weather-heading" className="text-lg font-semibold mb-2">
            Aktuellt väder
          </h2>
          <p className="text-sm">
            Temperatur: <strong>{weather.temperature}°C</strong>
          </p>
          <p className="text-sm">
            Vind: <strong>{weather.windspeed} km/h</strong>
          </p>
        </section>
      )}

      <section aria-labelledby="gallery-heading" className="mt-6">
        <h2 id="gallery-heading" className="sr-only">
          Bilder från landet
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <figure key={img.url} className="overflow-hidden rounded shadow">
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-44 object-cover"
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </section>

      {wiki && (
        <article
          aria-labelledby="about-heading"
          className="mt-6 p-4 bg-white rounded shadow"
        >
          <h2 id="about-heading" className="text-lg font-semibold mb-2">
            Om {country.name}
          </h2>
          <p className="text-sm leading-relaxed">{wiki.extract}</p>
          <a
            href={wiki.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-blue-600 underline"
          >
            Läs mer på Wikipedia
          </a>
        </article>
      )}
    </main>
  );
};

export default CountryDetail;
