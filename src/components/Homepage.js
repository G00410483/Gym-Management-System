
import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from './ExampleCarouselImage';

function Homepage() {
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center">
                {/* Define a Carousel component with a fixed width and height */}
                <Carousel style={{ width: '32rem', height: '300px' }}>
                    {/* Map through the carouselImages array to create individual carousel items */}
                    {ExampleCarouselImage.map((imageUrl, index) => (
                        <Carousel.Item key={index}>
                            {/* Display an image with the following properties */}
                            <img
                                className="d-block w-100"
                                src={imageUrl}
                                alt={`Slide ${index + 1}`}
                                style={{ height: '300px' }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}

export default Homepage;
