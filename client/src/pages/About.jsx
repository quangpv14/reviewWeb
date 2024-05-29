import React from 'react';
import { Card } from "flowbite-react";

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font-semibold text-center my-7'>
            About Product's Review
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <div className="flex items-center gap-4">
              <Card href="#" className="max-w-sm">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Our Mission
                </h5>
                <p className="font-normal text-gray-600 dark:text-gray-400 text-justify">
                  At Product Review, we're dedicated to provide honest and comprehensive reviews of various products to empower consumers to make informed purchasing decisions.
                </p>
              </Card>
              <img src="https://t3.ftcdn.net/jpg/04/98/99/72/360_F_498997221_6H0H8sCjtKgTzpHireYOgIZ9ucevg2w9.jpg" alt="Product Review" className="w-250 h-250 rounded-full" />
            </div>

            <p className="text-left">
              Welcome to Product's Review! This platform was created to provide comprehensive reviews and ratings of various products. Our goal is to help you make informed purchasing decisions by offering detailed insights and user feedback.
            </p>

            <p className="text-left">
              Our team consists of passionate individuals who are dedicated to delivering high-quality content on products spanning different categories. Whether you're interested in technology, home appliances, or fashion, we've got you covered.
            </p>

            <p className="text-left">
              You'll find a wide range of articles, reviews, and tutorials on this platform, covering topics such as product comparisons, buying guides, and industry trends. We strive to keep you updated with the latest information to enhance your shopping experience.
            </p>

            <p className="text-left">
              We value community engagement and encourage you to participate by leaving comments, sharing your experiences, and interacting with other users. Your feedback is essential to us as we continuously work to improve and expand our offerings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
