import React, { useState, useEffect } from 'react';

// Using functional placeholder images to simulate a more visually appealing design.
const INITIAL_IMAGES = {
  home: 'https://placehold.co/1920x1080/1c2635/e0c476?text=Welcome+to+Café+Fausse',
  cafeInterior: 'https://placehold.co/1200x800/1c2635/e0c476?text=Elegant+Interior',
  ribeyeSteak: 'https://placehold.co/1200x800/1c2635/e0c476?text=Our+Signature+Ribeye',
  specialEvent: 'https://placehold.co/1200x800/1c2635/e0c476?text=Special+Events',
};

// Modal component for messages
const MessageModal = ({ message, type, onClose }) => {
  if (!message) return null;

  const modalClasses = type === 'success'
    ? 'bg-green-100 border-green-400 text-green-700'
    : 'bg-red-100 border-red-400 text-red-700';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className={`relative p-8 border-4 ${modalClasses} rounded-lg shadow-xl max-w-sm mx-auto`}>
        <div className="text-center">
          <p className="font-bold text-lg">{type === 'success' ? 'Success!' : 'Error!'}</p>
          <p className="mt-2 text-sm">{message}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Common header component for all pages
const Header = ({ currentPage, setCurrentPage }) => (
  <header className="bg-sky-950 text-stone-300 p-4 lg:p-6 shadow-lg fixed w-full z-10 top-0">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
      <h1 className="text-3xl font-serif tracking-widest cursor-pointer" onClick={() => setCurrentPage('home')}>
        Café Fausse
      </h1>
      <nav className="mt-4 md:mt-0">
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-lg">
          <li>
            <a onClick={() => setCurrentPage('home')} className={`hover:text-yellow-300 transition-colors cursor-pointer ${currentPage === 'home' ? 'text-yellow-300' : ''}`}>Home</a>
          </li>
          <li>
            <a onClick={() => setCurrentPage('menu')} className={`hover:text-yellow-300 transition-colors cursor-pointer ${currentPage === 'menu' ? 'text-yellow-300' : ''}`}>Menu</a>
          </li>
          <li>
            <a onClick={() => setCurrentPage('reservations')} className={`hover:text-yellow-300 transition-colors cursor-pointer ${currentPage === 'reservations' ? 'text-yellow-300' : ''}`}>Reservations</a>
          </li>
          <li>
            <a onClick={() => setCurrentPage('about')} className={`hover:text-yellow-300 transition-colors cursor-pointer ${currentPage === 'about' ? 'text-yellow-300' : ''}`}>About Us</a>
          </li>
          <li>
            <a onClick={() => setCurrentPage('gallery')} className={`hover:text-yellow-300 transition-colors cursor-pointer ${currentPage === 'gallery' ? 'text-yellow-300' : ''}`}>Gallery</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

// Home Page
const HomePage = ({ images }) => (
  <div className="relative">
    <img src={images.home} alt="Café Fausse Interior" className="w-full h-screen object-cover" />
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="text-center text-white px-4">
        <h2 className="text-5xl md:text-7xl font-bold font-serif tracking-wide drop-shadow-lg">Café Fausse</h2>
        <p className="mt-4 text-xl md:text-2xl font-light">Elegance in every dish. Tradition in every flavor.</p>
        <div className="mt-8 text-lg font-light">
          <p>1234 Culinary Ave, Suite 100, Washington, DC 20002</p>
          <p>(202) 555-4567</p>
          <p>Hours: Mon-Sat: 5:00PM - 11:00 PM | Sun: 5:00 PM - 9:00 PM</p>
        </div>
      </div>
    </div>
  </div>
);

// Menu Page
const MenuPage = ({ images }) => {
  const menuItems = [
    { category: 'Starters', items: [
      { name: 'Bruschetta', description: 'Fresh tomatoes, basil, olive oil, and toasted baguette slices', price: 8.50, image: images.bruschetta },
      { name: 'Caesar Salad', description: 'Crisp romaine with homemade Caesar dressing', price: 9.00, image: images.caesarSalad }
    ]},
    { category: 'Main Courses', items: [
      { name: 'Grilled Salmon', description: 'Served with lemon butter sauce and seasonal vegetables', price: 22.00, image: images.grilledSalmon },
      { name: 'Ribeye Steak', description: '12 oz prime cut with garlic mashed potatoes', price: 28.00, image: images.ribeyeSteak },
      { name: 'Vegetable Risotto', description: 'Creamy Arborio rice with wild mushrooms', price: 18.00, image: images.vegetableRisotto }
    ]},
    { category: 'Desserts', items: [
      { name: 'Tiramisu', description: 'Classic Italian dessert with mascarpone', price: 7.50, image: images.tiramisu },
      { name: 'Cheesecake', description: 'Creamy cheesecake with berry compote', price: 7.00, image: images.cheesecake }
    ]},
    { category: 'Beverages', items: [
      { name: 'Red Wine (Glass)', description: 'A selection of Italian reds', price: 10.00, image: null },
      { name: 'White Wine (Glass)', description: 'Crisp and refreshing', price: 9.00, image: null },
      { name: 'Craft Beer', description: 'Local artisan brews', price: 6.00, image: null },
      { name: 'Espresso', description: 'Strong and aromatic', price: 3.00, image: null }
    ]}
  ];

  return (
    <div className="pt-24 min-h-screen bg-sky-950 text-stone-300">
      <div className="container mx-auto p-4 md:p-8">
        <h2 className="text-5xl font-serif font-bold text-center mb-12">Our Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((section, index) => (
            <div key={index} className="bg-sky-800 rounded-lg shadow-xl p-6">
              <h3 className="text-3xl font-bold font-serif border-b-2 border-yellow-300 pb-2 mb-6">{section.category}</h3>
              <ul className="space-y-6">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0 shadow-md" />
                    )}
                    <div className="flex-grow">
                      <div className="flex justify-between items-end">
                        <p className="font-semibold text-lg">{item.name}</p>
                        <p className="font-mono">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-stone-400 mt-1">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Reservations Page
const ReservationsPage = ({ showMessage, closeMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    num_guests: 1,
    time_slot: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          num_guests: 1,
          time_slot: '',
        });
      } else {
        showMessage(data.message || data.error, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('An error occurred. Please try again later.', 'error');
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-stone-100 flex items-center justify-center">
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center text-sky-950 mb-6">Make a Reservation</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sky-950">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-950">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-950">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-950">Time Slot</label>
              <input
                type="datetime-local"
                name="time_slot"
                value={formData.time_slot}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-950">Number of Guests</label>
              <input
                type="number"
                name="num_guests"
                min="1"
                value={formData.num_guests}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// About Us Page
const AboutUsPage = () => (
  <div className="pt-24 min-h-screen bg-stone-100 flex items-center justify-center">
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-center text-sky-950 mb-6">About Us</h2>
        <p className="text-lg text-gray-600 leading-relaxed text-center mb-6">
          Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez, Café Fausse blends traditional Italian flavors with modern culinary innovation. Our mission is to provide an unforgettable dining experience that reflects both quality and creativity.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed text-center mb-6">
          At Café Fausse, we are committed to using locally sourced, fresh ingredients to create exquisite dishes that delight the senses. Chef Rossi's innovative techniques, combined with Maria Lopez's passion for hospitality, have made our restaurant a destination for food enthusiasts.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mt-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800">Chef Antonio Rossi</h3>
            <p className="text-gray-500">Founder & Head Chef</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800">Maria Lopez</h3>
            <p className="text-gray-500">Founder & Restaurateur</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Gallery Page
const GalleryPage = ({ images }) => {
  const galleryImages = [
    { src: images.cafeInterior, alt: 'Café Fausse Interior Ambiance' },
    { src: images.ribeyeSteak, alt: 'Ribeye Steak from the menu' },
    { src: images.specialEvent, alt: 'Special event at Café Fausse' },
    // Add more images here
  ];

  const awards = [
    'Culinary Excellence Award - 2022',
    'Restaurant of the Year - 2023',
    'Best Fine Dining Experience - Foodie Magazine, 2023'
  ];

  const reviews = [
    '"Exceptional ambiance and unforgettable flavors." - Gourmet Review',
    '"A must-visit restaurant for food enthusiasts." - The Daily Bite"'
  ];

  const [lightboxImage, setLightboxImage] = useState(null);

  const openLightbox = (src) => setLightboxImage(src);
  const closeLightbox = () => setLightboxImage(null);

  return (
    <div className="pt-24 min-h-screen bg-stone-100">
      <div className="container mx-auto p-4 md:p-8">
        <h2 className="text-5xl font-serif font-bold text-center text-sky-950 mb-12">Gallery & Accolades</h2>
        
        {/* Gallery Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryImages.map((image, index) => (
            <div key={index} className="rounded-lg shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={() => openLightbox(image.src)}>
              <img src={image.src} alt={image.alt} className="w-full h-72 object-cover" />
            </div>
          ))}
        </div>

        {/* Awards and Reviews Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
          <h3 className="text-3xl font-serif font-bold text-sky-950 border-b-2 border-yellow-300 pb-2 mb-6">Our Awards & Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-sky-950 mb-4">Awards</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {awards.map((award, index) => <li key={index}>{award}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-sky-950 mb-4">Customer Reviews</h4>
              <ul className="space-y-4">
                {reviews.map((review, index) => (
                  <li key={index} className="italic text-gray-600">
                    "{review}"
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={closeLightbox}>
          <img src={lightboxImage} alt="Enlarged view" className="max-w-full max-h-full rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

// Newsletter Signup Component
const NewsletterSignup = ({ showMessage, closeMessage }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        setEmail('');
      } else {
        showMessage(data.error, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('An error occurred. Please try again later.', 'error');
    }
  };

  return (
    <div className="bg-sky-950 text-stone-300 py-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-3xl font-serif font-bold mb-4">Join Our Newsletter</h3>
        <p className="text-lg mb-6">Stay up-to-date with our latest news and special offers.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full max-w-sm px-4 py-2 rounded-md text-gray-800"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [images, setImages] = useState(INITIAL_IMAGES);
  const [isLoading, setIsLoading] = useState(true);

  const showMessage = (text, type) => {
    setMessage({ text, type });
  };

  const closeMessage = () => {
    setMessage({ text: '', type: '' });
  };

  const generateImages = async () => {
    const foodPrompts = {
      bruschetta: 'High quality professional photo of Bruschetta, fine dining, rustic plate, top-down shot, shallow depth of field, warm lighting',
      caesarSalad: 'High quality professional photo of Caesar Salad, fine dining presentation, creamy dressing, clean background, modern photography',
      grilledSalmon: 'High quality professional photo of a grilled salmon fillet with lemon slices and herbs, fine dining, on a white plate, natural lighting, moody atmosphere',
      ribeyeSteak: 'High quality professional photo of a perfectly cooked ribeye steak, seared crust, medium-rare interior, on a dark plate, with a side of potatoes, cinematic lighting',
      vegetableRisotto: 'High quality professional photo of creamy vegetable risotto, a sprinkle of parmesan, with a spoon in the bowl, fine dining',
      tiramisu: 'High quality professional photo of a slice of tiramisu dessert, powdered cocoa on top, elegant white plate, fine dining, warm ambient light',
      cheesecake: 'High quality professional photo of cheesecake with a berry compote, on a modern plate, elegant fine dining presentation'
    };

    const newImages = { ...INITIAL_IMAGES };
    let attempt = 0;
    const maxAttempts = 5;
    let successful = false;
    
    try {
      for (const [key, prompt] of Object.entries(foodPrompts)) {
        successful = false;
        attempt = 0;
        while (!successful && attempt < maxAttempts) {
          try {
            const payload = { instances: { prompt }, parameters: { "sampleCount": 1 } };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;
            if (base64Data) {
              newImages[key] = `data:image/png;base64,${base64Data}`;
              successful = true;
            } else {
              throw new Error('No image data returned from API.');
            }
          } catch (error) {
            console.error(`Attempt ${attempt + 1} failed for ${key}:`, error);
            attempt++;
            if (attempt < maxAttempts) {
              const delay = Math.pow(2, attempt) * 1000;
              console.log(`Retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }
      }
    } finally {
      setImages(newImages);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    generateImages();
  }, []);

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="pt-24 min-h-screen flex items-center justify-center bg-stone-100">
          <p className="text-xl font-bold text-sky-950">Generating menu images, please wait...</p>
        </div>
      );
    }
    switch (currentPage) {
      case 'home':
        return <HomePage images={images} />;
      case 'menu':
        return <MenuPage images={images} />;
      case 'reservations':
        return <ReservationsPage showMessage={showMessage} closeMessage={closeMessage} />;
      case 'about':
        return <AboutUsPage />;
      case 'gallery':
        return <GalleryPage images={images} />;
      default:
        return <HomePage images={images} />;
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-stone-100">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="pt-16">
        {renderPage()}
        <NewsletterSignup showMessage={showMessage} closeMessage={closeMessage} />
      </main>
      <MessageModal message={message.text} type={message.type} onClose={closeMessage} />
    </div>
  );
}
