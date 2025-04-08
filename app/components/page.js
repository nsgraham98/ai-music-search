"use client";
import { useEffect, useState } from "react";

const ExamplePage = () => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setResponse(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Example Page</h1>
      <p>This is an example page. {JSON.stringify(response)}</p>
    </div>
  );
};
export default ExamplePage;
