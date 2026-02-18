"use client";

import React, { useState, useEffect } from "react";
import TaskCategoryPageClient from "./TaskCategoryPageClient";
import { API_BASE_URL } from "@/lib/api";
import Link from "next/link";

/**
 * Dynamic Task Category Page
 * Fetches category data from database and passes it to the client component
 */
const TaskCategoryPage = ({ params }) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slug, setSlug] = useState(null);

  // Handle params (can be sync or async in Next.js 13+)
  useEffect(() => {
    const getSlug = async () => {
      try {
        // Handle both sync and async params
        const resolvedParams = params instanceof Promise ? await params : params;
        const categorySlug = resolvedParams?.slug || "accountant";
        setSlug(categorySlug);
      } catch (err) {
        // Silent fallback - no console error
        setSlug("accountant");
      }
    };
    getSlug();
  }, [params]);

  // Fetch category data
  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/api/task-categories?slug=${slug}`);

        if (response.ok) {
          const data = await response.json();
          if (data.error) {
            setError(data.error);
            setCategory(null);
          } else {
            setCategory(data);
          }
        } else {
          const errorData = await response.json().catch(() => ({ error: "Category not found" }));
          setError(errorData.error || "Category not found");
          setCategory(null);
        }
      } catch (error) {
        // Silent error handling - no console errors
        setError("Failed to load category. Please try again later.");
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  if (loading || !slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">{error || "Category not found"}</div>
          <Link
            href="/"
            className="text-[var(--color-amber-500)] hover:text-amber-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return <TaskCategoryPageClient category={category} />;
};

export default TaskCategoryPage;
