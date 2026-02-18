// Import global CSS styles for the entire application
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Metadata for the website
 * This information is used by search engines and browsers
 */
export const metadata = {
  title: 'TheBakeStory Admin',
  description: 'Admin portal for TheBakeStory bakery management',
};

/**
 * Root Layout Component
 * 
 * This is the main layout wrapper for all pages in the application.
 * It wraps every page with the Navbar and provides the HTML structure.
 * 
 * @param {Object} children - The page content that will be rendered inside this layout
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body>
        <main>{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}

