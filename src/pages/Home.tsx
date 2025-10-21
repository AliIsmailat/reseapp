import React, { useEffect, useState } from "react";

const Home: React.FC = () => {
  const [countries, setCountries] = useState<any[]>([]); // vi vet inte strukturen exakt än

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,region,capital,cca3,latlng,currencies,languages,subregion"
        );
        const data = await res.json();
        console.log("Fetched countries:", data);
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return <></>;
};

export default Home;
