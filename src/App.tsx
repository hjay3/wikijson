import React, { useState } from 'react';
import axios from 'axios';
import WikipediaSearch from './components/WikipediaSearch';
import JsonViewer from './components/JsonViewer';
import ImageGallery from './components/ImageGallery';
import './App.css';

const App = () => {
  const [pageData, setPageData] = useState({});
  const [imageLinks, setImageLinks] = useState<string[]>([]);

  const handleArticleSelect = async (title: string) => {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${title}&prop=text|images|categories|links|templates&format=json&origin=*`;
    try {
      const response = await axios.get(apiUrl);
      const parsedText = response.data.parse.text['*'];
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(parsedText, 'text/html');
      
      // Fix image URLs
      const images = doc.querySelectorAll('img');
      const links = Array.from(images)
        .map(img => {
          const src = img.getAttribute('src');
          if (!src) return null;
          // Convert relative URLs to absolute
          if (src.startsWith('//')) {
            return `https:${src}`;
          }
          // Filter out small icons and thumbnails
          const width = parseInt(img.getAttribute('width') || '0');
          return width > 50 ? src : null;
        })
        .filter((src): src is string => 
          src !== null && 
          !src.includes('Special:') && 
          !src.includes('static/images/')
        );

      setImageLinks(links);

      const structuredData = {
        title: response.data.parse.title,
        pageId: response.data.parse.pageid,
        categories: response.data.parse.categories.map((c: any) => c['*']),
        images: response.data.parse.images,
        links: response.data.parse.links.map((l: any) => l['*']),
        templates: response.data.parse.templates.map((t: any) => t['*']),
        imageUrls: links,
        sections: Array.from(doc.querySelectorAll('h2')).map(h2 => ({
          title: h2.textContent,
          content: h2.nextElementSibling?.textContent || ''
        }))
      };

      setPageData(structuredData);
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <WikipediaSearch onArticleSelect={handleArticleSelect} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JsonViewer data={pageData} />
        <ImageGallery images={imageLinks} />
      </div>
    </div>
  );
};

export default App;