import React from 'react';
import Faq from 'react-faq-component';

const data = {
    title: "FAQ (How it works)",
    rows: [
        {
            title: "What is Product's Review?",
            content: "Product's Review is a platform where users can find comprehensive reviews and ratings of " +
                "  various products. Our goal is to help you make informed purchasing decisions by providing " +
                "detailed insights and user feedback."
        },
        {
            title: "How do I submit a review?",
            content: "To submit a review, you need to create an account and log in. Once logged in, navigate to the product page you want to review and click the 'Write a Review' button. Fill out the review form and submit it for approval."
        },
        {
            title: "Can I edit my review after submitting it?",
            content: "Yes, you can edit your review after submitting it. Go to your profile page, find the review you want to edit, and click the 'Edit' button. Make your changes and save them."
        },
        {
            title: "How are the ratings calculated?",
            content: "Ratings are calculated based on user reviews. Each review includes a rating that contributes to the overall score of the product. We use an average of all submitted ratings to determine the product's overall rating."
        },
        {
            title: "Is my personal information safe?",
            content: "Yes, we prioritize your privacy and security. We use industry-standard encryption to protect your personal information. For more details, please read our Privacy Policy."
        }
    ]
};

const styles = {
    rowContentPaddingLeft: '10px', // Add some padding to the left if needed
    rowContentPaddingRight: '10px', // Add some padding to the right if needed
};

export default function Faqs() {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='max-w-2xl mx-auto p-3 '>
                <div>
                    <h1 className='text-3xl font-semibold text-center my-7'>
                        Frequently Asked Questions
                    </h1>
                    <div className='text-md text-gray-500 flex flex-col gap-6'>
                        <Faq data={data}
                            styles={styles}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
