//importerar stuff
import React, { useEffect, useState } from "react";
import CountryCard from "../components/CountryCard";
import type { CountryData } from "../types/types";

//skapar array regions
const regions = [
  "All",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic",
];

const Home: React.FC = () => {
  //countries vars state kmr att vara countrydata
  const [countries, setCountries] = useState<CountryData[]>([]);
  //loading thing
  const [loading, setLoading] = useState(true);
  //error för ev errors
  const [error, setError] = useState("");
  //query: texten som användaren skriver för att söka
  const [query, setQuery] = useState("");
  //regioner, initial state kmr att vara "all"
  const [region, setRegion] = useState("All");
  //pages, börjar på 1
  const [page, setPage] = useState(1);
  //hur många länder som visas per sida
  const pageSize = 12;

  //useeffect för fetch på initial mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        //laddar medans vi fetchar
        setLoading(true);
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,region,capital,cca3,latlng,currencies,languages,subregion"
        );
        const data = await res.json();
        //sätter respektive data i vår response på
        //rätt plats i c, sparar det i mapped variabeln
        const mapped = data.map((c: any) => ({
          name: c.name.common,
          officialName: c.name.official,
          region: c.region,
          subregion: c.subregion,
          capital: c.capital?.[0],
          flagUrl: c.flags.png,
          latlng: c.capitalInfo?.latlng || c.latlng,
          cca3: c.cca3,
          languages: c.languages ? Object.values(c.languages) : [],
          currency: c.currencies ? Object.keys(c.currencies) : [],
        }));
        //ändrar countries till mapped variabeln
        setCountries(mapped);
      } catch {
        setError("Kunde inte hämta länder.");
        //släcker vår loading wheel
      } finally {
        setLoading(false);
      }
    };
    //anropar fetchcountries, som igen, endast körs on mount
    fetchCountries();
  }, []);

  //skapar arrayen filtered och filtrerar länder i countries
  //returnerar de som uppfyller villkor
  const filtered = countries.filter((c) => {
    //matchregion blir true om region === "All" samt
    //om c.region === region
    //alltså filtreras region om en användare har valt det
    const matchRegion = region === "All" || c.region === region;
    //standard query, matchquery är true om landets namn
    //innehåller det som query består av.
    const matchQuery = c.name.toLowerCase().includes(query.toLowerCase());
    return matchRegion && matchQuery;
  });

  //antal sidor när vi filtrerar, antalet filtrerade resultat
  //dividerad på pagesize som är 12, yieldar antal sidor
  //(avrundad uppåt)
  const totalPages = Math.ceil(filtered.length / pageSize);
  // personlig anteckning:
  //page har start och end (end (exklusive))
  //page - 1 * pageSize innebär:
  //page börjar på whatever, t.ex.
  //page(1), pagesize = 12
  //när page ändras vill vi ändra på starten av paginated
  //detta gör att endast de relevanta länder visas
  //så att man inte ser samma land två gånger

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  //kallar handleregionchange när användaren
  //ändrar region + sätter page på 1
  const handleRegionChange = (r: string) => {
    setRegion(r);
    setPage(1);
  };

  //kallar handlesearchchange när
  //användaren skriver i fältet, ändrar state på
  //query + sätter page på 1
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  if (loading) return <p className="p-4">Laddar...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <input
        type="text"
        placeholder="Sök land..."
        value={query}
        onChange={handleSearchChange}
        className="mb-4 p-2 border rounded w-full sm:w-1/2"
        aria-label="Sök land"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => handleRegionChange(r)}
            className={`px-4 py-2 rounded ${
              region === r ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {paginated.length === 0 ? (
        <p>Inga länder matchar dina kriterier.</p>
      ) : (
        <div className="justify-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginated.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Föregående
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Nästa
          </button>
        </div>
      )}
    </main>
  );
};

export default Home;
