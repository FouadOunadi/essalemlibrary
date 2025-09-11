
import {FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa6';
import {FiMapPin, FiMail, FiPhone, FiClock } from 'react-icons/fi';
import Image from 'next/image';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: <FiPhone className="text-green-600" />,
      title: 'الهاتف',
      details: ['0658744115', '0668674585'],
      color: 'green'
    },
    {
      icon: <FiMail className="text-purple-600" />,
      title: 'البريد الإلكتروني',
      details: ['essalemlibrary@gmail.com'],
      color: 'purple'
    },
    {
      icon: <FiClock className="text-orange-600" />,
      title: 'ساعات العمل',
      details: ['السبت - الجمعة : 8:00 ص - 22:00 م'],
      color: 'red'
    }
  ];

  const socialLinks = [
    { icon: <FaWhatsapp />, name: 'واتساب', color: 'green', href: 'https://wa.me/0660025759' },
    { icon: <FaInstagram />, name: 'إنستغرام', color: 'purple', href: 'https://instagram.com/essalemlibrary' },
    { icon: <FaFacebook />, name: 'فيسبوك', color: 'blue', href: 'https://facebook.com/essalemlibrary' }
  ];

  return (
    <div className="min-h-screen bg-stone-100 font-tajawal">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            نحن هنا لخدمتك! تواصل معنا في أي وقت وسنكون سعداء للإجابة على استفساراتك
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* 3x2 Grid Layout - Responsive adjustments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Cards - Full width on mobile, 3 columns on desktop */}
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-xs hover:shadow-md transition-all duration-300 group col-span-1">
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-${info.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-xl">{info.icon}</div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm md:text-base text-gray-600 leading-relaxed">{detail}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second row - Social Media and Map */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Social Media - Full width on mobile, 1 column on desktop */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xs border border-gray-100 md:col-span-1">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center">تابعنا على</h3>
            <div className="flex flex-row md:flex-col gap-3 justify-center md:justify-start">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-${social.color}-50 rounded-2xl p-3 flex items-center justify-center border border-transparent hover:border-gray-200`}
                  title={social.name}
                >
                  <div className={`text-lg text-${social.color}-600`}>{social.icon}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Map Placeholder - Full width on mobile, 2 columns on desktop */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-2 shadow-xs border border-gray-100 h-64 md:h-auto">
            <a 
              href="https://maps.app.goo.gl/DL3cPdDZV6eXcBHn6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full h-full block rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="group w-full h-full relative rounded-xl overflow-hidden">
                <Image
                  src="/location.png"
                  alt="موقعنا على الخريطة"
                  fill
                  className="object-cover group-hover:scale-105 rounded-xl transition-transform duration-500"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute rounded-xl inset-0 bg-gradient-to-t from-slate-900/50 via-slate-800/20 to-transparent"></div>

                {/* Blur effect with clear center */}
                <div
                  className="absolute rounded-xl inset-0 backdrop-blur-sm"
                  style={{
                    maskImage: "radial-gradient(circle at center, transparent 80px, black 120px)",
                    WebkitMaskImage: "radial-gradient(circle at center, transparent 80px, black 120px)",
                  }}
                ></div>
                
                {/* Location indicator */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                  {/* Location icon */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg">
                    <FiMapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  {/* Arabic text */}
                  <span className="text-white text-xs md:text-sm font-tajawal font-bold bg-black/60 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full">
                    موقعنا على الخريطة
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;