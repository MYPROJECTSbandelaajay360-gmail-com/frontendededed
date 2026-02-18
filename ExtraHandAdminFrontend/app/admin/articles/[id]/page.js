"use client";
import { useEffect, useState } from 'react';
import { getArticleById } from '../../../../../lib/api';
import { useRouter } from 'next/navigation';

const ViewArticle = ({ params }) => {
  const { id } = params;
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const data = await getArticleById(id);
          setArticle(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchArticle();
    }
  }, [id]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded mb-4">
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-600 mb-2"><strong>Article ID:</strong> {article._id}</p>
      {article.author && <p className="text-gray-600 mb-4"><strong>Author:</strong> {article.author.name}</p>}
      
      {article.image && (
        <div className="mb-4">
          <img src={`http://localhost:5000${article.image}`} alt={article.title} className="w-full h-auto object-cover" />
        </div>
      )}
      
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
};

export default ViewArticle;