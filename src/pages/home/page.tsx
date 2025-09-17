
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";



// ✅ Import Swiper at the top of your file

const testimonials = [
  {
    name: "Mr. & Mrs. Sharma",
    property: "DLF Magnolias",
    text: "Buying our dream home in Gurgaon seemed overwhelming at first, but Rajeev made the entire process seamless. His knowledge of the luxury market, attention to detail, and ability to understand exactly what we wanted stood out. He found us a property that checked every box — location, design, and investment value. We couldn’t have asked for a better guide.",
  },
  {
    name: "Dr. Mehta",
    property: "The Camellias",
    text: "Rajeev is not just a realtor; he’s a trusted advisor. From the very first meeting, he understood our requirements, respected our time, and showed us only the most relevant properties. His insights into market trends helped us make a smart decision, and today we are proud owners of a home we truly love. Highly recommended for anyone looking for luxury real estate in Gurgaon.",
  },
  {
    name: "Mr. Kapoor",
    property: "Ambience Caitriona",
    text: "What impressed us most about Rajeev was his integrity and professionalism. In Gurgaon’s fast-moving luxury real estate market, he gave us the confidence to make the right choice. He handled every detail — negotiations, paperwork, and coordination — so smoothly that the entire journey felt effortless. We are grateful for his guidance.",
  },
  {
    name: "Mrs. Arora",
    property: "DLF The Grove",
    text: "Rajeev’s network and expertise are unmatched. He helped us secure an exclusive property that wasn’t even listed on the market. The way he manages client relationships — with discretion, patience, and genuine care — is rare. Thanks to him, we now have a beautiful home in one of Gurgaon’s most sought-after communities.",
  },
  {
    name: "Mr. & Mrs. Khanna",
    property: "The Crest",
    text: "As NRIs, we were nervous about investing in Gurgaon real estate from abroad. Rajeev gave us complete peace of mind — from virtual tours to legal formalities, he handled everything with precision. His honest advice and constant updates made us feel fully involved despite the distance. Today, we are proud owners of a luxury residence, all thanks to him.",
  },
  {
    name: "Mr. & Mrs. Bansal",
    property: "DLF Aralias",
    text: "Rajeev has a deep understanding of Gurgaon’s luxury market and an incredible ability to match clients with the right home. He showed us options that were perfectly aligned with our taste and lifestyle. His guidance gave us complete confidence, and the property we bought feels like it was meant for us.",
  },
  {
    name: "Mr. Malhotra",
    property: "M3M Golf Estate",
    text: "What sets Rajeev apart is his personal touch. He treats every client’s search as if it were his own. We never felt rushed or pressured — instead, we felt heard and supported throughout. The home we purchased is everything we dreamed of, and Rajeev made that possible.",
  },
  {
    name: "Mrs. Singh",
    property: "DLF Magnolias",
    text: "Professionalism at its best. Rajeev is thorough, transparent, and truly invested in his clients’ happiness. He guided us through every step, from shortlisting to negotiation, and secured us a wonderful property at the right value. We always felt we were in safe hands.",
  },
  {
    name: "Mr. & Mrs. Gupta",
    property: "The Camellias",
    text: "For us, buying a luxury home was not just a financial decision but an emotional one. Rajeev respected that completely. His patience, market expertise, and genuine care ensured we found a place that feels like home the moment we walk in. We couldn’t be more thankful.",
  },
  {
    name: "Mr. Khurana",
    property: "Ambience Caitriona",
    text: "Rajeev’s reputation in the Gurgaon luxury segment is well deserved. His professionalism, discretion, and ability to deliver beyond expectations make him a class apart. He helped us acquire a property that fit our lifestyle perfectly, and the entire process felt effortless because of his expertise.",
  },
];

// export default function TestimonialsSection() {
//   return (
    
//   );
// }


interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  is_rental?: boolean;
  image_url: string;
  area?: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [consultationData, setConsultationData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    serviceType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [isConsultationSubmitting, setIsConsultationSubmitting] = useState(false);
  const [consultationSubmitStatus, setConsultationSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loadingProperties, setLoadingProperties] = useState(true);

  // ✅ Reusable Counter Component
const StatsCounters = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref} className="grid grid-cols-2 gap-8 mb-10">
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-600 mb-3">
          {inView && <CountUp end={450} duration={4} />}+
        </div>
        <div className="text-lg text-gray-700">Properties Sold</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-600 mb-3">
          ₹{inView && <CountUp end={500} duration={4} />}Cr+
        </div>
        <div className="text-lg text-gray-700">Sales Volume</div>
      </div>
    </div>
  );
};


  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoadingProperties(true);
      console.log('Loading featured properties from database...');
      
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-properties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Featured properties loaded successfully:', data.count, 'properties');
        // Show first 3 properties as featured, or empty array if no properties
        const featuredProperties = data.properties?.slice(0, 3) || [];
        setProperties(featuredProperties);
      } else {
        console.error('Failed to load properties:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        setProperties([]);
      }
    } catch (error) {
      console.error('Error loading featured properties:', error);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConsultationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConsultationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('message', formData.message);

      const response = await fetch('https://readdy.ai/api/form/submit/contact_form_67633e4e4c94b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultationSubmitting(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/submit-consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      });

      if (response.ok) {
        setConsultationSubmitStatus('success');
        setConsultationData({
          name: '',
          email: '',
          phone: '',
          preferredDate: '',
          preferredTime: '',
          serviceType: '',
          message: ''
        });
        setTimeout(() => {
          setShowConsultationForm(false);
          setConsultationSubmitStatus('idle');
        }, 3000);
      } else {
        setConsultationSubmitStatus('error');
      }
    } catch (error) {
      setConsultationSubmitStatus('error');
    } finally {
      setIsConsultationSubmitting(false);
    }
  };

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  const formatPrice = (price: number, isRental: boolean = false) => {
    if (isRental) {
      return `₹${price.toLocaleString()}/mo`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'For Sale': return 'bg-blue-600';
      case 'For Rent': return 'bg-green-600';
      case 'Investment': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/image.png"
                alt="Rajeev Mittal Logo" 
                className="h-16 w-auto cursor-pointer"
                onClick={() => navigate('/')}
              />
              <button
                onClick={() => navigate('/')}
                className="text-1xl font-bold text-gray-800 cursor-pointer"
              >
                Rajeev Mittal
              </button>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Home</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">About</a>
                <button onClick={() => navigate('/properties')} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Properties</button>
                <a href="#services" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Services</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Contact</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://wa.me/9811017103" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer">
                <i className="ri-whatsapp-line text-white w-4 h-4 flex items-center justify-center"></i>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center bg-cover bg-center" style={{
        backgroundImage: 'url(https://image2url.com/images/1758118053238-b322dd25-bf6f-4d67-a6b3-1f02f025ebff.jpg)'
      }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-left text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your Dream Home<br />
              <span className="text-blue-400">Awaits</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Expert real estate guidance with personalized service. Let me help you find the perfect property or sell your home for the best price.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer inline-block text-center">
                Start Your Journey
              </a>
              <button onClick={() => navigate('/properties')} className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer inline-block text-center">
                Browse Properties
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-8">Meet Rajeev Mittal</h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
               With over 30 years in Gurgaon’s real estate, we’ve helped families, corporates, and investors find dream homes and high-return opportunities since 1990.

We’re trusted partners of top developers like DLF, EMAAR, TATA, Vatika, Unitech, IREO, Homestead, and more, and proudly serve leading corporates including IBM, Nestlé, Coca-Cola, American Express, Airtel, and Max Life.

Our expertise lies in premium and ultra-luxury properties—from iconic residences like DLF Camellias, Magnolias, Aralias, Central Park, The Crest, and World Spa to exclusive high-end rentals for diplomats and expats.

For us, it’s not about closing deals—it’s about building relationships that last a lifetime.
              </p>
            {/* ✅ Animated Counters */}
              <StatsCounters />
              <button 
                onClick={() => setShowConsultationForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-lg font-semibold whitespace-nowrap cursor-pointer"
              >
                Schedule Consultation
              </button>
            </div>
            <div className="relative">
              <img 
                alt="Rajeev Mittal" 
                className="rounded-lg shadow-lg object-cover w-full h-[500px] object-top" 
                src="https://image2url.com/images/1758081839443-f1caa703-d629-4030-be4d-15dc4509a6cd.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">My Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive real estate solutions tailored to your unique needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-home-4-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Home Buying</h3>
              <p className="text-gray-600">
                Expert guidance through every step of the home buying process, from search to closing.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-price-tag-3-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Home Selling</h3>
              <p className="text-gray-600">
                Strategic marketing and pricing to sell your property quickly and for the best price.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-line-chart-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Investment Properties</h3>
              <p className="text-gray-600">
                Identify profitable investment opportunities and build your real estate portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="properties" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exceptional properties carefully selected for discerning buyers
            </p>
          </div>
          
          {loadingProperties ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading featured properties...</p>
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-product-shop>
                {properties.map((property) => (
                  <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                    <div className="relative">
                      <img 
                        alt={property.title}
                        className="w-full h-64 object-cover object-top" 
                        src={property.image_url}
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`${getStatusColor(property.status)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                          {property.status}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                          {property.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                      <p className="text-gray-600 mb-4 flex items-center">
                        <i className="ri-map-pin-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                        {property.location}
                        {property.area && <span className="ml-2 text-blue-600 font-medium">• {property.area}</span>}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPrice(property.price, property.is_rental)}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <i className="ri-home-4-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                          {property.type}
                        </span>
                      </div>
                      <button 
                        onClick={() => handlePropertyClick(property.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer"
                      >
                        See Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <button 
                  onClick={() => navigate('/properties')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer"
                >
                  View All Properties
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-home-4-line text-gray-400 text-3xl w-12 h-12 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No Properties Available</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Properties added through your admin dashboard will appear here as featured listings.
              </p>
              <div className="text-center mt-12">
                <button 
                  onClick={() => navigate('/properties')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer"
                >
                  Browse All Properties
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Client Testimonials</h2>
          <p className="text-xl text-gray-600">What my clients say about working with me</p>
        </div>

        <div className='Relative'>
          <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1 },  // mobile
                768: { slidesPerView: 2 },  // tablet
                1024: { slidesPerView: 3 }, // desktop
              }}
              className="w-full overflow-visible"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i} className='h-full flex'>
              <div className="bg-gray-50 p-8 rounded-lg shadow hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900">{t.name}</h4>
                  <p className="text-gray-600 text-sm">{t.property}</p>
                </div>
                <p className="text-gray-700 italic">"{t.text}"</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>  
        
      </div>
    </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">Ready to start your real estate journey? Let's connect!</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <i className="ri-phone-line text-white w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">(+91) 9811017103</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <i className="ri-mail-line text-white w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">rajeevmittal_dlf@hotmail.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <i className="ri-map-pin-line text-white w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Office</p>
                    <p className="text-gray-600">123, DLF Qutub Plaza,DLF City-1<br />Gurugram, (Hry) 122002</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center mr-4 cursor-pointer">
                    <i className="ri-whatsapp-line text-white w-4 h-4 flex items-center justify-center"></i>
                  </button>
                  <div>
                    <p className="font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-gray-600">Quick response guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send me a message</h3>
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  Thank you for your message! I'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit} id="contact_form" data-readdy-form>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    placeholder="I'm interested in buying a home in the downtown area..."
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors duration-200`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      {showConsultationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">Schedule Consultation</h3>
                <button 
                  onClick={() => setShowConsultationForm(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
                </button>
              </div>
              
              {consultationSubmitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  Consultation scheduled successfully! I'll contact you soon to confirm.
                </div>
              )}
              {consultationSubmitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  Sorry, there was an error scheduling your consultation. Please try again.
                </div>
              )}
              
              <form className="space-y-4" onSubmit={handleConsultationSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={consultationData.name}
                    onChange={handleConsultationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    placeholder="Sarah Johnson"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={consultationData.email}
                    onChange={handleConsultationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    placeholder="sarah@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={consultationData.phone}
                    onChange={handleConsultationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    placeholder="(555) 987-6543"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                    <input 
                      type="date"
                      name="preferredDate"
                      value={consultationData.preferredDate}
                      onChange={handleConsultationChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                    <input 
                      type="time"
                      name="preferredTime"
                      value={consultationData.preferredTime}
                      onChange={handleConsultationChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    name="serviceType"
                    value={consultationData.serviceType}
                    onChange={handleConsultationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="home-buying">Home Buying</option>
                    <option value="home-selling">Home Selling</option>
                    <option value="investment">Investment Properties</option>
                    <option value="consultation">General Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                  <textarea 
                    name="message"
                    value={consultationData.message}
                    onChange={handleConsultationChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    placeholder="Any specific requirements or questions..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isConsultationSubmitting}
                  className={`w-full ${isConsultationSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors duration-200`}
                >
                  {isConsultationSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Rajeev Mittal</h3>
              <p className="text-gray-400 mb-4">
                Expert real estate guidance with personalized service for buyers and sellers.
              </p>
              <div className="flex space-x-4">
                {/* <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  <i className="ri-facebook-fill w-5 h-5 flex items-center justify-center"></i>
                </a> */}
                <a href="https://www.instagram.com/rajeev_mittal_6?igsh=ZnFqMTd1aXB0aXo1" className="text-gray-400 hover:text-white cursor-pointer">
                  <i className="ri-instagram-line w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="https://www.linkedin.com/in/rajeev-mittal-47b51a33?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " className="text-gray-400 hover:text-white cursor-pointer">
                  <i className="ri-linkedin-fill w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="https://wa.me/9811017103" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white cursor-pointer">
                  <i className="ri-whatsapp-line w-5 h-5 flex items-center justify-center"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white cursor-pointer">Home</a></li>
                <li><a href="#about" className="hover:text-white cursor-pointer">About</a></li>
                <li><button onClick={() => navigate('/properties')} className="hover:text-white cursor-pointer">Properties</button></li>
                <li><a href="#services" className="hover:text-white cursor-pointer">Services</a></li>
                <li><a href="#contact" className="hover:text-white cursor-pointer">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Home Buying</li>
                <li>Home Selling</li>
                <li>Investment Properties</li>
                <li>Market Analysis</li>
                <li>Consultation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <i className="ri-phone-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                  (+91)9811017103
                </li>
                <li className="flex items-center">
                  <i className="ri-mail-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                  rajeevmittal_dlf@hotmail.com
                </li>
                <li className="flex items-center">
                  <i className="ri-map-pin-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                  123, DLF Qutub Plaza,DLF City-1<br />Gurugram, (Hry) 122002
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Rajeev Mittal Realty. All rights reserved.<br/>Rera Approved 
-Registration Number GGM/107/2017/1R/140/Ext1/2022/2021</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
