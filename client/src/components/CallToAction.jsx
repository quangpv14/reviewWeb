import { Button } from 'flowbite-react';

export default function CallToAction() {
    return (
        <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
            <div className="flex-1 justify-center flex flex-col">
                <h2 className='text-2xl'>
                    Discover the latest tech reviews and
                    find the perfect gadgets for your needs.
                </h2>
                <p className='text-gray-500 my-2'>
                    Unbiased, in-depth reviews on the newest tech
                    products to help you make informed decisions
                </p>
                <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
                    <a href="#" rel='noopener noreferrer'>
                        Product Review
                    </a>
                </Button>
            </div>
            <div className="p-7 flex-1">
                <img src="https://cdn.tgdd.vn/Files/2018/08/12/1108714/technology_800x450.jpg" alt="Product Review" />
            </div>
        </div>
    )
}