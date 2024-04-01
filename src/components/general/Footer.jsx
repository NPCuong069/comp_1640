import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact information */}
            <div>
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="mailto:abc@gmail.com" className="hover:text-gray-300">abc@gmail.com</a>
                </li>
                <li>
                  <span>40 Cong Hoa St, Ho Chi Minh city, Viet Nam</span>
                </li>
              </ul>
            </div>

            {/* Additional Resources */}
            <div>
              <h2 className="text-lg font-semibold">Additional Resources</h2>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="hover:text-gray-300">About the magazine</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">Terms and conditions</a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h2 className="text-lg font-semibold">Social Media</h2>
              <div className="flex mt-4 space-x-6">
                {/* Replace with actual social media icons */}
                <a href="#" className="hover:text-gray-300">Facebook</a>
                <a href="#" className="hover:text-gray-300">Twitter</a>
                <a href="#" className="hover:text-gray-300">YouTube</a>
                <a href="#" className="hover:text-gray-300">Instagram</a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 md:flex md:items-center md:justify-between">
          <div className="mt-4 md:mt-0">
            <p>
              &copy; 2024 University Name. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;