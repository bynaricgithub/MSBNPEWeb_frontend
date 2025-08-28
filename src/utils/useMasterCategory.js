// src/hooks/useMasterCategory.js
import { useEffect, useState } from "react";
import API from "../API";
import { show } from "./Helper";

export default function useMasterCategory(categoryKey) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryKey) fetchCategories();
  }, [categoryKey]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get("/master-categories/listing");
      const allData = res.data?.data || {};
      const list = allData[categoryKey] || [];

      // console.log("Filtered Categories from", categoryKey, list);

      setCategories(list);
      if (list.length > 0) setSelectedCategory(list[0].value);
    } catch (error) {
      show({ message: "Failed to load categories", displayClass: "failure" });
    } finally {
      setLoading(false);
    }
  };

  return { categories, selectedCategory, setSelectedCategory, loading };
}
