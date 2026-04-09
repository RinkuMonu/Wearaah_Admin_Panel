import { useEffect, useState } from "react";
import api from "../serviceAuth/axios";

const SearchTest = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);

  // 🔥 Debounce Suggest API
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await api.get(`/variant/autosuggest?q=${query}`);
        console.log("Suggestions:", res.data);
        setSuggestions(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  // 🔍 Search API
  const handleSearch = async (value) => {
    try {
      const res = await api.get(`/variant/globalsearch?q=${value}`);
      console.log("Search Results:", res.data);
      setResults(res.data?.data || []);
      setSuggestions([]);
    } catch (err) {
      console.error(err);
    }
  };

  // 👉 Suggest click
  const handleSelect = (value) => {
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
      <h2>🔍 Elastic Search Test</h2>

      {/* 🔥 Input */}
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      {/* 🔥 Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div
          style={{
            border: "1px solid #ddd",
            borderTop: "none",
            background: "#fff",
          }}
        >
          {suggestions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {/* 🔥 Search Button */}
      <button
        onClick={() => handleSearch(query)}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Search
      </button>

      {/* 🔥 Results */}
      <div style={{ marginTop: "20px" }}>
        {results.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{item.name}</h4>
            <p>{item.brand}</p>
            <p>₹ {item.price}</p>
            <p>Size: {item.size}</p>
            <p>Color: {item.color}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchTest;
